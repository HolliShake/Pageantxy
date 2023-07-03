
<script setup>
import UserControl from '@/components/pageantxy/user/UserControl.vue'
import useAuthStore from '@/stores/auth.store'

const authStore = useAuthStore()

// 
</script>

<template>
  <section>
    <UserControl v-model="authStore.getId" />
  </section>
</template>

<route lang="yaml">
  meta:
    subject: Auth
    action: manage
    requiresAuth: true
</route>
