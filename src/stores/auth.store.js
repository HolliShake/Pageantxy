import ClaimTypes from '@/defaults/ClaimTypes'
import AuthService from "@/services/AuthService"
import jwt_decode from "jwt-decode"
import { defineStore } from "pinia"
import action from "./action"

const authService = new AuthService()

const useAuthStore = defineStore('AuthStore', {

  state: () => ({
    userData: JSON.parse(localStorage.getItem('userData')) || ({}),
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
  }),

  getters: {
    getFirstName() {      
      return this.userData?.firstName ?? 'John Doe'
    },
    getLastName() {
      return this.userData?.lastName ?? 'De la Cruz'
    },
    isAdminVerified() {
      return this.userData?.isAdminVerified ?? false
    },
    getAccessToken() {
      return this.accessToken
    },
    getRefreshToken() {
      return this.refreshToken
    },
  },
    
  actions: {
      
    async login(email, password) {
      let result = await authService.login({ email: email, password: password })
      
      if (!result.SUCCESS)
      {        
        return Promise.reject(result.data)
      }
          
      localStorage.setItem('accessToken', result.data.accessToken)
      localStorage.setItem('refreshToken', result.data.refreshToken)

      this.accessToken = result.data.accessToken
      this.refreshToken = result.data.refreshToken
          
      delete result.data.accessToken
      delete result.data.refreshToken
      
      localStorage.setItem('userData', JSON.stringify(result.data))
      this.userData = result.data

      let token = jwt_decode(this.accessToken)

      console.log(token[ClaimTypes.Role])
      
      return action(result)
    },
        
  },

})

export default useAuthStore


