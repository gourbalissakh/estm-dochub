import {
    DocumentType,
    Niveau,
    PrismaClient,
    Role,
    Sector,
    UserStatus,
} from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'node:fs/promises'
import path from 'node:path'

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

const samplePdf = `%PDF-1.4
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
<< /Length 73 >>
stream
BT
/F1 18 Tf
72 720 Td
(ESTM DocHub - document de demonstration) Tj
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
0000000364 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
434
%%EOF`

async function main() {
    await fs.mkdir(path.join(process.cwd(), 'uploads'), { recursive: true })

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
        const fileName = `sample-${filiere.code.toLowerCase()}.pdf`
        const filePath = path.join('uploads', fileName)
        await fs.writeFile(path.join(process.cwd(), filePath), samplePdf)
        await prisma.document.create({
            data: {
                title: `${['Cours', 'Ancien sujet', 'TP', 'TD'][index % 4]} ${filiere.code}`,
                description: `Ressource academique de demonstration pour ${filiere.name}.`,
                filePath,
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
        process.exit(1)
    })
