import { DocumentType, Niveau, UserStatus } from '@prisma/client'
import { z } from 'zod'

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
    firstName: z.string().min(2).max(60),
    lastName: z.string().min(2).max(60),
    studentNumber: z.string().max(40).optional().or(z.literal('')),
    filiereId: z.string().min(1),
    niveau: z.nativeEnum(Niveau),
    anneeAcademique: z.string().regex(/^\d{4}-\d{4}$/),
    avatarUrl: z.string().url().optional().or(z.literal('')),
})

export const documentQuerySchema = z.object({
    filiere: z.string().optional(),
    type: z.nativeEnum(DocumentType).optional(),
    niveau: z.nativeEnum(Niveau).optional(),
    annee: z.string().optional(),
    q: z.string().optional(),
    sort: z.enum(['recent', 'popular', 'title']).default('recent'),
    page: z.coerce.number().int().min(1).default(1),
})

export const studentStatusSchema = z.object({
    status: z.nativeEnum(UserStatus),
})

export const documentMetaSchema = z.object({
    title: z.string().min(3).max(160),
    description: z.string().min(3).max(1000),
    filiereId: z.string().min(1),
    type: z.nativeEnum(DocumentType),
    niveau: z.nativeEnum(Niveau),
    anneeAcademique: z.string().regex(/^\d{4}-\d{4}$/),
    matiere: z.string().min(2).max(120),
    fileName: z.string().min(1),
    fileType: z.string().min(1),
    fileSize: z.coerce.number().int().positive(),
    blobUrl: z.string().url().optional(),
    uploadId: z.string().min(1).optional(),
    chunkIndex: z.coerce.number().int().min(0).optional(),
    totalChunks: z.coerce.number().int().min(1).optional(),
})
