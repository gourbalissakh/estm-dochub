"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { initials } from "@/lib/utils";

export function MessageCard({ message }: { message: any }) {
  const [safeContent, setSafeContent] = useState(message.content);

  useEffect(() => {
    import("isomorphic-dompurify").then((mod) => {
      setSafeContent(mod.default.sanitize(message.content));
    });
  }, [message.content]);

  const created = message.createdAt ? new Date(message.createdAt) : null;
  const date = created
    ? created.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
    : null;

  return (
    <Card className="hover:border-[var(--primary)]/30 hover:shadow-[var(--shadow-md)] transition">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[image:linear-gradient(135deg,#7c3aed,#06b6d4)] text-sm font-bold text-white shadow-md">
            {initials(message.author?.firstName, message.author?.lastName)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-[var(--fg)] truncate">
                {message.author?.firstName} {message.author?.lastName}
              </span>
              {message.filiere?.code && (
                <Badge variant="outline">{message.filiere.code}</Badge>
              )}
              {date && (
                <span className="text-[11px] text-[var(--fg-muted)]">{date}</span>
              )}
            </div>
            <p
              className="mt-2 text-sm leading-relaxed text-[var(--fg-soft)]"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
