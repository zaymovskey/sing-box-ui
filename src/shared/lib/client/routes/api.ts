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
      get: (tag: string) => `/api/sing-box/inbounds/${tag}`,
      list: "/api/sing-box/inbounds",
      stats: "/api/sing-box/inbounds/stats",
      diagnostic: (internalTag: string) =>
        `/api/sing-box/inbounds/${internalTag}/diagnostic`,
    },
  },
  securityAssets: {
    list: "/api/security-assets",
    create: "/api/security-assets",
    delete: (id: string) => `/api/security-assets/${id}`,
    edit: (id: string) => `/api/security-assets/${id}`,
    tls: {
      file: {
        check: "/api/security-assets/file-tls/check",
        generate: "/api/security-assets/file-tls/generate",
      },
      inline: {
        generate: "/api/security-assets/inline-tls/generate",
      },
    },
    reality: {
      keysPairGenerate: "/api/security-assets/reality/keys-pair-generate",
    },
  },
} as const;
