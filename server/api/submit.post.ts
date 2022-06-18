import { defineHandler, useQuery, useBody } from 'h3'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

export default defineHandler(async (event) => {
  // get and validate the query
  const query = useQuery(event)
  if (query.inbox_id === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing inbox_id',
    })
  }

  const inbox_id = parseInt(query.inbox_id.toString())

  if (isNaN(inbox_id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid inbox_id',
    })
  }

  // get and validate the body
  const body = await useBody(event)

  const submissionSchema = z.array(
    z.object({
      field: z.string(),
      value: z.string(),
    })
  )

  const submission = submissionSchema.parse(body)

  // set up the supabase connection
  const config = useRuntimeConfig()

  const supabase = createClient(
    config.public.supabase.url,
    config.public.supabase.key
  )

  // create a new submission and get an id from the database
  const { data: submissionData, error: submissionError } = await supabase
    .from('submissions')
    .insert({ inbox_id })

  const { id: submission_id } = submissionData[0]

  // use that id to create a new submission value record that links back to the submission
  const { data: valuesData, error: valuesError } = await supabase
    .from('submission_values')
    .insert(
      body.map((submission) => ({
        ...submission,
        submission_id,
      }))
    )

  return {
    inbox_id,
    submissionData,
    submissionError,
    valuesData,
    valuesError,
  }
})
