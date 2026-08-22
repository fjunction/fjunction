/**
 * migrate-images.js
 *
 * Uploads local image folders into a single Supabase Storage bucket,
 * preserving the folder name as a path prefix — so a local file at
 * ./migration/blog_images/paneer.jpg lands in the bucket at
 * blog_images/paneer.jpg, matching the path already stored in your DB
 * (people/foods/exercises tables etc).
 *
 * Setup:
 *   npm install @supabase/supabase-js dotenv
 *
 * .env file (same folder as this script):
 *   SUPABASE_URL=https://<your-project>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=<service role key, NOT the anon key>
 *
 * Run:
 *   node migrate-images.js
 *
 * Before running: create a bucket named "images" in the Supabase
 * dashboard (Storage > New bucket) and mark it Public if these images
 * should be viewable without auth (typical for food/exercise photos).
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs/promises');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'images';

// Local folder name -> becomes the path prefix inside the bucket.
// Add/remove entries here if you have more folders to migrate later.
const FOLDERS = ['blog_images', 'workout_images'];

const LOCAL_ROOT = path.join(__dirname, 'migration');
const CONCURRENCY = 5; // parallel uploads; raise/lower if needed
const MAX_RETRIES = 3;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function guessContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const map = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  };
  return map[ext] || 'application/octet-stream';
}

function sanitizeFilename(filename) {
  // Supabase Storage rejects "~" (and some other characters) in object keys.
  // Replace with "-" and keep a record so DB paths can be updated to match.
  return filename.replace(/~/g, '-');
}

async function uploadOne(localFolder, filename, results) {
  const localPath = path.join(LOCAL_ROOT, localFolder, filename);
  const safeFilename = sanitizeFilename(filename);
  const remotePath = `${localFolder}/${safeFilename}`; // matches existing DB paths (after any rename below)
  const originalDbPath = `${localFolder}/${filename}`;

  if (safeFilename !== filename) {
    results.renamed.push({ originalPath: originalDbPath, newPath: remotePath });
  }

  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const fileBuffer = await fs.readFile(localPath);
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(remotePath, fileBuffer, {
          contentType: guessContentType(filename),
          upsert: true, // safe to re-run; overwrites if already uploaded
        });

      if (error) throw error;

      results.succeeded.push(remotePath);
      console.log(`OK   ${remotePath}`);
      return;
    } catch (err) {
      lastError = err;
      console.warn(`retry ${attempt}/${MAX_RETRIES} failed for ${remotePath}: ${err.message}`);
    }
  }
  results.failed.push({ path: remotePath, error: lastError?.message });
  console.error(`FAIL ${remotePath}: ${lastError?.message}`);
}

// simple concurrency-limited runner (no extra dependency needed)
async function runWithConcurrency(items, worker, limit) {
  const queue = [...items];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) {
      const item = queue.shift();
      if (item) await worker(item);
    }
  });
  await Promise.all(workers);
}

async function migrateFolder(folder, results) {
  const dirPath = path.join(LOCAL_ROOT, folder);
  let files;
  try {
    files = (await fs.readdir(dirPath)).filter((f) => !f.startsWith('.'));
  } catch (err) {
    console.error(`Cannot read folder ${dirPath}: ${err.message}`);
    return;
  }

  console.log(`\n--- ${folder}: ${files.length} files ---`);
  await runWithConcurrency(
    files,
    (filename) => uploadOne(folder, filename, results),
    CONCURRENCY
  );
}

async function main() {
  const results = { succeeded: [], failed: [], renamed: [] };

  for (const folder of FOLDERS) {
    await migrateFolder(folder, results);
  }

  console.log('\n=== Summary ===');
  console.log(`Succeeded: ${results.succeeded.length}`);
  console.log(`Failed:    ${results.failed.length}`);
  console.log(`Renamed:   ${results.renamed.length}`);

  if (results.failed.length) {
    const logPath = path.join(__dirname, 'migration-failures.json');
    await fs.writeFile(logPath, JSON.stringify(results.failed, null, 2));
    console.log(`Failure details written to ${logPath} — re-run the script to retry (upsert is on, so it's safe).`);
  }

  if (results.renamed.length) {
    const renamedPath = path.join(__dirname, 'migration-renamed.json');
    await fs.writeFile(renamedPath, JSON.stringify(results.renamed, null, 2));
    console.log(`Renamed files (originalPath -> newPath) written to ${renamedPath} — use this to update DB rows so image paths still resolve.`);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});