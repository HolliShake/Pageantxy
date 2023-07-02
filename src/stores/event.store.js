import EventService from "@/services/EventService"
import _ from 'lodash'
import { defineStore } from "pinia"
import action from "./action"

const eventService = new EventService()

const useEventStore = defineStore('EventStore', {

  state: () => ({
    events: [],
    loaded: false,
  }),
      
  getters: {
    getEvents() { 
      return this.events
    },
    eventsLoaded() {
      return this.loaded
    },
  },

  actions: {
    
    async fetchEvents()
    {
      if (this.events.length > 0) return Promise.resolve(this.events)
      
      let result = await eventService.getAll()

      if (result.FAIL) return Promise.resolve([])

      this.events = result.data
      this.loaded = true
      
      return Promise.resolve(this.events)
    },

    async getEventById(eventId)
    { 
      let event = null
        
      if (this.candidates.length > 0)
        event = this.events.find(e => e.id == eventId)
        
      else {
        let result = await eventService.getById(eventId)
          
        event = (result.SUCCESS) ? result.data : null
          
        if (result.FAIL) return Promise.reject(result.data)
      }
        
      return Promise[event ? 'resolve' : 'reject'](event)
    },

    async createEvent(event)
    { 
      let result = await eventService.create(event)

      if (result.SUCCESS)
        this.events.push(result.data)
      
      return action(result)
    },

    async updateEvent(eventId, event)
    {
      let result = await eventService.update(eventId, event)

      if (result.SUCCESS)
        _.merge(this.events.find(e => e.id == eventId), event)
      
      return action(result)
    },

    async deleteEvent(eventId)
    {
      let result = await eventService.delete(eventId)

      if (result.SUCCESS)
        this.events = this.events.filter(e => e.id != eventId)
      
      return action(result)
    },

  },

})

export default useEventStore
