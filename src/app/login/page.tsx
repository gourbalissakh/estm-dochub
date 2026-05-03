"use client";

import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", { email: form.get("email"), password: form.get("password"), redirect: false });
    if (res?.ok) router.push("/profile");
    else setError("Identifiants invalides ou compte pas encore valide.");
  }
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-10">
      <Card className="w-full">
        <CardHeader><CardTitle>Connexion</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4">
            <Input name="email" type="email" placeholder="admin@estm.sn" required />
            <div className="relative">
              <Input name="password" type={show ? "text" : "password"} placeholder="Mot de passe" required />
              <button type="button" className="absolute right-3 top-2.5" onClick={() => setShow((v) => !v)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Se souvenir de moi</label>
            {error && <p className="text-sm text-red-800">{error}</p>}
            <Button>Se connecter</Button>
          </form>
          <p className="mt-4 text-sm">Pas encore de compte ? <Link className="font-semibold text-violet-800" href="/register">S&apos;inscrire</Link></p>
        </CardContent>
      </Card>
    </div>
  );
}
