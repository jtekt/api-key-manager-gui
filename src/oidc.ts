import { UserManager } from 'oidc-client-ts'
import runtimeEnv from '@/runtimeEnv'

const { VITE_OIDC_AUTHORITY, VITE_OIDC_CLIENT_ID } = runtimeEnv

export const userManager = VITE_OIDC_AUTHORITY
  ? new UserManager({
      authority: VITE_OIDC_AUTHORITY,
      client_id: VITE_OIDC_CLIENT_ID as string,
      redirect_uri: `${window.location.origin}/callback`,
      scope: 'openid profile email',
      automaticSilentRenew: true,
    })
  : null
