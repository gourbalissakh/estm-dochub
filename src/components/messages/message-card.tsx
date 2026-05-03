"use client";

import DOMPurify from "isomorphic-dompurify";
import { Card, CardContent } from "@/components/ui/card";
import { initials } from "@/lib/utils";

export function MessageCard({ message }: { message: any }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-violet-100 font-bold text-violet-900">
            {initials(message.author?.firstName, message.author?.lastName)}
          </div>
          <div>
            <div className="text-sm font-semibold">{message.author?.firstName} {message.author?.lastName} · {message.filiere?.code}</div>
            <p className="mt-2 text-[#4B3F6B] dark:text-violet-200" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.content) }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
