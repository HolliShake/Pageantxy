<script setup>
import router from '@/router'
import useAuthStore from '@/stores/auth.store'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import auth2 from '@images/pageantxy/auth2-final.png'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { VForm } from 'vuetify/components/VForm'

const authThemeImg = useGenerateImageVariant(
  auth2,
  auth2,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true,
)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const isPasswordVisible = ref(false)
const refVForm = ref()
const authStore = useAuthStore()
const error = ref(null)
const email = ref('')
const password = ref('')
const rememberMe = ref(false)



const onSignin = async () => { 

  if (await refVForm.value.validate())
  {
    authStore.login(email.value, password.value)
      .then(user => {

        let abilities = JSON.parse(localStorage.getItem('userAbilities'))
        if (!abilities) router.push({ name: 'logout' })

        let isAdmin = !(!Array.from(new Set(abilities.map(a => a.subject)))
          .find(subject => subject == 'all' || subject.toLowerCase() == 'admin'))

        if (isAdmin)
          router.push({ name: 'dashboard' })
        else
          router.push({ name: 'scoring' })
      })
      .catch(err => { 
        error.value = err
      })
  }

}
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper bg-surface"
  >
    <VCol
      lg="8"
      class="d-none d-lg-flex"
    >
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="505"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg
          :src="authThemeMask"
          class="auth-footer-mask"
        />
      </div>
    </VCol>
    
    <VCol
      cols="12"
      lg="4"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <VCard
        flat
        rounded="0"
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <VNodeRenderer
            :nodes="themeConfig.app.logo"
            class="mb-6"
          />

          <h5 class="text-h5 mb-1">
            Welcome to <span class="text-capitalize"> {{ themeConfig.app.title }} </span>! 👋🏻
          </h5>

          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>

        <VCardText v-show="error">
          <VAlert
            color="error"
            variant="tonal"
          >
            <span>{{ error }}</span>
          </VAlert>
        </VCardText>

        <VCardText>
          <VForm ref="refVForm">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="email"
                  label="Email"
                  type="email"
                  autofocus
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="password"
                  label="Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <VCheckbox
                    v-model="rememberMe"
                    label="Remember me"
                  />
                  <a
                    class="text-primary ms-2 mb-1"
                    href="#"
                  >
                    Forgot Password?
                  </a>
                </div>

                <VBtn
                  block
                  type="button"
                  @click="onSignin"
                >
                  Login
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-center"
              >
                <span>New on our platform?</span>

                <a
                  class="text-primary ms-2"
                  href="#"
                >
                  Create an account
                </a>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
  meta:
    layout: blank
    redirectIfLoggedIn: true
</route>
