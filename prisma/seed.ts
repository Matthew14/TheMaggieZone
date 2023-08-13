const p = require('@prisma/client')
const prisma = new p.PrismaClient()

async function main() {
  const matthew = await prisma.user.upsert({
    where: { email: 'matthew@matthewoneill.com' },
    update: {},
    create: {
      email: 'matthew@matthewoneill.com',
      username: 'matthew',
      firstName: 'Matthew',
      lastName: "O'Neill",
      weights: {
        create: {
            amountInKg: 13.07
        },
      },
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })