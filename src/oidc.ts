import { UserManager } from 'oidc-client-ts'

export const userManager = import.meta.env.VITE_OIDC_AUTHORITY
  ? new UserManager({
      authority: import.meta.env.VITE_OIDC_AUTHORITY as string,
      client_id: import.meta.env.VITE_OIDC_CLIENT_ID as string,
      redirect_uri: `${window.location.origin}/callback`,
      scope: 'openid profile email',
      automaticSilentRenew: true,
    })
  : null
