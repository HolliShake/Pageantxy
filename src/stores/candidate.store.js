import CandidateService from "@/services/CandidateService"
import _ from 'lodash'
import { defineStore } from "pinia"
import action from "./action"

const candidateService = new CandidateService()

const useCandidateStore = defineStore('CandidateStore', {

  state: () => ({
    candidates: [],
    loaded: false,
  }),
    
  getters: {
    getCandidates() {
      return this.candidates
    },
    candidatesLoaded() {
      return this.loaded
    },
  },

  actions: {

    async fetchCandidates()
    {
      if (this.candidates.length > 0) return Promise.resolve(this.candidates)

      let result = await candidateService.getAll()

      if (result.FAIL) return Promise.resolve([])

      this.candidates = result.data
      this.loaded = true
      
      return Promise.resolve(this.candidates)
    },
      
    async getCandidateById(candidateId)
    { 
      let candidate = null
        
      if (this.candidates.length > 0)
        candidate = this.candidates.find(c => c.id == candidateId)
        
      else {
        let result = await candidateService.getById(candidateId)
          
        candidate = (result.SUCCESS) ? result.data : null
          
        if (result.FAIL) return Promise.reject(result.data)
      }
        
      return Promise[candidate ? 'resolve' : 'reject'](candidate)
    },

    async createCandidate(candidate)
    { 
      let result = await candidateService.create(candidate)

      if (result.SUCCESS)
        this.candidates.push(result.data)
      
      return action(result)
    },

    async updateCandidate(candidateId, candidate)
    {
      let result = await candidateService.update(candidateId, candidate)

      if (result.SUCCESS)
        _.merge(this.candidates.find(c => c.id == candidateId), candidate)
      
      return action(result)
    },

    async deleteCandidate(candidateId)
    {
      let result = await candidateService.delete(candidateId)

      if (result.SUCCESS)
        this.candidates = this.candidates.filter(c => c.id != candidateId)
      
      return action(result)
    },

  },

})

export default useCandidateStore

