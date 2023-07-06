<script setup>
import ScrollToTop from '@core/components/ScrollToTop.vue'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import { hexToRgb } from '@layouts/utils'
import { inject, onMounted } from "vue"
import { useTheme } from 'vuetify'
import RefreshRService from './signalr/RefreshRService'

const {
  syncInitialLoaderTheme,
  syncVuetifyThemeWithTheme: syncConfigThemeWithVuetifyTheme,
  isAppRtl,
  handleSkinChanges,
} = useThemeConfig()

const { global } = useTheme()
const snackbarStore = inject('useSnackbar')
const refreshR = new RefreshRService()

// ℹ️ Sync current theme with initial loader theme
syncInitialLoaderTheme()
syncConfigThemeWithVuetifyTheme()
handleSkinChanges()


refreshR.listen('RefreshPage', () => { 
  window.location.reload()
})

onMounted(() => {
  refreshR.start()
})
</script>

<template>
  <VLocaleProvider :rtl="isAppRtl">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />
      <ScrollToTop />
      <!-- snackbar -->
      <VSnackbar
        v-model="snackbarStore.isVisible"
        location="top end"
        variant="elevated"
        :color="snackbarStore.color"
      >
        <VIcon
          start
          :icon="snackbarStore.getIcon"
        />
        {{ snackbarStore.message }}
      </VSnackbar>
    </VApp>
  </VLocaleProvider>
</template>
