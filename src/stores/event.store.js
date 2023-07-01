import EventService from "@/services/EventService"
import { defineStore } from "pinia"




const useEventStore = () => { 

  const eventService = new EventService()

  return defineStore('EventStore', {
    state: () => ({
      events: [],
      loaded: false,
    }),
      
  })
}

