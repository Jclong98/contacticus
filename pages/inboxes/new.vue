<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()

const name = ref('New Inbox')

const fields = ref<{ name: string }[]>([{ name: 'email' }, { name: 'message' }])

const removeField = (index: number) => {
  fields.value.splice(index, 1)
}

const createInbox = async () => {
  const { data: inboxData } = await client.from('inboxes').insert({
    name: name.value,
    user_id: user.value.id,
  })

  const { data } = await client.from('fields').insert(
    fields.value.map(({ name }) => ({
      name,
      inbox_id: inboxData[0].id,
    }))
  )

  navigateTo(`/inboxes`)
}
</script>
<template>
  <div class="mx-auto max-w-prose bg-white p-4 shadow rounded-lg grid gap-8">
    <h1 class="text-4xl font-bold">New Inbox</h1>

    <label>
      <span class="mb-2 inline-block">Inbox Name</span>
      <input
        type="email"
        v-model="name"
        class="bg-gray-100 border border-gray-400 w-full rounded-lg p-2"
      />
    </label>

    <div class="grid gap-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold">Fields</h2>

        <button @click="fields.push({ name: '' })" class="btn-green">
          Add Field
        </button>
      </div>

      <label v-for="(field, index) in fields" :key="index">
        <div class="flex justify-between">
          <span class="mb-2 inline-block">Field Name</span>

          <button @click="removeField(index)">
            <i class="i-iconoir-cancel h-6 w-6 ml-2"></i>
          </button>
        </div>
        <input
          type="text"
          v-model="fields[index].name"
          class="bg-gray-100 border border-gray-400 w-full rounded-lg p-2"
        />
      </label>

      <p v-if="fields.length < 1">
        Click "Add Field" to create new form fields
      </p>
    </div>

    <button
      class="btn-green"
      @click="createInbox()"
      :disabled="fields.length < 1"
    >
      Create Inbox
    </button>
  </div>
</template>
