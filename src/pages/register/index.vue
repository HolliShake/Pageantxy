<script setup>
import RegisterTable from '@/components/pageantxy/register/RegisterTable.vue'

//
</script>


<template>
  <section>
    <RegisterTable />
  </section>
</template>

<route lang="yaml">
  meta:
    subject: Admin
    action: manage
    requiresAuth: true
</route>
