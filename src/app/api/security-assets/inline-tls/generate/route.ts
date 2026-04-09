import {
  TLSInlineGenerateRequestSchema,
  type TLSInlineGenerateResponse,
  TLSInlineGenerateResponseSchema,
} from "@/shared/api/contracts";
import { generateSelfSignedInlineCert, withRoute } from "@/shared/server";

export const runtime = "nodejs";

export const POST = withRoute({
  auth: true,
  requestSchema: TLSInlineGenerateRequestSchema,
  responseSchema: TLSInlineGenerateResponseSchema,
  handler: async ({ body }) => {
    try {
      const { certificate, key } = await generateSelfSignedInlineCert({
        commonName: body.serverName,
      });

      return {
        certificatePem: certificate,
        keyPem: key,
      } satisfies TLSInlineGenerateResponse;
    } catch {
      return {
        certificatePem: "",
        keyPem: "",
      } satisfies TLSInlineGenerateResponse;
    }
  },
});
