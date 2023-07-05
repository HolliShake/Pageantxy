
<script setup>
import LogTable from '@/components/pageantxy/logs/LogTable.vue'

//
</script>

<template>
  <section>
    <LogTable />
  </section>
</template>

<route lang="yaml">
  meta:
    subject: Admin
    action: manage
    requiresAuth: true
</route>
