import { del } from '@vercel/blob'
import fs from 'node:fs/promises'
import path from 'node:path'

const maxUploadSize =
    Number(process.env.MAX_UPLOAD_SIZE_MB ?? 500) * 1024 * 1024

export function uploadsRoot() {
    return path.resolve(process.cwd(), process.env.UPLOAD_DIR ?? 'uploads')
}

export function isRemoteFilePath(filePath: string) {
    return /^https?:\/\//i.test(filePath)
}

export function remoteBlobPath(filePath: string) {
    try {
        return new URL(filePath).pathname
    } catch {
        return filePath
    }
}

export async function saveSingleFile(file: File, fileName: string) {
    if (file.size > maxUploadSize) throw new Error('Fichier trop volumineux.')
    await fs.mkdir(uploadsRoot(), { recursive: true })
    const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '-')}`
    const relativePath = path.join('uploads', safeName)
    const bytes = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(path.join(process.cwd(), relativePath), bytes)
    return relativePath
}

export async function saveChunk(
    uploadId: string,
    chunkIndex: number,
    chunk: File,
) {
    const chunkDir = path.join(uploadsRoot(), '.chunks', uploadId)
    await fs.mkdir(chunkDir, { recursive: true })
    await fs.writeFile(
        path.join(chunkDir, `${chunkIndex}`),
        Buffer.from(await chunk.arrayBuffer()),
    )
}

export async function assembleChunks(
    uploadId: string,
    totalChunks: number,
    fileName: string,
) {
    await fs.mkdir(uploadsRoot(), { recursive: true })
    const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '-')}`
    const relativePath = path.join('uploads', safeName)
    const output = await fs.open(path.join(process.cwd(), relativePath), 'w')
    try {
        for (let index = 0; index < totalChunks; index += 1) {
            const chunkPath = path.join(
                uploadsRoot(),
                '.chunks',
                uploadId,
                `${index}`,
            )
            const data = await fs.readFile(chunkPath)
            await output.write(data)
        }
    } finally {
        await output.close()
    }
    await fs.rm(path.join(uploadsRoot(), '.chunks', uploadId), {
        recursive: true,
        force: true,
    })
    return relativePath
}

export async function deleteStoredFile(filePath: string) {
    if (isRemoteFilePath(filePath)) {
        if (!process.env.BLOB_READ_WRITE_TOKEN) return
        await del(remoteBlobPath(filePath), {
            token: process.env.BLOB_READ_WRITE_TOKEN,
        })
        return
    }

    await fs.rm(path.join(process.cwd(), filePath), { force: true })
}
