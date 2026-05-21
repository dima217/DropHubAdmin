"use client";

import { useState } from "react";
import { SupportTicket } from "@/shared/types/admin";
import { Button } from "@/shared/ui/button";

type Props = {
  ticket: SupportTicket | null;
  pending?: boolean;
  onClose: () => void;
  onSubmit: (payload: { id: string; response: string; markResolved: boolean }) => void;
};

export function SupportRespondModal({ ticket, pending = false, onClose, onSubmit }: Props) {
  const [text, setText] = useState("");
  const [markResolved, setMarkResolved] = useState(false);

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label="Закрыть модальное окно" />
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-5 shadow-2xl">
        <p className="text-xs text-muted">Обращение №{ticket.id}</p>
        <h3 className="mt-1 text-lg font-semibold text-foreground">{ticket.title}</h3>
        <p className="mt-2 text-sm text-muted">{ticket.details}</p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ответ администратора..."
          className="mt-4 min-h-36 w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-blue-500"
        />

        <label className="mt-3 flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={markResolved}
            onChange={(e) => setMarkResolved(e.target.checked)}
            className="size-4 rounded border-border bg-input"
          />
          Сразу закрыть обращение как «Решено»
        </label>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Отмена
          </Button>
          <Button
            onClick={() => onSubmit({ id: ticket.id, response: text.trim(), markResolved })}
            disabled={pending || !text.trim()}
          >
            {pending ? "Отправка..." : "Отправить ответ"}
          </Button>
        </div>
      </div>
    </div>
  );
}
