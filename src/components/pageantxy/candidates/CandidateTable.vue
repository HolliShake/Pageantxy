<script setup>
import Group from '@/defaults/Group'
import availablePages from '@/defaults/availablePages'
import useCandidateStore from '@/stores/candidate.store'
import { onMounted, ref, watch } from 'vue'
import CreateCandidateModal from './CreateCandidateModal.vue'
import DeleteCandidateModal from './DeleteCandidateModal.vue'
import UpdateCandidateModal from './UpdateCandidateModal.vue'

import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

const rowPerPage = ref(availablePages[availablePages.length - 1])
const currentPage = ref(1)
const totalPage = ref(1)
const selectedRows = ref([])

const availableGroups = ref(['any', ...Group])
const candidateStore = useCandidateStore()
const candidates = computed(() => candidateStore.getCandidates)
const hasSomethingToShow = computed(() => candidates.value.length > 0)
const candidatesLoaded = computed(() => candidateStore.candidatesLoaded)

const searchQuery = ref('')
const groupFilter = ref(availableGroups.value[0])
const counter = ref(0)
const selectedCandidate = ref(null)

const computedImage = picture => {
  return `${import.meta.env.VITE_APP_APP_URL}/files/${picture}`
}

const filteredCandidates = computed(() => {
  let result = candidates.value
    .filter(c => groupFilter.value == 'any' || c.group == groupFilter.value)
    .filter(c => c.firstName.toLowerCase().includes(searchQuery.value.toLowerCase()) || c.lastName.toLowerCase().includes(searchQuery.value.toLowerCase()))

  if (rowPerPage.value != 'all')
    return result.slice((currentPage.value - 1) * rowPerPage.value, currentPage.value * rowPerPage.value)

  return result

})

watch([filteredCandidates, searchQuery, groupFilter], () => {
  if (filteredCandidates.value.length > 0) selectedCandidate.value = filteredCandidates.value[counter.value].id
  else selectedCandidate.value = null
}, { deep: true, immediate: true })


watch(rowPerPage, () => { 
  totalPage.value = (rowPerPage.value != 'all') ? Math.ceil(candidates.value.length / rowPerPage.value) : 1
}, { deep: true, immediate: true })

onMounted(() => { 
  candidateStore.fetchCandidates()
})

const computedSelectedUser = computed(() => {
  return filteredCandidates.value.find(c => c.id == selectedCandidate.value)
})

