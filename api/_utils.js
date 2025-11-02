import fetch from 'node-fetch';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// --- 1. KOMPLETAN RED VOŽNJE (Vaši podaci) ---
const timetableMapA = { "04:45:00": 24, /* ... SVI VAŠI PODACI ... */ };
const timetableMapB = { "04:00:00": 1, /* ... SVI VAŠI PODACI ... */ };
// NAPOMENA: Skratio sam red vožnje ovde radi preglednosti.
// Kopirajte vaše pune timetableMapA i timetableMapB objekte ovde.

const URLS = [
    { url: "https://beograd.prometko.si/api/stations/arrivals?station=21238", timetable: timetableMapA },
    { url: "https://beograd.prometko.si/api/stations/arrivals?station=21260", timetable: timetableMapA },
    // ... SVE VAŠE URL ADRESE ...
    { url: "https://beograd.prometko.si/api/stations/arrivals?station=21255", timetable: timetableMapB },
];
const CLEAN_REGEX = /[^\d:.]/g;

// --- 2. LOGIKA ZA GOOGLE SHEETS ---

// Autentifikacija
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Važno za Vercel
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

// Funkcija za učitavanje Sheeta
export async function loadSheet() {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  return doc.sheetsByIndex[0]; // Vraća prvi (i jedini) sheet
}

// --- 3. LOGIKA ZA PROMETKO API ---

// Funkcija koja povlači sve podatke sa Prometko
export async function fetchPrometkoData() {
    let allResults = [];
    
    for (const { url, timetable } of URLS) {
        try {
            const apiResponse = await fetch(url);
            if (!apiResponse.ok) continue;
            
            const data = await apiResponse.json();
            const arrivals = data.data && data.data.arrivals ? data.data.arrivals : null;
            if (!arrivals || arrivals.length === 0) continue;

            arrivals
                .filter((bus) => bus.lc === "95")
                .forEach((bus) => {
                    const vehicleId = bus.i;
                    let apiTime = bus.dt;
                    if (!apiTime) return;

                    apiTime = apiTime.trim().replace(CLEAN_REGEX, '');
                    if (apiTime.includes('.')) apiTime = apiTime.split('.')[0];
                    if (apiTime.length === 5 && apiTime.includes(':')) apiTime = apiTime + ":00";
                    
                    const blockNumber = timetable[apiTime];

                    if (blockNumber) {
                        allResults.push({
                            time: apiTime,
                            block: blockNumber,
                            vehicle: vehicleId,
                        });
                    }
                });
        } catch (error) {
            console.error(`Greška pri dohvatanju ${url}:`, error.message);
        }
    }

    // Filtriranje
    const uniqueResults = allResults.filter((item, index, self) =>
        index === self.findIndex((t) => (t.block === item.block && t.vehicle === item.vehicle))
    );
    
    return uniqueResults;
}
