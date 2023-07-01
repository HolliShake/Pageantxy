<script setup>
import useCandidateStore from '@/stores/candidate.store'
import CreateCandidateModal from './CreateCandidateModal.vue'

const candidateStore = useCandidateStore()
const candidates = computed(() => candidateStore.getCandidates)
const hasSomethingToShow = computed(() => candidates.value.length > 0)

//
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText>
          <CreateCandidateModal />
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12">
      <VCard>
        <VRow>
          <!-- Info -->
          <VCol cols="4">
            <div class="d-flex flex-row flex-nowrap w-100">
              <VCardText>a</VCardText>
              <VDivider vertical />
            </div>
          </VCol>

          <!-- Table -->
          <VCol cols="8">
            <VCardText>
              <VList
                v-for="(candidate, index) in candidates"
                :key="index"
              >
                <VListItem>
                  <div class="d-flex flex-nowrap flex-row">
                    <span class="font-weight-semibold">{{ candidate.lastName }}, {{ candidate.firstaName }}</span>

                    <VSpacer />
                    a
                  </div>
                </VListItem>
              </VList>
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
    </VCol>
  </VRow>
</template>

