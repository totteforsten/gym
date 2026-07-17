// CLI seed entrypoint: `npm run db:seed` or `prisma db seed`.
import { ensureSeeded } from "../src/lib/seed";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Seeding Atlas Gym database…");
  await ensureSeeded();
  const exercises = await prisma.exercise.count();
  const programs = await prisma.program.count();
  console.log(`✅ Done. ${exercises} exercises, ${programs} programs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
