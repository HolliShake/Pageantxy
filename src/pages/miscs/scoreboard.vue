<script setup>
import ScoreTable from '@/components/pageantxy/score/ScoreTable.vue'

//
</script>


<template>
  <section>
    <ScoreTable />
  </section>
</template>


<route lang="yaml">
  meta:
    subject: Admin
    action: manage
    requiresAuth: true
</route>
