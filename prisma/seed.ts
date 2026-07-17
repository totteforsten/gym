// CLI seed entrypoint: `npm run db:seed` or `prisma db seed`.
import { ensureSeeded } from "../src/lib/seed";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Seeding Atlas Gym exercise library…");
  await ensureSeeded();
  const exercises = await prisma.exercise.count();
  console.log(
    `✅ Done. ${exercises} exercises in the shared library. ` +
      `Programs and profiles are created per-user on sign-up.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
