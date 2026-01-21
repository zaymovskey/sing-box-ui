export const apiRoutes = {
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
  },
  singBox: {
    configEditor: "/api/sing-box/config-editor",
  },
} as const;