//
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Filters">
        <VCardText>
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="searchQuery"
                label="Search candidate"
              />
            </VCol>
            <VCol
              cols="12"
              md="3"
            >
              <VSelect
                v-model="groupFilter"
                label="Group"
                :items="availableGroups"
              />
            </VCol>
            <VCol
              cols="12"
              md="3"
            >
              <CreateCandidateModal />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      v-if="!hasSomethingToShow && candidatesLoaded"
      cols="12"
    >
      <VCard>
        <VCardText class="text-center">
          <VRow>
            <VCol
              cols="12"
              md="4"
              offset="0"
              offset-md="4"
            >
              <CreateCandidateModal />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      v-else
      cols="12"
    >
      <VCard>
        <div class="d-flex flex-column flex-md-row flex-nowrap">
          <VCardText
            class="flex-shrink-0 text-center"
            style="min-width: 420px !important;max-width: 420px !important;"
          >
            <VCard v-if="computedSelectedUser">
              <VImg
                cover
                :max-height="300"
                :src="computedImage(computedSelectedUser?.picture)"
              />
              <VCardText class="text-start">
                <VCardTitle class="px-0">
                  {{ computedSelectedUser?.lastName }}, {{ computedSelectedUser?.firstName }}
                </VCardTitle>
                <div class="d-flex">
                  <span class="font-weight-bold text-sm">
                    <VIcon
                      start
                      icon="tabler-dice-3"
                    />
                    CANDIDATE NO: &nbsp;</span> <span class="text-uppercase text-sm">{{ computedSelectedUser?.candidateNumber }}</span>
                </div>
                <div class="d-flex py-2">
                  <span class="font-weight-bold text-sm">
                    <VIcon
                      start
                      :icon="(computedSelectedUser?.group == 'make')? 'tabler-gender-male' : 'tabler-gender-female'"
                    />
                    GROUP: &nbsp;</span> <span class="text-uppercase text-sm">{{ computedSelectedUser?.group }}</span>
                </div>
                <div class="d-flex flex-wrap">
                  <span class="font-weight-bold text-sm">
                    <VIcon
                      start
                      icon="tabler-map-pin"
                    />
                    REPRESENTS: &nbsp;</span> 
       
                  <span class="text-uppercase text-sm">{{ computedSelectedUser?.representation }}</span>
                </div>
                <div class="d-flex pt-3">
                  <UpdateCandidateModal
                    :candidate-id="computedSelectedUser?.id"
                    :icon="false"
                  />
                </div>
              </VCardText>
            </VCard>
            <VSkeletonLoader
              v-else
              type="image"
              loading
            />
          </VCardText>
          <VDivider vertical />
          <VCardText style="border-radius: 0 !important;background-color: rgb(var(--v-theme-background));">
            <VList>
              <VListItem v-if="filteredCandidates.length <= 0">
                <VCardText class="text-center">
                  No data found
                </VCardText>
              </VListItem>
              <template
                v-for="(candidate, index) in filteredCandidates"
                :key="index"
              >
                <VListItem @click="selectedCandidate = candidate.id">
                  <div class="d-flex flex-nowrap flex-row pa-1">
                    <div class="d-flex flex-row flex-nowrap align-center">
                      <VIcon
                        class="flex-shrink-0"
                        start
                        size="12"
                        :color="(selectedCandidate == candidate.id) ? 'warning' : 'secondary'"
                        :icon="(selectedCandidate == candidate.id) ? 'tabler-circle-filled' : 'tabler-circle'"
                      />

                      <VAvatar
                        :size="40"
                        variant="tonal"
                        color="primary"
                      >
                        <VImg
                          cover
                          :src="computedImage(candidate.picture)"
                        />
                      </VAvatar>
                      <div class="d-block ms-2">
                        <span class="font-weight-bold">{{ candidate.lastName }}, {{ candidate.firstName }}</span>
                        <span class="d-block text-disabled text-xs">{{ candidate.representation }}</span>
                      </div>
                    </div>
                 
                    <VSpacer />

                    <div class="demo-space-x flex-nowrap flex-shrink-0">
                      <UpdateCandidateModal :candidate-id="candidate.id" />
                      <DeleteCandidateModal :candidate-id="candidate.id" />
                    </div>
                  </div>
                </VListItem>
                <VDivider v-if="index < filteredCandidates.length - 1" />
              </template>

              <VDivider />

              <VListItem>
                <VCardText class="d-flex align-center flex-wrap justify-end gap-4 pa-2">
                  <div
                    class="d-flex align-center me-3"
                    style="width: 171px;"
                  >
                    <span class="text-no-wrap me-3">Rows per page:</span>

                    <VSelect
                      v-model="rowPerPage"
                      density="compact"
                      variant="plain"
                      class="text-vselect-overflow mt-n4"
                      :items="availablePages"
                    />
                  </div>

                  <span>Page {{ currentPage }} of {{ totalPage }}</span>

                  <div class="d-flex align-center">
                    <VPagination
                      v-model="currentPage"
                      size="small"
                      :total-visible="1"
                      :length="totalPage"
                      @next="selectedRows = []"
                      @prev="selectedRows = []"
                    />
                  </div>
                </VCardText>
              </VListItem>
            </VList>
          </VCardText>
        </div>
      </VCard>
    </VCol>
  </VRow>
</template>

