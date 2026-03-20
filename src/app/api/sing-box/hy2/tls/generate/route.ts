// import { Hy2TlsGenerateResponseSchema } from "@/shared/api/contracts";
// import { Hy2TlsGenerateRequestSchema } from "@/shared/api/contracts/sing-box/hy2/tls/hy2-tls-generate.schema";
// import { withRoute } from "@/shared/lib/server";

/**
 * Check Hysteria2 TLS certificate and key
 * @description Validates Hysteria2 TLS files stored in the managed sing-box certificates directory.
 * Checks that the certificate and key exist, are readable, are valid PEM files, and match each other.
 * @tag SingBox
 *
 * @body Hy2TlsGenerateRequestSchema
 * @response 200:Hy2TlsGenerateResponseSchema
 * @add 401:ApiErrorPayloadSchema
 * @add 503:ApiErrorPayloadSchema
 *
 * @openapi
 */
// export const POST = withRoute({
//   auth: true,
//   requestSchema: Hy2TlsGenerateRequestSchema,
//   responseSchema: Hy2TlsGenerateResponseSchema,
//   handler: async ({ body }) => {},
// });
