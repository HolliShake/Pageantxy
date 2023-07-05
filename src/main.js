/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import { abilitiesPlugin } from '@casl/vue'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import { createApp, markRaw, watch } from 'vue'
import ability from './plugins/casl/ability'
import useSnackBar from './stores/snackbar.store'

loadFonts()


// Create vue app
const piniaState = createPinia()
const app = createApp(App)

piniaState.use(({ store }) => {
  store.$router = markRaw(router)
})

watch(
  piniaState.state,
  state => {
    // persist the whole state to the local storage whenever it changes
    localStorage.setItem('piniaState', JSON.stringify(state))
  },
  { deep: true },
)

// Use plugins
app.use(vuetify)
app.use(piniaState)
app.use(router)
app.use(layoutsPlugin)
app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
})

app.provide('useSnackbar', () => useSnackBar())

// Mount vue app
app.mount('#app')
