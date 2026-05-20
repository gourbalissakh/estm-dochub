import fs from "node:fs/promises";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const noisyConsolePatterns = [
  "Missing `Description`",
  "Method Not Allowed",
  "width(-1)",
  "height(-1)",
  "Failed to load resource: the server responded with a status of 405",
];

test.afterAll(async () => {
  const docs = await prisma.document.findMany({ where: { title: { startsWith: "Document E2E" } } });
  await prisma.document.deleteMany({ where: { title: { startsWith: "Document E2E" } } });
  await Promise.all(
    docs.map((doc) => fs.rm(path.join(process.cwd(), doc.filePath), { force: true }).catch(() => undefined)),
  );
  await fs.rm(path.join(process.cwd(), "e2e", "document-e2e.pdf"), { force: true }).catch(() => undefined);
  await prisma.$disconnect();
});

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    const text = message.text();
    if ((message.type() === "error" || message.type() === "warning") && noisyConsolePatterns.some((pattern) => text.includes(pattern))) {
      errors.push(text);
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));
  (page as Page & { consoleErrors?: string[] }).consoleErrors = errors;
});

test.afterEach(async ({ page }) => {
  expect((page as Page & { consoleErrors?: string[] }).consoleErrors ?? []).toEqual([]);
});

async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByPlaceholder("prenom.nom@estm.sn").fill(email);
  await page.getByPlaceholder("••••••••").fill(password);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await page.waitForURL(/\/(admin|documents)$/, { timeout: 15_000 });
}

async function goto(page: Page, url: string) {
  const response = await page.goto(url, { waitUntil: "load" });
  expect(response?.ok(), url).toBeTruthy();
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);
}

test("parcours public et aperçu PDF", async ({ page, request }) => {
  for (const url of ["/", "/filieres", "/documents", "/login", "/register"]) {
    await goto(page, url);
  }

  await goto(page, "/documents");
  await expect(page.getByTestId("doc-card").first()).toBeVisible();
  await page.getByTestId("doc-card").first().getByRole("button", { name: "Apercu" }).click();
  await expect(page.getByRole("dialog", { name: "Apercu PDF" })).toBeVisible();

  const src = await page.locator("iframe").getAttribute("src");
  expect(src).toBeTruthy();
  const preview = await request.get(src!);
  expect(preview.status()).toBe(200);
  expect(preview.headers()["content-type"]).toContain("application/pdf");
});

test("connexion étudiant, favori, téléchargement", async ({ page }) => {
  await login(page, "etudiant1@estm.sn", "Student123!");

  await goto(page, "/documents");
  await expect(page.getByTestId("doc-card").first()).toBeVisible();
  await page.getByTestId("doc-card").first().getByRole("button", { name: "Favori" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByTestId("doc-card").first().getByRole("button", { name: "Telecharger" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain(".pdf");
});

test("admin dashboard, modération et upload chunké", async ({ page }) => {
  await login(page, "admin@estm.sn", "Admin123!");
  await goto(page, "/admin");
  await expect(page.getByText("Dashboard admin")).toBeVisible();
  await expect(page.getByText("Activite 7 jours")).toBeVisible();

  await goto(page, "/admin/documents");
  await expect(page.getByRole("heading", { name: "Documents" })).toBeVisible();
  await page.getByRole("button", { name: "Masquer" }).first().click();
  await expect(page.getByRole("button", { name: "Afficher" }).first()).toBeVisible();
  await page.getByRole("button", { name: "Afficher" }).first().click();

  await goto(page, "/admin/upload");
  const pdfPath = path.join(process.cwd(), "e2e", "document-e2e.pdf");
  await fs.writeFile(
    pdfPath,
    `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 47 >>
stream
BT
/F1 18 Tf
72 720 Td
(Document E2E) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000241 00000 n 
0000000338 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
408
%%EOF`,
  );
  await page.locator('input[type="file"]').setInputFiles(pdfPath);
  await page.getByPlaceholder("Titre").fill(`Document E2E ${Date.now()}`);
  await page.getByPlaceholder("Description").fill("Document créé par le test navigateur.");
  await page.getByPlaceholder("Matiere").fill("Qualite logicielle");
  await page.getByRole("button", { name: "Envoyer" }).click();
  await expect(page.getByTestId("upload-progress")).toHaveAttribute("style", /100%/);

  await goto(page, "/documents?q=Document%20E2E");
  await expect(page.getByText("Document E2E")).toBeVisible();
});
