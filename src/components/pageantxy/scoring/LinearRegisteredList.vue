
<script setup>
import useRegisterStore from '@/stores/register.store'
import { onMounted } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'
import Action from './Action.vue'

const props = defineProps({
  contestId: {
    type: [Number, null],
    required: true,
  },
})

const registeredStore = useRegisterStore()

const registeredCandidates = computed(() => {
  return registeredStore.getRegistered
    .sort((a, b) => (a.candidate.candidateNumber - b.candidate.candidateNumber))
    .filter(rc => rc.contestId == props.contestId)
})

onMounted(() => {
  registeredStore.fetchRegistered()
})

const computedImage = picture => {
  return `${import.meta.env.VITE_APP_APP_URL}/files/${picture}`
}

function truncate(name)
{
  if (name.trim().length >= 25)
  {
    // subtract 3
    return name.trim().substring(0, 25 - 3) + '...'
  }

  return name.trim()
}

const headers = ref([
  { title: '#', key: 'candidateNumber', width: '120', align: 'center' },
  { title: 'CANDIDATE', key: 'candidate' },
  { title: 'ACTION', key: 'action', align: 'center', minWidth: '230', width: '230' },
])

//
</script>

<template>
  <VDataTable
    class="table-header-bg"
    :headers="headers"
    :items="registeredCandidates"
    disable-pagination
    :items-per-page="-1"
  >
    <!-- number -->
    <template #item.candidateNumber="{ item }">
      <strong class="text-h4"># {{ (item.raw.candidate.candidateNumber < 10) ? `0${item.raw.candidate.candidateNumber}` : item.raw.candidate.candidateNumber }}</strong>
    </template>
    <!-- candidate -->
    <template #item.candidate="{ item }">
      <div class="d-flex flex-row flex-nowrap align-center pa-2">
        <VAvatar
          size="64"
          rounded="lg"
        >
          <VImg
            cover
            :src="computedImage(item.raw.candidate.picture)"
            width="64"
            max-width="64"
          />
        </VAvatar>
        <div class="d-flex flex-column ms-md-5 w-100 h-100">
          <div>
            <span class="text-h3 font-weight-thin">
              {{ truncate(`${item.raw.candidate.lastName}, ${item.raw.candidate.firstName}`) }}</span>
            <div>
              <span>
                <span class="text-h5 text-disabled text-xs font-weight-thin">
                  <VIcon
                    icon="tabler-map-pin"
                    size="20"
                  />
                  {{ truncate(item.raw.candidate.representation) }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- action -->
    <template #item.action="{ item }">
      <Action
        :contest-id="props.contestId"
        :candidate-id="item.raw.candidate.id"
      />
    </template>
  </VDataTable>
</template>

