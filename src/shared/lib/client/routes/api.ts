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
      list: "/api/sing-box/inbounds/list",
    },
  },
  securityAssets: {
    list: "/api/sing-box/security-assets",
    create: "/api/sing-box/security-assets",
    delete: (id: string) => `/api/sing-box/security-assets/${id}`,
    edit: (id: string) => `/api/sing-box/security-assets/${id}`,
    tls: {
      file: {
        check: "/api/sing-box/security-assets/file-tls/check",
        generate: "/api/sing-box/security-assets/file-tls/generate",
      },
    },
    reality: {
      keysPairGenerate:
        "/api/sing-box/security-assets/reality/keys-pair-generate",
    },
  },
} as const;
