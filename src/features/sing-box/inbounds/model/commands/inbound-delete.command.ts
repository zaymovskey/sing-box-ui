import { useCallback } from "react";

import { useDeleteInboundMutation } from "../mutations/delete-inbound.mutation";

export function useDeleteInbound() {
  const deleteInboundMutation = useDeleteInboundMutation();

  const deleteInbound = useCallback(
    async (tag: string) => {
      return deleteInboundMutation.mutateAsync(tag);
    },
    [deleteInboundMutation],
  );

  return {
    deleteInbound,
    isPending: deleteInboundMutation.isPending,
  };
}
