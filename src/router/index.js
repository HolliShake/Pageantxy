import { canNavigate } from '@/@layouts/plugins/casl'
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

router.beforeEach(route => {

  const userLoggedIn = isUserLoggedIn()

  if (canNavigate(route)) {

    if (route.meta.redirectIfLoggedIn && userLoggedIn)
    { 
      return '/dashboard'
    }

    if (route.meta.requiresAuth && !userLoggedIn)
    { 
      return { path: 'notfound' }
    }
    
  } else {
    if (userLoggedIn)
    {      
      return { path: 'notfound' }
    }
    else
    { 
      return { name: 'login', query: { to: route.name != "index" ? route.fullPath : undefined } }
    }
  }

})


// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router
