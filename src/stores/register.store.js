import RegisterService from '@/services/RegisterService'
import _ from 'lodash'
import { defineStore } from "pinia"
import action from "./action"

const registerService = new RegisterService()

const useRegisterStore = defineStore('Register', {

  state: () => ({ 
    registered: [],
    loaded: false,
  }),

  getters: {
    getRegistered() {
      return this.registered
    },
    registeredLoaded() {
      return this.loaded
    },
  },
    
  actions: {

    async fetchRegistered()
    {
      if (this.registered.length > 0) return Promise.resolve(this.registered)
      
      let result = await registerService.getAll()

      if (result.FAIL) return Promise.resolve([])

      this.registered = result.data
      this.loaded = true
      
      return Promise.resolve(this.registered)
    },

    async getRegisteredById(registeredId)
    { 
      let register = null
        
      if (this.registered.length > 0)
        register = this.registered.find(e => e.id == registeredId)
        
      else {
        let result = await registerService.getById(registeredId)
          
        register = (result.SUCCESS) ? result.data : null
          
        if (result.FAIL) return Promise.reject(result.data)
      }
        
      return Promise[register ? 'resolve' : 'reject'](register)
    },

    async createRegistered(register)
    { 
      let result = await registerService.create(register)

      if (result.SUCCESS)
        this.registered.push(result.data)
      
      return action(result)
    },

    async updateRegistered(registeredId, register)
    {
      let result = await registerService.update(registeredId, register)

      if (result.SUCCESS)
        _.merge(this.registered.find(e => e.id == registeredId), register)
      
      return action(result)
    },

    async deleteRegistered(registeredId)
    {
      let result = await registerService.delete(registeredId)

      if (result.SUCCESS)
        this.registered = this.registered.filter(e => e.id != registeredId)
      
      return action(result)
    },
        
  },
    
})

export default useRegisterStore

