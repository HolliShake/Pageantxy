import useEventStore from "@/stores/event.store"



function currentEvent()
{
  const eventStore = useEventStore()

  if (eventStore.getEvents.length <= 0) return null

  // Get happening event or incomming event
  let dateToday = new Date(Date.now()).getTime()
  let event = null, nearest = null, nearestTime = 0

  eventStore.getEvents.forEach(evt => { 
    let eStart = new Date(evt.dateFrom).getTime()
    let eEnd = new Date(evt.dateTo).getTime()

    // Hapenning
    if (dateToday >= eStart && dateToday <= eEnd)
    {
      event = evt
    }

    // Nearest
    if ((!(!event)) && (nearest == null) && eStart > dateToday)
    {
      nearest = evt
      nearestTime = eStart
    }
  })

  return (event || nearest)
}


export default currentEvent
