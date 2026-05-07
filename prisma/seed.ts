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
        'Genie Logiciel',
        'GL',
        Sector.TECH,
        'Code',
        'Applications, architecture logicielle et qualite.',
    ],
    [
        'Reseaux et Telecommunications',
        'RT',
        Sector.TECH,
        'Network',
        'Infrastructure, securite et telecommunications.',
    ],
    [
        'Informatique de Gestion',
        'IG',
        Sector.TECH,
        'Database',
        "Systemes d'information et outils de gestion.",
    ],
    [
        'Genie Civil',
        'GC',
        Sector.TECH,
        'Building2',
        'Conception, structures et chantiers.',
    ],
    [
        'Genie Electrique',
        'GE',
        Sector.TECH,
        'Zap',
        'Electricite, automatisme et energie.',
    ],
    [
        'Genie Industriel',
        'GI',
        Sector.TECH,
        'Factory',
        'Production, methodes et optimisation.',
    ],
    [
        'Gestion des Entreprises',
        'MGT',
        Sector.MGMT,
        'Briefcase',
        'Pilotage, strategie et organisation.',
    ],
    [
        'Marketing et Communication',
        'MC',
        Sector.MGMT,
        'Megaphone',
        'Marques, campagnes et relation client.',
    ],
    [
        'Finance et Comptabilite',
        'FC',
        Sector.MGMT,
        'Calculator',
        'Comptabilite, audit et analyse financiere.',
    ],
    [
        'Logistique et Transport',
        'LT',
        Sector.MGMT,
        'Truck',
        'Supply chain, transport et operations.',
    ],
    [
        'Tourisme et Hotellerie',
        'TH',
        Sector.MGMT,
        'Hotel',
        'Accueil, tourisme et management hotelier.',
    ],
    [
        'Ressources Humaines',
        'RH',
        Sector.MGMT,
        'Users',
        'Talents, droit social et developpement humain.',
    ],
] as const

async function main() {
    await prisma.download.deleteMany()
    await prisma.favorite.deleteMany()
    await prisma.message.deleteMany()
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

    const students = await Promise.all(
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

    for (let index = 0; index < 12; index += 1) {
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

    await Promise.all(
        students.slice(0, 3).map((student, index) =>
            prisma.message.create({
                data: {
                    content: `Quelqu'un a une fiche de revision pour ${createdFilieres[index].name} ?`,
                    authorId: student.id,
                    filiereId: createdFilieres[index].id,
                },
            }),
        ),
    )
}

main()
    .then(async () => prisma.$disconnect())
    .catch(async (error) => {
        console.error(error)
        await prisma.$disconnect()
        throw error
    })
