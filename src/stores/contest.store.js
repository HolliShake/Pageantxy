import ContestService from "@/services/ContestService"
import _ from 'lodash'
import { defineStore } from "pinia"
import action from "./action"

const contestService = new ContestService()

const useContestStore = defineStore('Contest', {

  state: () => ({
    contests: [],
    loaded: false,
  }),

  getters: {
    getContests() {
      return this.contests
    },
    contestsLoaded() {
      return this.loaded
    },
  },
  
  actions: {
      
    async fetchContests()
    {
      if (this.contests.length > 0) return Promise.resolve(this.contests)

      let result = await contestService.getAll()

      if (result.FAIL) return Promise.resolve([])

      this.contests = result.data
      this.loaded = true
      
      return Promise.resolve(this.contests)
    },
      
    async getContestById(contestId)
    { 
      let contest = null
        
      if (this.contests.length > 0)
        contest = this.contests.find(c => c.id == contestId)
        
      else {
        let result = await contestService.getById(contestId)
          
        contest = (result.SUCCESS) ? result.data : null
          
        if (result.FAIL) return Promise.reject(result.data)
      }
        
      return Promise[contest ? 'resolve' : 'reject'](contest)
    },

    async createContest(contest)
    { 
      let result = await contestService.create(contest)

      if (result.SUCCESS)
        this.contests.push(result.data)
      
      return action(result)
    },

    async setContest(contest)
    {
      let result = await this.contests.find(c => c.id == contest.id)
      if (!result) return

      _.merge(result, contest)
    },

    async updateContest(contestId, contest)
    {
      let result = await contestService.update(contestId, contest)

      if (result.SUCCESS)
        _.merge(this.contests.find(c => c.id == contestId), contest)
      
      return action(result)
    },

    async deleteContest(contestId)
    {
      let result = await contestService.delete(contestId)

      if (result.SUCCESS)
        this.contests = this.contests.filter(c => c.id != contestId)
      
      return action(result)
    },

  },

})

export default useContestStore
