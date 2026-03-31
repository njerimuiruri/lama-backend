/**
 * LAMA Platform — Indicator Data Seed Script
 *
 * Reads JSON files from lama-platform/public/documents/
 * and imports them into MongoDB Atlas collections.
 *
 * Run once: npm run seed
 * Safe to re-run — skips any collection that already has data.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not set in .env');
  process.exit(1);
}

// Path to the JSON files in the platform project
const DOCS_PATH = path.join(
  __dirname,
  '../../lama-platform/public/documents',
);

// Dataset definitions: file → collection name
const DATASETS = [
  {
    file: 'ndc.json',
    collection: 'ndcindicators',
    label: 'NDC Indicators',
  },
  {
    file: 'naps.json',
    collection: 'napsindicators',
    label: 'NAPs Indicators',
  },
  {
    file: 'NCCAP.json',
    collection: 'nccapindicators',
    label: 'NCCAP Records',
  },
  {
    file: 'CIDPscleaned.json',
    collection: 'cidpsindicators',
    label: 'CIDPs Records',
  },
  {
    file: 'CountyClimateChangeAdaptationCleaned.json',
    collection: 'ccapindicators',
    label: 'County CCAP Records',
  },
  {
    file: 'lla.json',
    collection: 'llaindicators',
    label: 'LLA Indicators (lla.json)',
  },
  {
    file: 'lla1.json',
    collection: 'lla1indicators',
    label: 'LLA Indicators (lla1.json)',
  },
  {
    file: 'indicators.json',
    collection: 'ggaindicators',
    label: 'GGA / Global Indicators Framework',
  },
  {
    file: 'MergedIndicatorDatabase_NR.json',
    collection: 'globalindicators',
    label: 'Global Merged Indicator Database',
    batchSize: 200, // large file — insert in smaller batches
  },
];

async function seedCollection(db, dataset) {
  const filePath = path.join(DOCS_PATH, dataset.file);

  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP — file not found: ${dataset.file}`);
    return;
  }

  const collection = db.collection(dataset.collection);
  const existingCount = await collection.countDocuments();

  if (existingCount > 0) {
    console.log(
      `  SKIP — ${dataset.label} already has ${existingCount} records`,
    );
    return;
  }

  console.log(`  Reading ${dataset.file}...`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);

  if (!Array.isArray(data) || data.length === 0) {
    console.log(`  SKIP — ${dataset.file} is empty or not an array`);
    return;
  }

  const batchSize = dataset.batchSize || 500;
  let inserted = 0;

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    await collection.insertMany(batch, { ordered: false });
    inserted += batch.length;
    process.stdout.write(
      `\r  Inserting ${dataset.label}... ${inserted}/${data.length}`,
    );
  }

  console.log(`\n  DONE — inserted ${inserted} records into '${dataset.collection}'`);
}

async function main() {
  console.log('\n LAMA Platform — Indicator Seed Script');
  console.log('=======================================\n');

  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.\n');

  const db = mongoose.connection.db;

  for (const dataset of DATASETS) {
    console.log(`[${dataset.label}]`);
    await seedCollection(db, dataset);
    console.log('');
  }

  console.log('=======================================');
  console.log('Seeding complete.\n');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});
