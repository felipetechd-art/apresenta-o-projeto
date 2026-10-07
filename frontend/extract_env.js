const fs = require('fs');
const path = require('path');

const envFiles = ['.env', '.env.local', '.env.development', '.env.production', '.env.example'];

envFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`\n--- Arquivo encontrado: ${file} ---`);
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (['VITE_ENABLE_NEW_GOVERNANCE_PANEL', 'VITE_ENABLE_LEGACY_GOVERNANCE_FALLBACK', 'VITE_ENABLE_AUTH', 'VITE_ENABLE_FIRESTORE_REPOSITORY', 'VITE_USE_FIREBASE_EMULATORS', 'VITE_FIREBASE_PROJECT_ID'].includes(key)) {
          console.log(`${key}=${value}`);
        } else {
          console.log(`${key}=<redacted>`);
        }
      }
    });
  } else {
    console.log(`\n--- Arquivo não encontrado: ${file} ---`);
  }
});
