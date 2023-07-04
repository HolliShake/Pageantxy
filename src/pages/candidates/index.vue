<script setup>
import CandidateTable from '@/components/pageantxy/candidates/CandidateTable.vue'


//
</script>

<template>
  <section>
    <CandidateTable />
  </section>
</template>

<route lang="yaml">
  meta:
    subject: Admin
    action: read
    requiresAuth: true
</route>

