import Link from "next/link";

export function Footer() {
  const columns = [
    ["Plateforme", "Documents", "Filieres", "Messages"],
    ["Ressources", "Cours", "TP", "Anciens sujets"],
    ["ESTM Dakar", "Tech", "Management", "Communautes"],
    ["Support", "Regles", "Confidentialite", "Contact"],
  ];
  return (
    <footer className="mt-auto border-t border-violet-100 bg-[#FAF8FD] dark:border-violet-900 dark:bg-[#1E1830]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map(([title, ...items]) => (
          <div key={title}>
            <h3 className="mb-3 font-semibold text-[#1A1033] dark:text-violet-50">{title}</h3>
            <div className="grid gap-2 text-sm text-[#4B3F6B] dark:text-violet-200">
              {items.map((item) => <Link key={item} href="/documents">{item}</Link>)}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
