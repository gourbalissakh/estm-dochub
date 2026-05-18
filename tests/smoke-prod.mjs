// Comprehensive smoke test against production
// Tests: public routes, auth, upload (Blob), download, preview, favorites, admin
// Usage: node tests/smoke-prod.mjs
import { writeFileSync, readFileSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BASE = 'https://estm-dochub-2026.vercel.app'
const ADMIN = { email: 'admin@estm.sn', password: 'Admin123!' }
const STUDENT = { email: 'etudiant1@estm.sn', password: 'Student123!' }

const results = []
let passed = 0
let failed = 0

function record(name, ok, details = '') {
    results.push({ name, ok, details })
    if (ok) {
        passed++
        console.log(`✓ ${name}` + (details ? ` — ${details}` : ''))
    } else {
        failed++
        console.log(`✗ ${name} — ${details}`)
    }
}

// --- Helpers ----------------------------------------------------------------
function parseCookies(setCookieHeaders) {
    const jar = {}
    for (const raw of setCookieHeaders) {
        const [pair] = raw.split(';')
        const [name, ...rest] = pair.split('=')
        if (!name) continue
        jar[name.trim()] = rest.join('=').trim()
    }
    return jar
}

function cookieHeader(jar) {
    return Object.entries(jar)
        .map(([k, v]) => `${k}=${v}`)
        .join('; ')
}

function mergeCookies(jar, setCookieHeaders) {
    const fresh = parseCookies(setCookieHeaders)
    return { ...jar, ...fresh }
}

async function rawFetch(url, options = {}, jar = {}) {
    const res = await fetch(url, {
        ...options,
        redirect: 'manual',
        headers: {
            ...(options.headers || {}),
            ...(Object.keys(jar).length
                ? { cookie: cookieHeader(jar) }
                : {}),
        },
    })
    const setCookie = res.headers.getSetCookie?.() ?? []
    const next = setCookie.length ? mergeCookies(jar, setCookie) : jar
    return { res, jar: next }
}

async function login(creds) {
    // 1. Get the CSRF token
    let { res, jar } = await rawFetch(`${BASE}/api/auth/csrf`)
    if (!res.ok) throw new Error(`csrf endpoint: ${res.status}`)
    const { csrfToken } = await res.json()

    // 2. POST credentials
    const body = new URLSearchParams({
        email: creds.email,
        password: creds.password,
        csrfToken,
        json: 'true',
    })
    ;({ res, jar } = await rawFetch(
        `${BASE}/api/auth/callback/credentials`,
        {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        },
        jar,
    ))

    // NextAuth returns 302 on success, redirecting to /login?error=... on failure
    const location = res.headers.get('location') || ''
    if (location.includes('error=')) {
        throw new Error(`login failed: ${location}`)
    }

    // 3. Verify session
    ;({ res, jar } = await rawFetch(`${BASE}/api/auth/session`, {}, jar))
    if (!res.ok) throw new Error(`session check: ${res.status}`)
    const session = await res.json()
    if (!session?.user) throw new Error('no user in session')
    return { jar, session }
}

function buildPdf(title) {
    // Tiny valid PDF
    return Buffer.from(
        `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n` +
            `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n` +
            `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] ` +
            `/Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n` +
            `4 0 obj\n<< /Length 46 >>\nstream\nBT /F1 18 Tf 72 720 Td (${title}) Tj ET\nendstream\nendobj\n` +
            `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n` +
            `xref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000241 00000 n \n0000000338 00000 n \n` +
            `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n408\n%%EOF`,
        'utf-8',
    )
}

// --- Tests ------------------------------------------------------------------
async function testPublicRoutes() {
    console.log('\n=== Public routes ===')
    const routes = [
        ['/', 200],
        ['/filieres', 200],
        ['/documents', 200],
        ['/login', 200],
        ['/register', 200],
        ['/messages', 404],
        ['/admin/messages', 307],
        ['/api/filieres', 200],
        ['/api/documents', 200],
        ['/api/messages', 404],
        ['/api/auth/csrf', 200],
        ['/api/auth/session', 200],
    ]
    for (const [path, expected] of routes) {
        const { res } = await rawFetch(`${BASE}${path}`)
        record(
            `${path}`,
            res.status === expected,
            `HTTP ${res.status} (expected ${expected})`,
        )
    }
}

async function testRegisterValidation() {
    console.log('\n=== Register validation ===')

    // Invalid: weak password
    let res = await fetch(`${BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            email: 'smoke@test.com',
            password: 'weak',
            firstName: 'Test',
            lastName: 'User',
            filiereId: 'whatever',
            niveau: 'L1',
            anneeAcademique: '2025-2026',
        }),
    })
    record(
        'Register rejects weak password',
        res.status === 400,
        `HTTP ${res.status}`,
    )

    // Invalid: bad email
    res = await fetch(`${BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            email: 'not-an-email',
            password: 'Strong123',
            firstName: 'Test',
            lastName: 'User',
            filiereId: 'x',
            niveau: 'L1',
            anneeAcademique: '2025-2026',
        }),
    })
    record(
        'Register rejects invalid email',
        res.status === 400,
        `HTTP ${res.status}`,
    )
}

