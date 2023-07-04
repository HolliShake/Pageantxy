<script setup>
import RegisteredCandidateTable from '@/components/pageantxy/scoring/RegisteredCandidateTable.vue'






//
</script>

<template>
  <section>
    <RegisteredCandidateTable />
  </section>
</template>

<route lang="yaml">
  meta:
    subject: Judge
    action: read
    requiresAuth: true
</route>

