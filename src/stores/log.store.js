import LogService from "@/services/LogService"
import _ from 'lodash'
import { defineStore } from "pinia"
import action from "./action"

const logService = new LogService()

const useLogStore = defineStore('Log', {

  state: () => ({
    logs: [],
    loaded: false,
  }),
    
  getters: {
    getLogs() {
      return this.logs
    },
    logsLoaded() { 
      return this.loaded
    },
  },
  

  actions: {
      
    async fetchAllLogsByJudgeId(judgeId) {
        
      if (this.logs.length > 0) return Promise.resolve(this.logs)
          
      let result = await logService.getAllByJudgeId(judgeId)
          
      if (result.FAIL) return Promise.resolve([])

      this.logs = result.data
      this.loaded = true
      
      return Promise.resolve(this.logs)
          
    },
      
    async fetchAllLogs() {
        
      if (this.logs.length > 0) return Promise.resolve(this.logs)
          
      let result = await logService.getAll()
          
      if (result.FAIL) return Promise.resolve([])

      this.logs = result.data
      this.loaded = true
      
      return Promise.resolve(this.logs)
          
    },
      
    async getLogById(logId)
    { 
      let log = null
        
      if (this.logs.length > 0)
        log = this.logs.find(l => l.id == logId)
        
      else {
        let result = await logService.getById(logId)
          
        log = (result.SUCCESS) ? result.data : null
          
        if (result.FAIL) return Promise.reject(result.data)
      }
        
      return Promise[log ? 'resolve' : 'reject'](log)
    },
    
    async createLog(log)
    { 
      let result = await logService.create(log)

      if (result.SUCCESS)
        this.logs.push(result.data)
      
      return action(result)
    },
    
    async setContest(contest)
    {
      let result = this.logs.find(l => l.contestId = contest.id)
      if (!result) return
        
      _.merge(
        this.logs.find(l => l.contestId = contest.id),
        { contest: contest },
      )
    },
    
    async updateLog(logId, log)
    {
      let result = await logService.update(logId, log)

      if (result.SUCCESS)
        _.merge(this.logs.find(l => l.id == logId), log)
      
      return action(result)
    },
    
    async deleteLog(logId)
    {
      let result = await logService.delete(logId)

      if (result.SUCCESS)
        this.logs = this.logs.filter(l => l.id != logId)
      
      return action(result)
    },
      
  },

})

export default useLogStore