async function testLogin() {
    console.log('\n=== Authentication ===')

    // Admin login
    try {
        const { session } = await login(ADMIN)
        record(
            'Admin login',
            session.user.role === 'ADMIN',
            `role=${session.user.role}, status=${session.user.status}`,
        )
        return { adminSession: session }
    } catch (e) {
        record('Admin login', false, e.message)
        throw e
    }
}

async function testStudentLogin() {
    try {
        const { jar, session } = await login(STUDENT)
        record(
            'Student login',
            session.user.role === 'STUDENT',
            `role=${session.user.role}, status=${session.user.status}`,
        )
        return { jar, session }
    } catch (e) {
        record('Student login', false, e.message)
        return null
    }
}

async function testUploadFlow(adminJar) {
    console.log('\n=== Upload flow (admin) ===')

    // 1. Get a filiere
    const fRes = await fetch(`${BASE}/api/filieres`)
    const { filieres } = await fRes.json()
    const filiere = filieres.find((f) => f.code === 'GLR') || filieres[0]
    record(
        'Filieres list available',
        filieres.length >= 13,
        `${filieres.length} filieres found`,
    )

    // 2. Get a Blob token
    const title = `SmokeTest ${Date.now()}`
    const pdfBuffer = buildPdf(title)
    const fileName = `smoke-${Date.now()}.pdf`

    let { res } = await rawFetch(
        `${BASE}/api/uploads/documents`,
        {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                type: 'blob.generate-client-token',
                payload: {
                    pathname: fileName,
                    callbackUrl: `${BASE}/api/uploads/documents`,
                    clientPayload: null,
                    multipart: false,
                },
            }),
        },
        adminJar,
    )
    record(
        'Get Blob client token',
        res.status === 200,
        `HTTP ${res.status}`,
    )
    if (res.status !== 200) {
        const txt = await res.text()
        console.log('  Body:', txt.slice(0, 200))
        return null
    }
    const tokenPayload = await res.json()
    const clientToken = tokenPayload.clientToken
    if (!clientToken) {
        record('Token contains clientToken', false, JSON.stringify(tokenPayload))
        return null
    }

    // 3. Upload the file directly to Vercel Blob using the client token
    // The clientToken is a JWT that authorizes the upload
    const blobRes = await fetch(
        `https://blob.vercel-storage.com/${encodeURIComponent(fileName)}?` +
            new URLSearchParams({
                'add-random-suffix': '1',
            }),
        {
            method: 'PUT',
            headers: {
                authorization: `Bearer ${clientToken}`,
                'content-type': 'application/pdf',
                'x-content-type': 'application/pdf',
            },
            body: pdfBuffer,
        },
    )
    record(
        'Direct upload to Vercel Blob',
        blobRes.ok,
        `HTTP ${blobRes.status}`,
    )
    if (!blobRes.ok) {
        const txt = await blobRes.text()
        console.log('  Body:', txt.slice(0, 200))
        return null
    }
    const blobInfo = await blobRes.json()
    const blobUrl = blobInfo.url

    // 4. Create the document record
    ;({ res } = await rawFetch(
        `${BASE}/api/documents`,
        {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                title,
                description: 'Document de test smoke automatise.',
                filiereId: filiere.id,
                type: 'COURS',
                niveau: 'L1',
                anneeAcademique: '2025-2026',
                matiere: 'Smoke Testing',
                fileName,
                fileType: 'application/pdf',
                fileSize: String(pdfBuffer.length),
                blobUrl,
            }),
        },
        adminJar,
    ))
    record(
        'Create document record',
        res.status === 201,
        `HTTP ${res.status}`,
    )
    if (res.status !== 201) {
        const txt = await res.text()
        console.log('  Body:', txt.slice(0, 200))
        return null
    }
    const { document } = await res.json()

    return { document, blobUrl }
}

