interface Inbox {
  id: number
  created_at: string
  name: string
  receive_emails: boolean
  user_id: string
}

export default function useInboxes() {
  const client = useSupabaseClient()

  const inboxes = useState<Inbox[]>('inboxes', () => [])

  const addInbox = async (inbox: Inbox) => {
    const { data }: { data: Inbox[] } = await client
      .from('inboxes')
      .insert(inbox)

    if (data.length) {
      inboxes.value.push(data[0])
    }
  }

  const deleteInbox = async (id: number) => {
    await client.from('inboxes').delete().match({ id })

    inboxes.value = inboxes.value.filter((inbox) => inbox.id !== id)
  }

  onBeforeMount(async () => {
    const { data } = await client.from<Inbox>('inboxes').select()
    inboxes.value = data
  })

  return {
    inboxes,
    addInbox,
    deleteInbox,
  }
}
