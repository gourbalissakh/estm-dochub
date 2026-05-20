import { PrismaClient, Sector } from '@prisma/client'

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

    void createdFilieres
}

main()
    .then(async () => prisma.$disconnect())
    .catch(async (error) => {
        console.error(error)
        await prisma.$disconnect()
        throw error
    })
