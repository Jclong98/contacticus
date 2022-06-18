<script setup lang="ts">
const { inboxes, deleteInbox } = useInboxes()
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-4xl font-bold">Inboxes</h1>

      <NuxtLink to="/inboxes/new" class="btn-green">New Inbox</NuxtLink>
    </div>

    <div class="grid grid-cols-4 gap-4">
      <div
        class="rounded-lg bg-white shadow p-4 h-40 flex flex-col"
        v-for="inbox of inboxes"
        :key="inbox.id"
      >
        <NuxtLink :to="`/inboxes/${inbox.id}`" class="grow">
          <p class="opacity-75 text-xs">ID: {{ inbox.id }}</p>
          <h2 class="text-xl font-semibold mb-3">
            {{ inbox.name }}
          </h2>
        </NuxtLink>

        <footer class="flex gap-2">
          <NuxtLink class="btn-blue" :to="`/inboxes/${inbox.id}/edit`">
            Edit
          </NuxtLink>
          <button class="btn-red" @click="deleteInbox(inbox.id)">Delete</button>
        </footer>
      </div>

      <p v-if="inboxes.length < 1" class="col-span-full">
        Click "Create Inbox" to create a new inbox.
      </p>
    </div>
  </div>
</template>
