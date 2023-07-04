import { canNavigate } from '@/@layouts/plugins/casl'
import { isAdmin } from '@/plugins/casl/util'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import { isUserLoggedIn } from './utils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
  ],
})

router.beforeEach((to, from, next) => {

  const userLoggedIn = isUserLoggedIn()

  console.log('IsLoggedIn: ', userLoggedIn)
  console.log(canNavigate(to), '>>>>>>', to.fullPath)

  if (userLoggedIn)
  {
    if (to.name == 'login' && to.meta.redirectIfLoggedIn) {

      if (isAdmin())
        next({ name: 'dashboard' })
      else
        next({ name: 'scoring' })

    } else {
      if (canNavigate(to)) {
        next()
      } else {
        next({ name: 'notfound' })
      }
    }
  } else {
    if (to.name == 'login' && !isUserLoggedIn)
      next({ name: 'login', query: { to: to.name != "login" ? to.fullPath : undefined } })
    else
      next()
  }
})


// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router
