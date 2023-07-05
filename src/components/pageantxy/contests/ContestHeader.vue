
<script setup>
import currentEvent from '@/helpers/currentEvent'
import ContestRService from '@/signalr/ContestRService'
import useContestStore from '@/stores/contest.store'
import { onMounted } from 'vue'

const contestR = new ContestRService()
const contestStore = useContestStore()
const event = computed(() => currentEvent())

const contest = computed(() => {
  if (!event.value)
    return ''

  return contestStore.getContests.find(c => c.isActive && c.eventId == event.value.id)
})

onMounted(() => { 
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
        <h1 class="text-disabled text-uppercase">
          | {{ contest ?.contestName ?? 'No Available Contest' }}
        </h1>

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

