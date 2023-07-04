<script setup>
import ContestHeader from '@/components/pageantxy/contests/ContestHeader.vue'
import RegisteredCandidateTable from '@/components/pageantxy/scoring/RegisteredCandidateTable.vue'





//
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <ContestHeader />
      </VCol>
      <!--  -->
      <VCol cols="12">
        <RegisteredCandidateTable />
      </VCol>
    </VRow>
  </section>
</template>

<route lang="yaml">
  meta:
    subject: Judge
    action: read
    requiresAuth: true
</route>

