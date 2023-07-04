import ScoreService from "@/services/ScoreService"
import _ from 'lodash'
import { defineStore } from "pinia"
import action from "./action"

const scoreService = new ScoreService()

const useScoreStore = defineStore('Score', {

  state: () => ({
    scores: [],
    loaded: false,
  }),
    
  getters: {
    getScores() {
      return this.scores
    },
    scoresLoaded() {
      return this.loaded
    },
  },

  actions: {
      
    async fetchAllScores(scoreId) {
        
      if (this.scores.length > 0) return Promise.resolve(this.scores)
          
      let result = await scoreService.getAll()
          
      if (result.FAIL) return Promise.resolve([])

      this.scores = result.data
      this.loaded = true
      
      return Promise.resolve(this.scores)
          
    },
      
    async getScoreById(scoreId)
    { 
      let score = null
        
      if (this.scores.length > 0)
        score = this.scores.find(s => s.id == scoreId)
        
      else {
        let result = await scoreService.getById(scoreId)
          
        score = (result.SUCCESS) ? result.data : null
          
        if (result.FAIL) return Promise.reject(result.data)
      }
        
      return Promise[score ? 'resolve' : 'reject'](score)
    },
    
    async createScore(score)
    { 
      let result = await scoreService.create(score)

      if (result.SUCCESS)
        this.scores.push(result.data)
      
      return action(result)
    },
    
    async updateScore(scoreId, score)
    {
      let result = await scoreService.update(scoreId, score)

      if (result.SUCCESS)
        _.merge(this.scores.find(s => s.id == scoreId), score)
      
      return action(result)
    },
      
  },

})

export default useScoreStore
