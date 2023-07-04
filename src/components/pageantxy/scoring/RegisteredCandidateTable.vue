<script setup>
import SelectContest from '@/components/pageantxy/contests/SelectContest.vue'
import Group from '@/defaults/Group'
import useEventStore from '@/stores/event.store'
import { onMounted } from 'vue'


import SingleView from './SingleView.vue'

const availableGroup = ref([
  'all',
  ...Group,
])

const controlState = ref({
  isActiveContest: true,
  selectedContest: null,
  selectedRegistered: 'all',
  selectedGroup: availableGroup.value[0],
})

const eventStore = useEventStore()

const computedEvent = computed(() => {

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
})

onMounted(() => {
  eventStore.fetchEvents()
})

//
</script>

<template>
  <VCard rounded="0">
    <VCardText style=" border-radius: 0 !important; border-left: 5px solid rgb(var(--v-theme-success));background-color: rgb(var(--v-theme-background)) !important;">
      <h1 class="text-disabled">
        Contest
      </h1>
    </VCardText>
    <div class="pa-5">
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <SelectContest
   
            v-model="controlState.selectedContest"
            :event-id="computedEvent?.id"
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VSelect
            v-model="controlState.selectedGroup"
            label="Select gender"
            :items="availableGroup"
          />
        </VCol>
      </VRow>
    </div>
 
    <SingleView
      :contest-id="controlState.selectedContest"
      :candidate-number="controlState.selectedRegistered"
      :gender="controlState.selectedGroup"
    />
    <VCardActions>
      <VCardText class="py-0" />
    </VCardActions>
  </VCard>
</template>

