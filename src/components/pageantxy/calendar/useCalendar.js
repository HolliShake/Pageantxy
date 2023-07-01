import { useCalendarStore } from '@/components/pageantxy/calendar/useCalendarStore'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'

export const blankEvent = {
  eventName: '',
  eventDescription: '',
  sponsor: '',
  dateFrom: new Date(Date.now()),
  dateTo: new Date(Date.now()),
  venue: '',
}
export const useCalendar = (event, isEventHandlerSidebarActive, isLeftSidebarOpen) => {
  // 👉 themeConfig
  const { isAppRtl } = useThemeConfig()

  // 👉 Store
  const store = useCalendarStore()

  // 👉 Calendar template ref
  const refCalendar = ref()

  // 👉 Date difference
  const getDaysDif = (function(lateDate, aheadDate) {
    return Math.floor((aheadDate - lateDate) / (1000 * 3600 * 24))
  })

  const computedCalendarsColor = event => { 
    const dateToday = new Date(Date.now()).getTime()
    const dateEventStart = new Date(event.dateFrom).getTime()
    const dateEventEnd = new Date(event.dateTo).getTime()

    let diff = getDaysDif(dateToday, dateEventStart)

    // past
    if (dateToday > dateEventEnd)
      return 'secondary'
    
    // happening
    if (dateToday >= dateEventStart && dateToday <= dateEventEnd)
      return 'primary'

    // preparations
    if (diff < 7) // 1 week of preperation
      return 'warning'
    else if (diff < 14) // 2 weeks of preperation
      return 'success'
    
    // 3 weeks of preperation
    return 'info'
  }


  // ℹ️ Extract event data from event API
  const extractEventDataFromEventApi = eventApi => {

    const { id, title, start, end, extendedProps } = eventApi
    
    return {
      id,
      eventName: title,
      name: title,
      dateFrom: start,
      dateTo: end,
      eventDescription: extendedProps.eventDescription,
      venue: extendedProps.venue,
      sponsor: extendedProps.sponsor,
    }
  }


  // 👉 Fetch events
  const fetchEvents = (info, successCallback) => {
    // If there's no info => Don't make useless API call
    if (!info)
      return
    store.fetchEvents()
      .then(r => {

        let copy = Array.from(r)

        if (store.selectedCalendars.length != store.availableCalendars.length)

        // ℹ️ Filter events by selected calendars
          store.selectedCalendars.forEach(calendar => {

            switch (calendar) {
            case 'Upcoming event': {
              copy = copy.filter(evt => {
                let diff = getDaysDif(new Date(Date.now()).getTime(), new Date(evt.dateFrom).getTime())

                return diff >= 14
              })
              
              break
            }
            case '2 weeks': {
              copy = copy.filter(evt => {
                let diff = getDaysDif(new Date(Date.now()).getTime(), new Date(evt.dateFrom).getTime())

                return diff > 0 && diff < 14
              })
              
              break
            }
            case '1 week': { 
              copy = copy.filter(evt => {
                let diff = getDaysDif(new Date(Date.now()).getTime(), new Date(evt.dateFrom).getTime())

                return diff > 0 && diff < 7
              })
              
              break
            }
            case 'Past event': {
              copy = copy.filter(evt => {
                return new Date(Date.now()).getTime() > new Date(evt.dateTo).getTime()
              })
              
              break
            }
            }
          })

        successCallback(copy.map(e => { 
          let startBase = new Date(e.dateFrom)
          let endBase = new Date(e.dateTo)

          return ({
            id: e.id,
            title: e.eventName,
            name: e.eventName,
            eventDescription: e.eventDescription,
            sponsor: e.sponsor,
            venue: e.venue,
            
            // Convert string representation of date to Date object
            start: startBase,
            end: endBase,
          })
        }))
      })
      .catch(e => {
        console.error('Error occurred while fetching calendar events', e)
      })
  }


  // 👉 Calendar API
  const calendarApi = ref(null)


  // 👉 Update event in calendar [UI]
  const updateEventInCalendar = (updatedEventData, propsToUpdate, extendedPropsToUpdate) => {
    const existingEvent = calendarApi.value?.getEventById(updatedEventData.id)
    if (!existingEvent) {
      console.warn('Can\'t found event in calendar to update')
      
      return
    }

    // ---Set event properties except date related
    // Docs: https://fullcalendar.io/docs/Event-setProp
    // dateRelatedProps => ['start', 'end', 'allDay']

    for (let index = 0; index < propsToUpdate.length; index++) {
      const propName = propsToUpdate[index]
      
      existingEvent.setProp(propName, updatedEventData[propName])
    }

    // --- Set date related props
    // ? Docs: https://fullcalendar.io/docs/Event-setDates
    existingEvent.setDates(updatedEventData.start, updatedEventData.end, { allDay: updatedEventData.allDay })

    // --- Set event's extendedProps
    // ? Docs: https://fullcalendar.io/docs/Event-setExtendedProp
    for (let index = 0; index < extendedPropsToUpdate.length; index++) {
      const propName = extendedPropsToUpdate[index]

      existingEvent.setExtendedProp(propName, updatedEventData[propName])
    }
  }


  // 👉 Remove event in calendar [UI]
  const removeEventInCalendar = eventId => {
    const _event = calendarApi.value?.getEventById(eventId)
    if (_event)
      _event.remove()
  }


  // 👉 refetch events
  const refetchEvents = () => {
    calendarApi.value?.refetchEvents()
  }

  watch(() => store.selectedCalendars, refetchEvents)


  // 👉 Add event
  const addEvent = _event => {
    store.addEvent(_event)
      .then(() => {
        refetchEvents()
      })
  }


  // 👉 Update event
  const updateEvent = _event => {
    store.updateEvent(_event)
      .then(r => {
        const propsToUpdate = ['id', 'title', 'end', 'start']
        const extendedPropsToUpdate = ['sponsor', 'venue', 'eventDescription']

        let dup = {
          ...r,
          start: r.dateFrom,
          end: r.dateTo,
          title: r.eventName,
          name: r.eventName,
        }

        updateEventInCalendar(dup, propsToUpdate, extendedPropsToUpdate)
      })
  }


  // 👉 Remove event
  const removeEvent = eventId => {
    store.removeEvent(eventId).then(() => {
      removeEventInCalendar(eventId)
    })
  }


  // 👉 Calendar options
  const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'drawerToggler,prev,next title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
    },
    events: fetchEvents,
    displayEventTime: false,

    // ❗ We need this to be true because when its false and event is allDay event and end date is same as start data then Full calendar will set end to null
    forceEventDuration: true,

    /*
        Enable dragging and resizing event
        Docs: https://fullcalendar.io/docs/editable
      */
    editable: true,

    /*
        Enable resizing event from start
        Docs: https://fullcalendar.io/docs/eventResizableFromStart
      */
    eventResizableFromStart: true,

    /*
        Automatically scroll the scroll-containers during event drag-and-drop and date selecting
        Docs: https://fullcalendar.io/docs/dragScroll
      */
    dragScroll: true,

    /*
        Max number of events within a given day
        Docs: https://fullcalendar.io/docs/dayMaxEvents
      */
    dayMaxEvents: 2,

    /*
        Determines if day names and week names are clickable
        Docs: https://fullcalendar.io/docs/navLinks
      */
    navLinks: true,
    eventClassNames({ event: calendarEvent }) {

      const colorName = computedCalendarsColor({ dateFrom: calendarEvent.start, dateTo: calendarEvent.end })
      
      return [
        // Background Color
        `bg-light-${colorName} text-${colorName}`,
      ]
    },
    eventClick({ event: clickedEvent }) {
      // * Only grab required field otherwise it goes in infinity loop
      // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
      event.value = extractEventDataFromEventApi(clickedEvent)

      console.log('>>', event.value)

      isEventHandlerSidebarActive.value = true
    },

    // customButtons
    dateClick(info) {
      event.value = { ...event.value, start: info.date }
      isEventHandlerSidebarActive.value = true
    },

    /*
          Handle event drop (Also include dragged event)
          Docs: https://fullcalendar.io/docs/eventDrop
          We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
        */
    eventDrop({ event: droppedEvent }) {
      updateEvent(extractEventDataFromEventApi(droppedEvent))
    },

    /*
          Handle event resize
          Docs: https://fullcalendar.io/docs/eventResize
        */
    eventResize({ event: resizedEvent }) {
      if (resizedEvent.start && resizedEvent.end)
        updateEvent(extractEventDataFromEventApi(resizedEvent))
    },
    customButtons: {
      drawerToggler: {
        text: 'calendarDrawerToggler',
        click() {
          isLeftSidebarOpen.value = true
        },
      },
    },
  }


  // 👉 onMounted
  onMounted(() => {
    calendarApi.value = refCalendar.value.getApi()
  })


  // 👉 Jump to date on sidebar(inline) calendar change
  const jumpToDate = currentDate => {
    calendarApi.value?.gotoDate(new Date(currentDate))
  }

  watch(isAppRtl, val => {
    calendarApi.value?.setOption('direction', val ? 'rtl' : 'ltr')
  }, { immediate: true })
  
  return {
    refCalendar,
    calendarOptions,
    refetchEvents,
    fetchEvents,
    addEvent,
    updateEvent,
    removeEvent,
    jumpToDate,
  }
}
