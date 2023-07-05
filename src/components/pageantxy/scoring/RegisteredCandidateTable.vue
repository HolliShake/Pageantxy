<script setup>
import SelectContest from '@/components/pageantxy/contests/SelectContest.vue'
import SelectEvent from '@/components/pageantxy/event/SelectEvent.vue'
import Group from '@/defaults/Group'
import useEventStore from '@/stores/event.store'
import { onMounted, provide } from 'vue'
import PostButton from './PostButton.vue'

import SaveAllButton from './SaveAllButton.vue'
import SingleView from './SingleView.vue'

const availableGroup = ref([
  'all',
  ...Group,
])

const controlState = ref({
  isActiveContest: true,
  selectedContest: null,
})

const eventStore = useEventStore()

const selectedEvent = ref(null)

const scores = ref([])

provide('scores', scores)

onMounted(() => {
  eventStore.fetchEvents()
})

//
</script>

<template>
  <VCard>
    <VCardText>
      <VRow>
        <VCol
          cols="12"
          md="3"
        >
          <SelectEvent v-model="selectedEvent" />
        </VCol>
        <VCol
          cols="12"
          md="3"
        >
          <SelectContest
            v-model="controlState.selectedContest"
            :event-id="selectedEvent"
          />
        </VCol>
        <VCol
          cols="12"
          md="3"
        >
          <PostButton :contest-id="controlState.selectedContest" />
        </VCol>
        <VCol
          cols="12"
          md="3"
        >
          <SaveAllButton
            v-model="scores"
            :contest-id="controlState.selectedContest"
          />
        </VCol>
      </VRow>
    </VCardText>
 
    <SingleView :contest-id="controlState.selectedContest" />
    <VCardActions>
      <VCardText class="py-0" />
    </VCardActions>
  </VCard>
</template>

