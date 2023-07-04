
<script setup>
import useRegisterStore from '@/stores/register.store'
import { onMounted } from 'vue'

const props = defineProps({
  contestId: {
    type: [Number, null],
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  candidateNumber: {
    type: [Number, String, null],
    required: true,
  },
})

const registeredStore = useRegisterStore()

const registeredCandidates = computed(() => {
  return registeredStore.getRegistered
    .sort((a, b) => (a.candidate.candidateNumber - b.candidate.candidateNumber))
    .filter(rc => rc.contestId == props.contestId)
    .filter(rc => (props.candidateNumber == 'all') || rc.id == props.candidateNumber)
    .filter(rc => (props.gender == 'all') || rc.candidate?.group == props.gender)
})

onMounted(() => {
  registeredStore.fetchRegistered()
})

const computedImage = picture => {
  return `${import.meta.env.VITE_APP_APP_URL}/files/${picture}`
}

//
</script>

<template>
  <VList rounded="0">
    <VDivider v-if="registeredCandidates.length > 0" />
    <VListItem
      v-if="registeredCandidates.length <= 0"
      class="px-0"
    >
      <VCardText
        class="text-center"
        style=" border-radius: 0 !important;background-color: rgb(var(--v-theme-background)) !important;"
      >
        No data available
      </VCardText>
    </VListItem>
    <template
      v-for="(reg, index) in registeredCandidates"
      :key="index"
    >
      <VListItem>
        <div class="d-flex flex-column flex-md-row flex-nowrap justify-space-center justify-space-md-start align-center pa-2">
          <VAvatar
            size="128"
            rounded="lg"
          >
            <VImg
              cover
              :src="computedImage(reg.candidate.picture)"
              width="128"
              max-width="128"
            />
          </VAvatar>
          <div class="d-flex flex-column ms-md-5 text-center text-md-start w-100 h-100">
            <div>
              <span class="text-h2 font-weight-thin">{{ reg.candidate.lastName }}, {{ reg.candidate.firstName }}</span>
              <div>
                <span>
                  <strong class="text-h4">Candidate no # {{ (reg.candidate.candidateNumber < 10) ? `0${reg.candidate.candidateNumber}` : reg.candidate.candidateNumber }}</strong> |
                  <span class="text-h5 text-disabled text-xs">{{ reg.candidate.representation }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </VListItem>

      <VDivider v-if="index < registeredCandidates.length -1" />
    </template>
  </VList>
</template>

