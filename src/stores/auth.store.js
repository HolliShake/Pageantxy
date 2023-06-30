import AuthService from "@/services/AuthService"
import { defineStore } from "pinia"
import action from "./action"

const authService = new AuthService()

const useAuthStore = defineStore('AuthStore', {

  state: () => ({
    useData: localStorage.getItem('userData') || ({}),
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
  }),
    
  actions: {
      
    async login(email, password) {
      let result = await authService.login({ email: email, password: password })
      
      if (!result.SUCCESS)
      {        
        return Promise.reject(result.data)
      }
          
      localStorage.setItem('accessToken', result.data.accessToken)
      localStorage.setItem('refreshToken', result.data.refreshToken)
          
      delete result.data.accessToken
      delete result.data.refreshToken
      localStorage.setItem('userData', JSON.stringify(result.data))
      
      return action(result)
    },
        
  },

})


export default useAuthStore

