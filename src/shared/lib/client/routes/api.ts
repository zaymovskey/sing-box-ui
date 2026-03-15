export const apiRoutes = {
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
  },
  singBox: {
    configEditor: "/api/sing-box/config-editor",
    hy2: {
      tls: {
        check: "/api/sing-box/hy2/tls/check",
      },
    },
  },
} as const;
