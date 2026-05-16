import {
    DocumentType,
    Niveau,
    PrismaClient,
    Role,
    Sector,
    UserStatus,
} from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const filieres = [
    [
        'Telecommunications, Reseaux et Cybersecurite',
        'TRC',
        Sector.TECH,
        'Network',
        'Infrastructures reseau, telecommunications et securite informatique.',
    ],
    [
        'Genie Logiciel et Reseaux',
        'GLR',
        Sector.TECH,
        'Code',
        'Developpement logiciel, architectures distribuees et administration reseau.',
    ],
    [
        'Securite des Systemes d Information',
        'SSI',
        Sector.TECH,
        'Shield',
        'Cybersecurite, audit et protection des systemes d information.',
    ],
    [
        'Monetique et Transactions Securisees',
        'MTS',
        Sector.TECH,
        'CreditCard',
        'Paiements electroniques, fintech et securisation des transactions.',
    ],
    [
        'Informatique et Multimedia',
        'IM',
        Sector.TECH,
        'Image',
        'Developpement web, design numerique et production multimedia.',
    ],
    [
        'Genie Electrique et Energies Renouvelables',
        'GEER',
        Sector.TECH,
        'Zap',
        'Electricite, automatisme et solutions energetiques durables.',
    ],
    [
        'Big Data et Intelligence Artificielle',
        'BIA',
        Sector.TECH,
        'Brain',
        'Science des donnees, machine learning et IA appliquee.',
    ],
    [
        'Sciences de Gestion',
        'SG',
        Sector.MGMT,
        'Briefcase',
        'Pilotage d entreprise, strategie et management general.',
    ],
    [
        'Finance et Comptabilite',
        'FC',
        Sector.MGMT,
        'Calculator',
        'Comptabilite, audit, controle de gestion et analyse financiere.',
    ],
    [
        'Ingenierie des Ressources Humaines',
        'IRH',
        Sector.MGMT,
        'Users',
        'Gestion des talents, droit social et developpement humain.',
    ],
    [
        'Management de Projets et Innovation',
        'MPI',
        Sector.MGMT,
        'Target',
        'Pilotage de projets, methodes agiles et innovation entrepreneuriale.',
    ],
    [
        'Marketing et Communication',
        'MC',
        Sector.MGMT,
        'Megaphone',
        'Marketing digital, communication d entreprise et relation client.',
    ],
    [
        'Droit',
        'DRT',
        Sector.MGMT,
        'Scale',
        'Droit des affaires, droit social et environnement juridique.',
    ],
] as const

async function main() {
    await prisma.download.deleteMany()
    await prisma.favorite.deleteMany()
    await prisma.document.deleteMany()
    await prisma.user.deleteMany()
    await prisma.filiere.deleteMany()

    const createdFilieres = await Promise.all(
        filieres.map(([name, code, sector, icon, description]) =>
            prisma.filiere.create({
                data: { name, code, sector, icon, description },
            }),
        ),
    )

    const admin = await prisma.user.create({
        data: {
            email: 'admin@estm.sn',
            passwordHash: await bcrypt.hash('Admin123!', 12),
            firstName: 'Admin',
            lastName: 'ESTM',
            role: Role.ADMIN,
            status: UserStatus.VALIDATED,
        },
    })

    await Promise.all(
        Array.from({ length: 5 }).map((_, index) =>
            prisma.user.create({
                data: {
                    email: `etudiant${index + 1}@estm.sn`,
                    passwordHash: bcrypt.hashSync('Student123!', 12),
                    firstName: `Etudiant${index + 1}`,
                    lastName: 'Test',
                    studentNumber: `ESTM-2026-00${index + 1}`,
                    status:
                        index === 4 ? UserStatus.PENDING : UserStatus.VALIDATED,
                    filiereId: createdFilieres[index].id,
                    niveau: [
                        Niveau.L1,
                        Niveau.L2,
                        Niveau.L3,
                        Niveau.M1,
                        Niveau.M2,
                    ][index],
                    anneeAcademique: '2025-2026',
                },
            }),
        ),
    )

    for (let index = 0; index < createdFilieres.length; index += 1) {
        const filiere = createdFilieres[index]
        await prisma.document.create({
            data: {
                title: `${['Cours', 'Ancien sujet', 'TP', 'TD'][index % 4]} ${filiere.code}`,
                description: `Ressource academique de demonstration pour ${filiere.name}.`,
                filePath: 'placeholder://no-file',
                fileSize: 96,
                fileType: 'application/pdf',
                filiereId: filiere.id,
                type: [
                    DocumentType.COURS,
                    DocumentType.ANCIEN_SUJET,
                    DocumentType.TP,
                    DocumentType.TD,
                ][index % 4],
                niveau: [Niveau.L1, Niveau.L2, Niveau.L3, Niveau.M1, Niveau.M2][
                    index % 5
                ],
                anneeAcademique: '2025-2026',
                matiere: [
                    'Algorithmique',
                    'Comptabilite',
                    'Reseaux',
                    'Management',
                ][index % 4],
                uploaderId: admin.id,
                downloadCount: index * 3,
            },
        })
    }

}

main()
    .then(async () => prisma.$disconnect())
    .catch(async (error) => {
        console.error(error)
        await prisma.$disconnect()
        throw error
    })
