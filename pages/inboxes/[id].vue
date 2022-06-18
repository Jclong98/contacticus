<script setup lang="ts">
const { params } = useRoute()

const { id: inboxId } = params

const { submissions, _inboxData } = useInbox(inboxId)
</script>

<template>
  <div class="max-w-prose mx-auto flex flex-col gap-4">
    <pre>Inbox ID: {{ inboxId }}</pre>

    <h1 class="text-4xl font-bold">{{ _inboxData.name }}</h1>

    <InboxTester :id="inboxId.toString()" />

    <TransitionGroup name="list">
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
    </TransitionGroup>
  </div>
</template>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
