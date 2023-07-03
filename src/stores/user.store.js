import UserService from '@/services/UserService'
import _ from 'lodash'
import { defineStore } from "pinia"
import action from './action'

const userService = new UserService()

const useUserStore = defineStore('UserStore', {

  state: () => ({
    users: [],
    loaded: false,
  }),
    
  getters: {
    getUsers() {
      return this.users
    },
    usersLoaded() {
      return this.loaded 
    },
  },

  actions: {

    async appendUser(user)
    {
      this.users.push(user)
    },

    async fetchUsers()
    { 
      if (this.users.length > 0) return Promise.resolve(this.users)
      
      let result = await userService.getAll()
    
      if (result.FAIL) return Promise.resolve([])
    
      this.users = result.data
      this.loaded = true
        
      return Promise.resolve(this.users)
    },
      
    async getUserById(userId)
    { 
      let user = null
        
      if (this.users.length > 0)
        user = this.users.find(u => u.id == userId)
        
      else {
        let result = await userService.getById(userId)
          
        user = (result.SUCCESS) ? result.data : null
          
        if (result.FAIL) return Promise.reject(result.data)
      }
        
      return Promise[user ? 'resolve' : 'reject'](user)
    },
      
    async createUser(user)
    {
      let result = await userService.create(user)
        
      if (result.SUCCESS)
        this.users.push(result.data)
            
      return action(result)
    },
    
    async updateUser(userId, user)
    {
      let result = await userService.update(userId, user)
    
      if (result.SUCCESS)
        _.merge(this.users.find(e => e.id == userId), user)
            
      return action(result)
    },
    
    async deleteUser(userId)
    {
      let result = await userService.delete(userId)
    
      if (result.SUCCESS)
        this.users = this.users.filter(e => e.id != userId)
            
      return action(result)
    },
  },
})

export default useUserStore
