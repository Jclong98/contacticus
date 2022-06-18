<script setup lang="ts">
const { params } = useRoute()

const { id: inboxId } = params

interface SubmissionValue {
  id: string
  field: string
  value: string
}

interface Submission {
  id: number
  values: SubmissionValue[]
}

const submissions = ref<Submission[]>([
  {
    id: 1,
    values: [
      {
        id: 'id1',
        field: 'name',
        value: 'John Doe',
      },
      {
        id: 'id2',
        field: 'email',
        value: 'jdoe@test.com',
      },
    ],
  },
  {
    id: 2,
    values: [
      {
        id: 'id1',
        field: 'name',
        value: 'Jane Doe',
      },
      {
        id: 'id2',
        field: 'email',
        value: 'jane@email.com',
      },
    ],
  },
])
</script>

<template>
  <div class="max-w-prose mx-auto flex flex-col gap-4">
    <pre>Inbox ID: {{ inboxId }}</pre>

    <div
      class="bg-white p-4 rounded-lg shadow grid gap-4"
      v-for="submission in submissions"
      :key="submission.id"
    >
      <h2 class="text-xl font-bold">Submission #{{ submission.id }}</h2>

      <div v-for="{ field, value, id } in submission.values" :key="id">
        <p class="opacity-70 text-sm select-none">{{ field }}</p>
        <p>{{ value }}</p>
      </div>
    </div>
  </div>
</template>
