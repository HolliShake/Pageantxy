<script setup>
import SelectContest from '@/components/pageantxy/contests/SelectContest.vue'
import Group from '@/defaults/Group'
import currentEvent from '@/helpers/currentEvent'
import useEventStore from '@/stores/event.store'
import { onMounted } from 'vue'
import PostButton from './PostButton.vue'

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

const computedEvent = computed(() => currentEvent())

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
          md="8"
        >
          <SelectContest
            v-model="controlState.selectedContest"
            :event-id="computedEvent?.id"
          />
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <PostButton :contest-id="controlState.selectedContest" />
        </VCol>
      </VRow>
    </VCardText>
 
    <SingleView :contest-id="controlState.selectedContest" />
    <VCardActions>
      <VCardText class="py-0" />
    </VCardActions>
  </VCard>
</template>

