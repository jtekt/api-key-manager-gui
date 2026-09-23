<template>
  <v-card
    prepend-icon="mdi-information"
    :subtitle="version"
    title="API Key Manager"
  >
    <v-card-text>
      <div class="text-subtitle-2 mb-2">Environment variables</div>

      <v-table density="compact">
        <tbody>
          <tr v-for="envVar in envVars" :key="envVar.key">
            <td>{{ envVar.key }}</td>
            <td>{{ envVar.value }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { apiBase } from '@/api'
  import runtimeEnv from '@/runtimeEnv'

  const {
    VITE_APP_VERSION,
    VITE_OIDC_AUTHORITY,
    VITE_OIDC_CLIENT_ID,
    VITE_APPS_URL,
  } = runtimeEnv

  const version = VITE_APP_VERSION || 'dev'

  const envVars = [
    { key: 'VITE_API_BASE_URL', value: apiBase },
    { key: 'VITE_OIDC_AUTHORITY', value: VITE_OIDC_AUTHORITY },
    { key: 'VITE_OIDC_CLIENT_ID', value: VITE_OIDC_CLIENT_ID },
    { key: 'VITE_APPS_URL', value: VITE_APPS_URL },
  ]
</script>
