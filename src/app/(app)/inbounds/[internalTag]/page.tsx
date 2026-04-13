import { type Metadata } from "next";

import { InboundDetailsScreen } from "@/features/sing-box/inbounds";

export const metadata: Metadata = {
  title: "Inbound",
};

type PageProps = {
  params: Promise<{
    internalTag: string;
  }>;
};

export default async function InboundsPage({ params }: PageProps) {
  const { internalTag } = await params;

  return <InboundDetailsScreen internalTag={internalTag} />;
}
