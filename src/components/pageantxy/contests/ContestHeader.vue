
<script setup>
import currentEvent from '@/helpers/currentEvent'
import ContestRService from '@/signalr/ContestRService'
import useContestStore from '@/stores/contest.store'
import useEventStore from '@/stores/event.store'
import { onMounted } from 'vue'

const contestR = new ContestRService()
const eventStore = useEventStore()
const contestStore = useContestStore()
const event = computed(() => currentEvent())

const contest = computed(() => {
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

  let eventsId = events.map(e => e.id)

  let activeContest = contestStore.getContests
    .filter(c => c.isActive && eventsId.includes(c.eventId))

    // sort by acending
    .sort((a, b) => (b.contestOrder - a.contestOrder))

  return (activeContest[0] || null)
})

onMounted(() => { 
  eventStore.fetchEvents()
  contestStore.fetchContests()
  contestR.start()
})

contestR.listen('RecievedUpdate', contest => {
  contestStore.setContest(contest)
})

//
</script>

<template>
  <VCard>
    <VCardText>
      <div class="d-flex flex-row flex-nowrap justify-space-between align-center w-100">
        <div class="d-flex flex-row flex-nowrap align-center">
          <span class="text-sm text-disabled">contest</span>

          <div class="mx-1 text-error">
            |
          </div>

          <h3 class="text-warning text-uppercase font-weight-thin">
            {{ contest ?.contestName ?? 'No Available Contest' }}
          </h3>
        </div>

        <span
          class="d-flex flex-row flex-nowrap pa-2"
          style=" border-radius: 0.5em !important;background-color: rgb(var(--v-theme-background)) !important;"
        >
          <div class="d-flex flex-nowrap flex-row align-center">
            <VAvatar
              variant="tonal"
              color="success"
              size="small"
            >
              <VIcon
                color="secondary"
                icon="tabler-weight"
              />
              <VTooltip activator="parent">
                weight
              </VTooltip>
            </VAvatar>

            <span class="d-block ms-1 text-sm text-disabled font-weight-bold">{{ contest ?.weight ?? 0 }}%</span>
          </div>
          
          <VDivider
            vertical
            class="mx-2"
          />

          <div class="d-flex flex-nowrap flex-row align-center">
            <VAvatar
              variant="tonal"
              color="primary"
              size="small"
            >
              <VIcon
                color="secondary"
                icon="tabler-star"
                size="20"
              />
              <VTooltip activator="parent">
                min score
              </VTooltip>
            </VAvatar>

            <span class="d-block ms-1 text-sm text-disabled font-weight-bold">{{ contest ?.inputMin ?? 0 }}</span>
          </div>

          <VDivider
            vertical
            class="mx-2"
          />

          <!--  -->
          <div class="d-flex flex-nowrap flex-row align-center">
            <VAvatar
              variant="tonal"
              color="error"
              size="small"
            >
              <VIcon
                color="secondary"
                icon="tabler-stars"
              />
              <VTooltip activator="parent">
                max score
              </VTooltip>
            </VAvatar>

            <span class="d-block ms-1 text-sm text-disabled font-weight-bold">{{ contest ?.inputMax ?? 0 }}</span>
          </div>
        </span>
      </div>
    </VCardText>
  </VCard>
</template>

