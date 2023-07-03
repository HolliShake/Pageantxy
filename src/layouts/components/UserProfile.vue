<script setup>
import useAuthStore from '@/stores/auth.store'
import NoImageAvailable from '@images/pageantxy/NoImageAvailable.png'

const authStore = useAuthStore()

function computedPicture(picture)
{
  if (!picture) return NoImageAvailable

  if (picture.length <= 0) 
    return NoImageAvailable

  return `${import.meta.env.VITE_APP_APP_URL}/files/${picture}`
}

function parseAbilities(roles)
{
  if (!roles) return []
  
  let abilities = JSON.parse(roles)
  
  return Array.from(new Set(abilities.map(r => (r.subject == 'all') ? 'admin' : r.subject)))
}
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg :src="computedPicture(authStore.getPicture)" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg :src="computedPicture(authStore.getPicture)" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ authStore.getFirstName }}
            </VListItemTitle>
            <VListItemSubtitle>
              <template
                v-for="(r, idx) in parseAbilities(authStore.getRole)"
                :key="idx"
              >
                {{ r }}

                <span v-if="idx < parseAbilities(authStore.getRole).length - 1">, &nbsp;</span>
              </template>
            </VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <RouterLink :to="{ name: 'profile' }">
            <VListItem link>
              <template #prepend>
                <VIcon
                  class="me-2"
                  icon="tabler-user"
                  size="22"
                />
              </template>
              <VListItemTitle>Profile</VListItemTitle>
            </VListItem>
          </RouterLink>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem to="/login">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-logout"
                size="22"
              />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
