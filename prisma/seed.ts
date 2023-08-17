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
  const photos = await prisma.image.createMany({
    data: [{ title: "71209164385__4CA7D917-BFC0-40A0-AB82-BE64660257A9.jpeg", path: "public/71209164385__4CA7D917-BFC0-40A0-AB82-BE64660257A9.jpeg" },
{ title: "IMG_1913.jpeg", path: "public/IMG_1913.jpeg" },
{ title: "seatbelt.jpeg", path: "public/seatbelt.jpeg" },
{ title: "IMG_1776.jpeg", path: "public/IMG_1776.jpeg" },
{ title: "IMG_1919.jpeg", path: "public/IMG_1919.jpeg" },
{ title: "shoe.jpeg", path: "public/shoe.jpeg" },
{ title: "IMG_1796.jpeg", path: "public/IMG_1796.jpeg" },
{ title: "IMG_4039.jpeg", path: "public/IMG_4039.jpeg" },
{ title: "slipper.jpeg", path: "public/slipper.jpeg" },
{ title: "IMG_1803.jpeg", path: "public/IMG_1803.jpeg" },
{ title: "angry.jpeg", path: "public/angry.jpeg" },
{ title: "stair.jpeg", path: "public/stair.jpeg" },
{ title: "IMG_1889.jpeg", path: "public/IMG_1889.jpeg" },
{ title: "maggie.jpeg", path: "public/maggie.jpeg" },
{ title: "toy.jpeg", path: "public/toy.jpeg" },
{ title: "IMG_1901.jpeg", path: "public/IMG_1901.jpeg" },
{ title: "sad_maggie.jpeg", path: "public/sad_maggie.jpeg" }]
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