<script setup>
import UserTableControl from '@/components/pageantxy/user/UserTableControl.vue'

//
</script>

<template>
  <section>
    <UserTableControl />
  </section>
</template>

<route lang="yaml">
  meta:
    subject: all
    action: manage
    requiresAuth: true
</route>
