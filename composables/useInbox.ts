interface SubmissionValue {
  id: number
  created_at: string
  submission_id: number
  field: string
  value: any
}

interface Submission {
  id: number
  created_at: string
  inbox_id: number
}

interface Inbox {
  id?: number
  created_at?: string
  name?: string
  receive_emails?: boolean
  use_id?: string
}

export default function useInbox(inbox_id: string | string[]) {
  const client = useSupabaseClient()

  const _inboxData = ref<Inbox>({})
  const _submissions = ref<Submission[]>([])
  const _submissionValues = ref<SubmissionValue[]>([])

  const submissions = computed(() => {
    const output = []

    for (const submission of _submissions.value) {
      const values = _submissionValues.value.filter(
        (value) => value.submission_id === submission.id
      )

      output.push({
        ...submission,
        values,
      })
    }

    return output
  })

  const refreshData = async () => {
    const { data: inboxData } = await client.from('inboxes').select().match({
      id: inbox_id,
    })

    _inboxData.value = inboxData[0]

    const { data: submissionsData }: { data: Submission[] } = await client
      .from('submissions')
      .select()
      .match({ inbox_id })
      .order('created_at', { ascending: false })

    _submissions.value = submissionsData

    const { data: submissionValuesData }: { data: SubmissionValue[] } =
      await client.from('submission_values').select()

    _submissionValues.value = submissionValuesData
  }

  const addSubmission = async (values: SubmissionValue[]) => {
    // create a new submission and get an id from the database
    const { data: submissionData, error: submissionError } = await client
      .from('submissions')
      .insert({ inbox_id })

    const { id: submission_id } = submissionData[0]

    // use that id to create a new submission value record that links back to the submission
    const { data: valuesData, error: valuesError } = await client
      .from('submission_values')
      .insert(
        values.map((submissionValue) => ({
          ...submissionValue,
          submission_id,
        }))
      )

    refreshData()
  }

  let submissionsSubscription: any
  let submissionValuesSubscription: any

  onBeforeMount(async () => {
    refreshData()

    submissionsSubscription = client
      .from('submissions')
      .on('*', (payload) => {
        refreshData()
      })
      .subscribe()

    submissionValuesSubscription = client
      .from('submission_values')
      .on('*', (payload) => {
        refreshData()
      })
      .subscribe()
  })

  onUnmounted(() => {
    client.removeSubscription(submissionsSubscription)
    client.removeSubscription(submissionValuesSubscription)
  })

  return {
    name: _inboxData.value.name,
    submissions,
    addSubmission,
    _inboxData,
  }
}
