
<script setup>
import UserControl from '@/components/pageantxy/user/UserControl.vue'
import useAuthStore from '@/stores/auth.store'

const authStore = useAuthStore()

// 
</script>

<template>
  <section>
    <UserControl
      v-model="authStore.getId"
      :include-control="false"
    />
  </section>
</template>

<route lang="yaml">
  meta:
    subject: Auth
    action: read
    requiresAuth: true
</route>
