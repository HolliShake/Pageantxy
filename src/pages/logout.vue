

<script setup>
import { useRouter } from 'vue-router'


const router = useRouter()

localStorage.removeItem('userData')
localStorage.removeItem('piniaState')
localStorage.removeItem('accessToken')
localStorage.removeItem('refreshToken')
localStorage.removeItem('userAbilities')


router.push({ name: 'login' })
</script>


<template>
  <h1>Logging out...</h1>
</template>


