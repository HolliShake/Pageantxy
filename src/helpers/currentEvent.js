import useEventStore from "@/stores/event.store"


function currentEvent()
{
  const eventStore = useEventStore()

  if (eventStore.getEvents.length <= 0) return []

  // Get happening event or incomming event
  let dateToday = new Date(Date.now()).getTime()
  let events = []

  eventStore.getEvents.forEach(evt => { 
    let eStart = new Date(evt.dateFrom).getTime()
    let eEnd = new Date(evt.dateTo).getTime()

    // Hapenning
    if (dateToday >= eStart && dateToday <= eEnd)
    {
      events.push(evt)
    }
  })

  return events
}


export default currentEvent
