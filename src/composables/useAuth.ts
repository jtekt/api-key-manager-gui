import { ref, computed } from 'vue'
import type { User } from 'oidc-client-ts'
import { userManager } from '@/oidc'
import { userId } from '@/composables/useUserId'

const oidcUser = ref<User | null>(null)

export async function initAuth() {
  if (!userManager) return
  oidcUser.value = await userManager.getUser()
  userManager.events.addUserLoaded(u => { oidcUser.value = u })
  userManager.events.addUserUnloaded(() => { oidcUser.value = null })
}

export function useAuth() {
  const isOidc = !!userManager

  const isAuthenticated = computed(() =>
    isOidc ? !!(oidcUser.value && !oidcUser.value.expired) : !!userId.value
  )

  const displayName = computed(() =>
    oidcUser.value?.profile.name ?? oidcUser.value?.profile.email ?? ''
  )

  function getAuthHeaders(): Record<string, string> {
    if (isOidc && oidcUser.value?.access_token) {
      return { Authorization: `Bearer ${oidcUser.value.access_token}` }
    }
    return { 'X-User-ID': userId.value }
  }

  function login() { userManager?.signinRedirect() }
  function logout() { userManager?.signoutRedirect() }

  return { isOidc, oidcUser, isAuthenticated, displayName, getAuthHeaders, login, logout }
}
