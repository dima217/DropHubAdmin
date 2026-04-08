"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { disconnectSupportSocket, getSupportSocket } from "@/shared/ws/support-socket";

export function SupportLiveSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSupportSocket();
    socket.emit("support.subscribeAdmin");

    const refetch = () => {
      queryClient.invalidateQueries({ queryKey: ["admin-support-tickets"] });
    };

    socket.on("support.ticket.created", refetch);
    socket.on("support.ticket.updated", refetch);

    return () => {
      socket.off("support.ticket.created", refetch);
      socket.off("support.ticket.updated", refetch);
      socket.emit("support.unsubscribeUser");
      disconnectSupportSocket();
    };
  }, [queryClient]);

  return null;
}
