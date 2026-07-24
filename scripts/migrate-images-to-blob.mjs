// One-off migration of gallery photos from the public S3 bucket to the
// project's Vercel Blob store (issue #356). Idempotent: photos already in
// the store are skipped, so it can be re-run after a partial failure.
//
// Usage: node --env-file=.env.local scripts/migrate-images-to-blob.mjs
// (needs BLOB_READ_WRITE_TOKEN; deliberately avoids the AWS SDK so it
// keeps working now that the app has no AWS dependency)

import { list, put } from "@vercel/blob";

const S3_URL = "https://the-maggie-zone-images.s3.eu-west-1.amazonaws.com";

async function listS3Keys() {
    const keys = [];
    let token;
    do {
        const url = new URL(S3_URL);
        url.searchParams.set("list-type", "2");
        if (token) {
            url.searchParams.set("continuation-token", token);
        }
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`S3 list failed: ${response.status}`);
        }
        const xml = await response.text();
        for (const [, key] of xml.matchAll(/<Key>([^<]+)<\/Key>/g)) {
            if (!key.endsWith("/")) {
                keys.push(key);
            }
        }
        token = xml.match(/<NextContinuationToken>([^<]+)<\/NextContinuationToken>/)?.[1];
    } while (token);
    return keys;
}

async function listBlobPathnames() {
    const pathnames = new Set();
    let cursor;
    do {
        const page = await list({ cursor });
        for (const blob of page.blobs) {
            pathnames.add(blob.pathname);
        }
        cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return pathnames;
}

const s3Keys = await listS3Keys();
const existing = await listBlobPathnames();
console.log(`S3 objects: ${s3Keys.length}, already in Blob store: ${existing.size}`);

let copied = 0;
let skipped = 0;
const failed = [];
for (const key of s3Keys) {
    if (existing.has(key)) {
        skipped++;
        continue;
    }
    try {
        const response = await fetch(`${S3_URL}/${encodeURI(key)}`);
        if (!response.ok) {
            throw new Error(`fetch failed: ${response.status}`);
        }
        const body = Buffer.from(await response.arrayBuffer());
        await put(key, body, {
            access: "public",
            addRandomSuffix: false,
            contentType: response.headers.get("content-type") ?? undefined,
        });
        copied++;
        console.log(`copied ${key} (${(body.length / 1024).toFixed(0)} KiB)`);
    } catch (error) {
        failed.push(key);
        console.error(`FAILED ${key}:`, error.message);
    }
}

console.log(`\nDone: ${copied} copied, ${skipped} skipped, ${failed.length} failed`);
const finalCount = (await listBlobPathnames()).size;
console.log(`Blob store now holds ${finalCount} blobs (S3 has ${s3Keys.length})`);
if (failed.length > 0) {
    process.exit(1);
}
