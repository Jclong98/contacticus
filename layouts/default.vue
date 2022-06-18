<script setup lang="ts">
const user = useSupabaseUser()
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Head>
      <Title>Contacticus</Title>
      <Link rel="icon" type="image/svg+xml" href="/supabase-logo.svg" />
    </Head>

    <nav class="font-semibold bg-indigo-700 text-white">
      <div class="flex justify-between p-4">
        <NuxtLink to="/" title="Home" class="font-bold"> Contacticus </NuxtLink>

        <ul class="flex gap-4 items-center">
          <NuxtLink
            to="/inboxes"
            title="Inboxes"
            class="i-iconoir-box"
          ></NuxtLink>

          <li v-if="user">
            <NuxtLink to="/profile" title="profile">{{ user.email }}</NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <main class="p-4">
      <slot></slot>
    </main>

    <Footer />
  </div>
</template>
