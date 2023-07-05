<script setup>
import { requiredValidator } from '@/@core/utils/validators'
import Group from '@/defaults/Group'
import availablePages from '@/defaults/availablePages'
import useCandidateStore from '@/stores/candidate.store'
import useContestStore from '@/stores/contest.store'
import useRegisterStore from '@/stores/register.store'
import { computed, onMounted, watch } from 'vue'

const parameters = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])
const isDialogVisible = ref(false)

const rowPerPage = ref(availablePages[availablePages.length - 1])
const currentPage = ref(1)
const totalPage = ref(1)
const selectedRows = ref([])

const availableGroups = ref(['any', ...Group])
const contestStore = useContestStore()
const candidateStore = useCandidateStore()
const registerStore = useRegisterStore()


const choosenCandidate = ref([])

const candidates = computed(() => {
  return candidateStore.getCandidates
})

const searchQuery = ref('')
const groupFilter = ref(availableGroups.value[0])
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

watch(isDialogVisible, () => { 
  if (isDialogVisible.value) choosenCandidate.value = []
}, { deep: true })

watch(choosenCandidate, () => { 
  emit('update:modelValue', choosenCandidate.value)
}, { deep: true })

watch(rowPerPage, () => { 
  totalPage.value = (rowPerPage.value != 'all') ? Math.ceil(candidates.value.length / rowPerPage.value) : 1
}, { deep: true, immediate: true })


const computedDisplay = computed(() => {
  let candidates = []

  choosenCandidate.value.forEach(cc => {

    let can = filteredCandidates.value.find(c => c.id == cc)

    if (can)
      candidates.push(
        `#${can.candidateNumber} - ${can.lastName}, ${can.firstName}`,
      )
  })

  return candidates
})

onMounted(() => { 
  contestStore.fetchContests()
  candidateStore.fetchCandidates()
  registerStore.fetchRegistered()
})


function handleCheck(candidateId)
{
  if (choosenCandidate.value.includes(candidateId))
    choosenCandidate.value.filter(cc => cc != candidateId)
  else
    choosenCandidate.value.push(candidateId)
}

function handleClose()
{
  isDialogVisible.value = !isDialogVisible.value
  choosenCandidate.value = []
}
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    persistent
    scrollable
    max-width="1200"
  >
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <div class="d-flex flex-row flex-nowrap">
        <VBtn v-bind="props">
          Select
        </VBtn>

        <VSelect
          class="ms-2"
          readonly
          chips
          :model-value="computedDisplay"
          multiple
          :rules="[requiredValidator]"
        />
      </div>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="handleClose" />

    <!-- Dialog Content -->
    <VCard title="Select a candidate">
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
            md="4"
          >
            <VSelect
              v-model="groupFilter"
              label="Group"
              :items="availableGroups"
            />
          </VCol>
          <VCol
            cols="12"
            md="2"
          >
            <VBtn
              block
              @click="isDialogVisible = false"
            >
              SELECT
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
      <VCardText>
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
            <VListItem>
              <div class="d-flex flex-nowrap flex-row pa-1">
                <div class="d-flex flex-row flex-nowrap align-center">
                  <div class="pa-2">
                    <VCheckbox
                      :model-value="choosenCandidate.includes(candidate.id)"
                      @change="handleCheck(candidate.id)"
                    />
                  </div>

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
    </VCard>
  </VDialog>
</template>


