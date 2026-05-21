<template>
  <v-app>
    <v-app-bar title="API Key Manager" flat border="b">
      <template #append>
        <template v-if="isOidc">
          <span v-if="isAuthenticated" class="text-body-2 mr-3">{{ displayName }}</span>
          <v-btn v-if="isAuthenticated" variant="text" @click="logout">Logout</v-btn>
          <v-btn v-else variant="text" @click="login">Login</v-btn>
        </template>
        <v-text-field
          v-else
          v-model="userId"
          label="User ID"
          density="compact"
          hide-details
          variant="outlined"
          width="200"
          class="mr-3"
        />
      </template>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables/useAuth'
import { userId } from '@/composables/useUserId'

const { isOidc, isAuthenticated, displayName, login, logout } = useAuth()
</script>
