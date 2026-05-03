import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FiliereCard({ filiere }: { filiere: any }) {
  return (
    <Link href={`/documents?filiere=${filiere.id}`}>
      <Card className="h-full transition hover:-translate-y-0.5 hover:border-cyan-400 hover:shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-cyan-300">
              <BookOpen size={20} />
            </div>
            <Badge>{filiere.sector === "TECH" ? "Tech" : "Management"}</Badge>
          </div>
          <CardTitle>{filiere.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="min-h-12 text-sm text-[#4B3F6B] dark:text-violet-200">{filiere.description}</p>
          <div className="mt-4 flex items-center justify-between text-sm font-semibold text-violet-800 dark:text-cyan-300">
            <span>{filiere._count?.documents ?? 0} documents</span>
            <ArrowRight size={16} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
