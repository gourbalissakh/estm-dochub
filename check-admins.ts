import { prisma } from "./src/lib/prisma";

async function main() {
  const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
  const admins = await prisma.user.findMany({ 
    where: { role: "ADMIN" },
    select: { id: true, email: true, firstName: true, lastName: true, status: true, createdAt: true }
  });
  console.log("=== ADMIN ACCOUNTS ===");
  console.log(`Total: ${adminCount}`);
  console.log("\nList:");
  admins.forEach((admin, i) => {
    console.log(`${i + 1}. ${admin.firstName} ${admin.lastName} (${admin.email}) - ${admin.status} - ${admin.createdAt}`);
  });
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
