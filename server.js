// cPanel (Passenger) startup file.
//
// Aplikacija se gradi lokalno sa `npm run build:cpanel`, a na server se
// uploaduje gotov standalone build. Ovaj fajl samo pokreće taj build:
// `.next/standalone/server.js` nosi svoj minimalni node_modules, pa na
// serveru nije potreban `npm install`. Vidi DEPLOY.md.

const fs = require('fs');
const path = require('path');

const standalone = path.join(__dirname, '.next', 'standalone', 'server.js');

if (!fs.existsSync(standalone)) {
  console.error(
    'Nedostaje .next/standalone/server.js - build nije uploadovan.\n' +
      'Pokreni `npm run build:cpanel` lokalno i raspakuj deploy arhivu u root aplikacije.'
  );
  process.exit(1);
}

// Next standalone server bind-uje na HOSTNAME iz env-a. Na shared hostingu su
// i HOSTNAME i HOST postavljeni na ime mašine, na koje se proces ne može
// bind-ovati. Zato se ovde bezuslovno postavlja 0.0.0.0; namerna promena ide kroz BIND_HOST.
process.env.HOSTNAME = process.env.BIND_HOST || '0.0.0.0';

// Passenger dodeljuje PORT kroz env; 3000 je samo za lokalnu proveru builda.
process.env.PORT = process.env.PORT || '3000';

// Node podrazumevano rezerviše ~10 GB virtuelnog adresnog prostora za WebAssembly
// (trap-handler bound checks). CloudLinux/cPanel ograničava adresni prostor procesa
// na 4 GB, pa undici (HTTP klijent koji Next koristi) pukne još na startu sa
// "Cannot allocate Wasm memory for new instance". Flag ukida tu rezervaciju.
const WASM_FLAG = '--disable-wasm-trap-handler';
const hasWasmFlag =
  process.execArgv.includes(WASM_FLAG) ||
  (process.env.NODE_OPTIONS || '').includes(WASM_FLAG);

if (!hasWasmFlag) {
  console.warn(
    `UPOZORENJE: nedostaje ${WASM_FLAG}.\n` +
      'Na cPanel/CloudLinux hostingu će server pasti sa "Cannot allocate Wasm memory".\n' +
      `Rešenje: u Setup Node.js App dodaj NODE_OPTIONS=${WASM_FLAG} --max-old-space-size=512`
  );
}

require(standalone);
