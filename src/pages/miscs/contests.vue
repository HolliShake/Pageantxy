<script setup>
import ContestTable from '@/components/pageantxy/contests/ContestTable.vue'


//
</script>


<template>
  <section>
    <ContestTable />
  </section>
</template>

<route lang="yaml">
  meta:
    subject: Admin
    action: manage
    requiresAuth: true
</route>
