<template>
  <v-app>
    <v-app-bar title="API Key Manager">
      <template #append>
        <ThemeToggler />
        <v-btn v-if="VITE_APPS_URL" :href="VITE_APPS_URL" icon="mdi-apps" />

        <template v-if="isOidc">
          <v-btn
            v-if="isAuthenticated"
            icon="mdi-logout"
            variant="text"
            @click="logout"
          />

          <v-btn v-else icon="mdi-login" variant="text" @click="login" />
        </template>

        <v-text-field
          v-else
          v-model="userId"
          class="mr-3"
          density="compact"
          hide-details
          label="User ID"
          variant="outlined"
          width="200"
        />
      </template>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import ThemeToggler from '@/components/ThemeToggle.vue'
  import { useAuth } from '@/composables/useAuth'
  import { userId } from '@/composables/useUserId'
  import runtimeEnv from '@/runtimeEnv'

  const { VITE_APPS_URL } = runtimeEnv

  const { isOidc, isAuthenticated, login, logout } = useAuth()
</script>
