import { PrismaClient, Role, UserStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD
    const firstName = process.env.ADMIN_FIRST_NAME ?? 'Admin'
    const lastName = process.env.ADMIN_LAST_NAME ?? 'ESTM'

    if (!email || !password) {
        throw new Error(
            'ADMIN_EMAIL et ADMIN_PASSWORD sont requis (variables d environnement).',
        )
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        throw new Error(
            'ADMIN_PASSWORD doit faire au moins 8 caracteres avec une majuscule et un chiffre.',
        )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const admin = await prisma.user.upsert({
        where: { email },
        update: {
            passwordHash,
            firstName,
            lastName,
            role: Role.ADMIN,
            status: UserStatus.VALIDATED,
        },
        create: {
            email,
            passwordHash,
            firstName,
            lastName,
            role: Role.ADMIN,
            status: UserStatus.VALIDATED,
        },
    })

    console.log(`Admin pret: ${admin.email}`)
}

main()
    .then(async () => prisma.$disconnect())
    .catch(async (error) => {
        console.error(error)
        await prisma.$disconnect()
        process.exit(1)
    })
