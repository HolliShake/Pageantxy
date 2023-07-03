<script setup>
import Calendar from '@/components/pageantxy/calendar/Calendar.vue'
import UserTable from '@/components/pageantxy/user/UserTable.vue'

//
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <!-- Event calendar -->
        <Calendar />  
      </VCol>
      <VCol cols="12">
        <!-- User List -->
        <UserTable />
      </VCol>
    </VRow>
  </section>
</template>

<route lang="yaml">
  meta:
    subject: all
    action: manage
    requiresAuth: true
</route>
