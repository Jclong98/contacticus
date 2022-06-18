<script setup lang="ts">
const props = defineProps<{ id: string }>()

const loading = ref(false)

const client = useSupabaseClient()

const fieldNames = ref([])
const fieldValues = ref({})
const fields = computed<{ field: string; value: any }[]>(() =>
  Object.entries(fieldValues.value).map(([name, value]) => ({
    field: name,
    value,
  }))
)

onMounted(async () => {
  const { data } = await client.from('fields').select('*').match({
    inbox_id: props.id,
  })

  fieldNames.value = data
})

const { addSubmission } = useInbox(props.id)

// Login method using providers
const handleSubmit = async () => {
  loading.value = true

  await addSubmission(fields.value as any)

  fieldValues.value = {}

  loading.value = false
}
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="bg-white grid gap-4 max-w-prose p-4 rounded-lg shadow"
  >
    <h1 class="text-2xl font-semibold">Test Submission</h1>

    <label v-for="(field, index) in fieldNames" :key="index">
      <span class="mb-2 inline-block">{{ field.name }}</span>
      <input
        type="text"
        v-model="fieldValues[field.name]"
        class="bg-gray-100 border border-gray-400 w-full rounded-lg p-2"
      />
    </label>

    <button type="submit" class="btn-indigo" :disabled="loading">Submit</button>
  </form>
</template>
