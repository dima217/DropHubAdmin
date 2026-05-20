"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SupportTicket } from "@/shared/types/admin";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { SupportLiveSync } from "@/features/support-queue/ui/support-live-sync";
import { SupportRespondModal } from "@/features/support-queue/ui/support-respond-modal";

type Props = { tickets: SupportTicket[] };

export function SupportList({ tickets }: Props) {
  const queryClient = useQueryClient();
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const ticketsQuery = useQuery({
    queryKey: ["admin-support-tickets"],
    queryFn: async () => {
      const res = await fetch("/api/admin/support");
      if (!res.ok) throw new Error("Failed to load support tickets");
      return (await res.json()) as { items: SupportTicket[] };
    },
    initialData: { items: tickets },
  });

  const respondMutation = useMutation({
    mutationFn: async (payload: { id: string; response: string; markResolved: boolean }) => {
      await fetch(`/api/admin/support/${payload.id}/respond`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: payload.response }),
      });
      if (payload.markResolved) {
        await fetch(`/api/admin/support/${payload.id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "resolved" }),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-support-tickets"] });
      setActiveTicket(null);
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      await fetch(`/api/admin/support/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-support-tickets"] });
    },
  });

  return (
    <div className="space-y-3">
      <SupportLiveSync />
      {ticketsQuery.data?.items.map((ticket) => (
        <Card key={ticket.id}>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-medium">{ticket.title}</h3>
            <Badge kind={ticket.status === "resolved" ? "active" : "warning"}>
              {ticket.status}
            </Badge>
          </div>
          <p className="text-sm text-muted">{ticket.details}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={() => setActiveTicket(ticket)}>Ответить</Button>
            {ticket.status !== "resolved" ? (
              <Button
                variant="secondary"
                onClick={() => resolveMutation.mutate(ticket.id)}
                disabled={resolveMutation.isPending}
              >
                Закрыть как решенное
              </Button>
            ) : null}
          </div>
        </Card>
      ))}
      <SupportRespondModal
        ticket={activeTicket}
        pending={respondMutation.isPending}
        onClose={() => setActiveTicket(null)}
        onSubmit={(payload) => respondMutation.mutate(payload)}
      />
    </div>
  );
}
