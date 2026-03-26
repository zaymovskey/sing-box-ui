export const apiRoutes = {
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
  },
  singBox: {
    status: "/api/sing-box/status",
    reload: "/api/sing-box/reload",
    configEditor: "/api/sing-box/config-editor",
    inbounds: {
      create: "/api/sing-box/inbounds",
      edit: (originalTag: string) => `/api/sing-box/inbounds/${originalTag}`,
      delete: (tag: string) => `/api/sing-box/inbounds/${tag}`,
      hy2: {
        tls: {
          check: "/api/sing-box/inbounds/hy2/tls/check",
          generate: "/api/sing-box/inbounds/hy2/tls/generate",
        },
      },
      vless: {
        tls: {
          generate: "/api/sing-box/inbounds/vless/tls/generate",
        },
      },
    },
  },
} as const;
