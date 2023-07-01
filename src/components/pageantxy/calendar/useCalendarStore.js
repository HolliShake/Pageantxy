import EventService from '@/services/EventService'
import action from '@/stores/action'
import _ from 'lodash'

const eventService = new EventService()

export const useCalendarStore = defineStore('calendar', {
  // arrow function recommended for full type inference
  state: () => ({
    events: [],
    loaded: false,
    availableCalendars: [
      {
        color: 'info',
        label: 'Upcoming event',
      },
      {
        color: 'success',
        label: '2 weeks',
      },
      {
        color: 'warning',
        label: '1 week',
      },
      {
        color: 'secondary',
        label: 'Past event',
      },
    ],
    selectedCalendars: [
      'Upcoming event',
      '2 weeks',
      '1 week',
      'Past event',
    ],
  }),
  actions: {
    async fetchEvents() {

      let result = await eventService.getAll()

      if (result.FAIL) return Promise.resolve([])

      this.events = result.data
      this.loaded = true
      
      return Promise.resolve(this.events)
    },
    async addEvent(event) {
      let newEvent = await eventService.create(event)

      if (newEvent.SUCCESS) this.events.push(newEvent.data)
      
      return action(newEvent)
    },
    async updateEvent(event) {
      let copy = _.cloneDeep(event)
      delete copy['id']

      let res = await eventService.update(event.id, copy)

      if (res.SUCCESS) _.merge(this.events.find(e => e.id === event.id), copy)
      
      return (res.SUCCESS) ? Promise.resolve(event) : Promise.reject('Something went wrong')
    },
    async removeEvent(eventId) {
      let res = await eventService.delete(eventId)

      if (res.SUCCESS) this.events = this.events.filter(e => e.id !== eventId) 
      
      return action(res)
    },
  },
})
