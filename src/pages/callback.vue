<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-progress-circular indeterminate />
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userManager } from '@/oidc'

const router = useRouter()

onMounted(async () => {
  await userManager?.signinRedirectCallback()
  router.push('/')
})
</script>