async function testDownloadAndPreview(documentId, adminJar) {
    console.log('\n=== Download & preview ===')

    let { res } = await rawFetch(
        `${BASE}/api/documents/${documentId}/preview`,
        {},
        adminJar,
    )
    record(
        'Preview document',
        res.status === 200 || res.status === 302,
        `HTTP ${res.status}, type=${res.headers.get('content-type')?.slice(0, 50)}`,
    )

    ;({ res } = await rawFetch(
        `${BASE}/api/documents/${documentId}/download`,
        {},
        adminJar,
    ))
    record(
        'Download document',
        res.status === 200,
        `HTTP ${res.status}, type=${res.headers.get('content-type')}`,
    )
}

async function testFavorite(documentId, studentJar) {
    if (!studentJar) return
    console.log('\n=== Favorites (student) ===')

    let { res } = await rawFetch(
        `${BASE}/api/favorites/${documentId}`,
        { method: 'POST' },
        studentJar,
    )
    record(
        'Toggle favorite ON',
        res.status === 200 || res.status === 201,
        `HTTP ${res.status}`,
    )

    ;({ res } = await rawFetch(
        `${BASE}/api/favorites/${documentId}`,
        { method: 'POST' },
        studentJar,
    ))
    record(
        'Toggle favorite OFF',
        res.status === 200 || res.status === 201,
        `HTTP ${res.status}`,
    )
}

async function testAdminEndpoints(adminJar) {
    console.log('\n=== Admin endpoints ===')

    let { res } = await rawFetch(
        `${BASE}/api/admin/stats`,
        {},
        adminJar,
    )
    record(
        'GET /api/admin/stats',
        res.status === 200,
        `HTTP ${res.status}`,
    )
    if (res.status === 200) {
        const json = await res.json()
        const hasNoMessages = !('messages' in (json.kpis || {}))
        record(
            'Admin stats has no "messages" key',
            hasNoMessages,
            `keys: ${Object.keys(json.kpis || {}).join(',')}`,
        )
    }

    ;({ res } = await rawFetch(
        `${BASE}/api/admin/students`,
        {},
        adminJar,
    ))
    record(
        'GET /api/admin/students',
        res.status === 200,
        `HTTP ${res.status}`,
    )

    ;({ res } = await rawFetch(
        `${BASE}/api/admin/activity`,
        {},
        adminJar,
    ))
    record(
        'GET /api/admin/activity',
        res.status === 200,
        `HTTP ${res.status}`,
    )
}

async function testToggleVisibility(documentId, adminJar) {
    console.log('\n=== Admin moderation ===')

    let { res } = await rawFetch(
        `${BASE}/api/documents/${documentId}`,
        {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ isVisible: false }),
        },
        adminJar,
    )
    record(
        'PATCH document visibility (hide)',
        res.status === 200,
        `HTTP ${res.status}`,
    )

    ;({ res } = await rawFetch(
        `${BASE}/api/documents/${documentId}`,
        {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ isVisible: true }),
        },
        adminJar,
    ))
    record(
        'PATCH document visibility (show)',
        res.status === 200,
        `HTTP ${res.status}`,
    )
}

async function cleanup(documentId, adminJar) {
    console.log('\n=== Cleanup ===')
    const { res } = await rawFetch(
        `${BASE}/api/documents/${documentId}`,
        { method: 'DELETE' },
        adminJar,
    )
    record(
        'DELETE test document',
        res.status === 200 || res.status === 204,
        `HTTP ${res.status}`,
    )
}

// --- Main -------------------------------------------------------------------
async function main() {
    await testPublicRoutes()
    await testRegisterValidation()

    const { adminSession } = await testLogin()
    const adminJar = (await login(ADMIN)).jar
    const studentResult = await testStudentLogin()
    const studentJar = studentResult?.jar

    const uploadResult = await testUploadFlow(adminJar)

    if (uploadResult) {
        await testDownloadAndPreview(uploadResult.document.id, adminJar)
        await testFavorite(uploadResult.document.id, studentJar)
        await testToggleVisibility(uploadResult.document.id, adminJar)
        await cleanup(uploadResult.document.id, adminJar)
    }

    await testAdminEndpoints(adminJar)

    console.log('\n' + '='.repeat(60))
    console.log(`RESULTS: ${passed} passed, ${failed} failed`)
    console.log('='.repeat(60))
    if (failed > 0) {
        console.log('\nFailed tests:')
        results.filter((r) => !r.ok).forEach((r) => {
            console.log(`  ✗ ${r.name} — ${r.details}`)
        })
        process.exit(1)
    }
}

main().catch((e) => {
    console.error('Fatal:', e)
    process.exit(1)
})
