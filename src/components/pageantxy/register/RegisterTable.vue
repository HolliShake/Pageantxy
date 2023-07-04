<script setup>
import SelectEvent from '@/components/pageantxy/event/SelectEvent.vue'
import useRegisterStore from '@/stores/register.store'
import { onMounted } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'
import SelectContest from '../contests/SelectContest.vue'
import CreateRegisterModal from './CreateRegisterModal.vue'
import DeleteRegisterModal from './DeleteRegisterModal.vue'
import UpdateRegisterModal from './UpdateRegisterModal.vue'

const registerStore = useRegisterStore()
const selectedEvent = ref(null)
const selectedContest = ref(null) 

const registered = computed(() => registerStore.getRegistered)

const filteredRegistered = computed(() => { 
  return registered.value
    .sort((a, b) => a.candidate.candidateNumber - b.candidate.candidateNumber)
    .filter(r => r.contest.eventId == selectedEvent.value)
    .filter(r => r.contestId == selectedContest.value)
})

watch(registered, () => {
  console.log(registered.value)
}, { deep: true })

onMounted(() => {
  registerStore.fetchRegistered()
})

const headers = ref([
  {
    title: 'CONTEST NAME',
    key: 'contestName',
  },
  {
    title: 'CANDIDATE NAME',
    key: 'candidateName',
  },
  {
    title: 'ACTION',
    key: 'action',
  },
])

const computedImage = picture => {
  return `${import.meta.env.VITE_APP_APP_URL}/files/${picture}`
}

//
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Register a candidate">
        <VCardText>
          <VRow>
            <VCol
              cols="12"
              md="4"
            >
              <SelectEvent v-model="selectedEvent" />
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <SelectContest
                v-model="selectedContest"
                :event-id="selectedEvent"
              />
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <CreateRegisterModal :event-id="selectedEvent" />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
    <!--  -->
    <VCol cols="12">
      <VCard>
        <VCardText>
          <VDataTable
            class="table-header-bg"
            :headers="headers"
            :items="filteredRegistered"
            :items-per-page="5"
          >
            <!-- contest name -->
            <template #item.contestName="{ item }">
              <span class="font-weight-bold">{{ item.raw.contest.contestName }}</span>
            </template>

            <!-- contest name -->
            <template #item.candidateName="{ item }">
              <div class="d-flex flex-row flex-nowrap align-center">
                <VAvatar
                  :size="40"
                  variant="tonal"
                  color="primary"
                >
                  <VImg
                    cover
                    :src="computedImage(item.raw.candidate.picture)"
                  />
                </VAvatar>
                      
                <div class="ms-2">
                  <span class="font-weight-bold">
                    {{ item.raw.candidate.lastName }}, {{ item.raw.candidate.firstName }}
                  </span>
                  <span class="d-block text-xs">{{ item.raw.candidate.representation }} | <strong>candidate # {{ item.raw.candidate.candidateNumber }}</strong> </span>
                </div>
              </div>
            </template>
            
            <!-- contest status -->
            <template #item.contestStatus="{ item }">
              <VChip
                :color="resolveContestStausVariant(item.raw.isActive).color"
                size="small"
              >
                {{ resolveContestStausVariant(item.raw.isActive).text }}
              </VChip>
            </template>
            <!-- action -->
            <template #item.action="{ item }">
              <UpdateRegisterModal
                :event-id="selectedEvent"
                :register-id="item.raw.id"
              />
              <DeleteRegisterModal :register-id="item.raw.id" />
            </template>
          </VDataTable>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

