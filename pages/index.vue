<script setup lang="ts">
const client = useSupabaseClient()

interface Inbox {
  id: number
  created_at: string
  name: string
  receive_emails: boolean
  user_id: string
}

const { data, error } = await client.from<Inbox>('inboxes').select()
</script>

<template>
  <div class="mx-auto max-w-prose">
    <h1 class="text-4xl font-bold">Home</h1>
    <p>maybe some promotional material or a tutorial would go here</p>
  </div>
</template>
