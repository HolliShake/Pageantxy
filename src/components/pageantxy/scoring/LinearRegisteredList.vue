
<script setup>
import useRegisterStore from '@/stores/register.store'
import { inject, onMounted, watch } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'
import Action from './Action.vue'
import UserAvatarModal from './UserAvatarModal.vue'

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
  { title: 'CANDIDATE', key: 'candidate', width: '1200' },
])

const scoresRef = inject('scores')

watch(registeredCandidates, () => { 
  scoresRef.value = registeredCandidates.value.map(() => ref(null))
}, { deep: true })

//
</script>

<template>
  <VDataTable
    class="linear-table table-header-bg"
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
    <template #item.candidate="{ item, index }">
      <div class="d-flex flex-row flex-nowrap flex-shrink-0 align-center pa-2">
        <UserAvatarModal :picture="item.raw.candidate.picture" />
        <div class="d-flex flex-row align-center w-100 h-100">
          <div class="d-flex flex-nowrap flex-row flex-shrink-0 shrink-0 ms-md-5">
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

          <VSpacer />
          <Action
            :ref="scoresRef[index]"
            :contest-id="props.contestId"
            :candidate-id="item.raw.candidate.id"
          />
        </div>
      </div>
    </template>
  </VDataTable>
</template>

<style lang="scss">
div.v-table__wrapper {
  overflow-y: hidden;
}
</style>
