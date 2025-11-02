import fetch from 'node-fetch';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// --- 1. KOMPLETAN RED VOŽNJE ---
// !!! OVDE KOPIRAJTE VAŠE KOMPLETNE MAPE !!!
const timetableMapA = {
"04:05:00": 1,
"04:20:00": 3,
"04:35:00": 8,
"04:50:00": 10,

"05:05:00": 14,
"05:20:00": 17,
"05:33:00": 1,
"05:44:00": 3,
"05:51:00": 5,
"05:57:00": 7,

"06:03:00": 8,
"06:09:00": 9,
"06:15:00": 10,
"06:21:00": 11,
"06:27:00": 12,
"06:33:00": 13,
"06:39:00": 19,
"06:45:00": 14,
"06:51:00": 15,
"06:57:00": 16,

"07:03:00": 17,
"07:09:00": 20,
"07:15:00": 18,
"07:21:00": 1,
"07:27:00": 2,
"07:33:00": 3,
"07:39:00": 4,
"07:45:00": 5,
"07:51:00": 6,
"07:57:00": 7,

"08:03:00": 8,
"08:09:00": 9,
"08:15:00": 10,
"08:21:00": 11,
"08:27:00": 12,
"08:34:00": 13,
"08:37:00": 19,
"08:41:00": 14,
"08:47:00": 15,
"08:54:00": 16,

"09:01:00": 17,
"09:05:00": 20,
"09:08:00": 18,
"09:15:00": 1,
"09:21:00": 2,
"09:28:00": 3,
"09:35:00": 4,
"09:41:00": 5,
"09:48:00": 6,
"09:55:00": 7,

"10:01:00": 8,
"10:08:00": 9,
"10:15:00": 10,
"10:21:00": 11,
"10:28:00": 12,
"10:35:00": 13,
"10:41:00": 14,
"10:48:00": 15,
"10:55:00": 16,

"11:01:00": 17,
"11:08:00": 18,
"11:15:00": 1,
"11:21:00": 2,
"11:28:00": 3,
"11:34:00": 4,
"11:41:00": 5,
"11:47:00": 6,
"11:54:00": 7,

"12:00:00": 8,
"12:07:00": 9,
"12:13:00": 10,
"12:20:00": 11,
"12:26:00": 12,
"12:33:00": 13,
"12:39:00": 14,
"12:46:00": 15,
"12:52:00": 16,
"12:59:00": 20,

"13:05:00": 17,
"13:12:00": 18,
"13:18:00": 19,
"13:25:00": 1,
"13:31:00": 2,
"13:38:00": 3,
"13:44:00": 4,
"13:51:00": 5,
"13:57:00": 6,

"14:04:00": 7,
"14:10:00": 8,
"14:17:00": 9,
"14:23:00": 10,
"14:29:00": 11,
"14:36:00": 12,
"14:42:00": 13,
"14:49:00": 14,
"14:55:00": 15,

"15:02:00": 16,
"15:08:00": 20,
"15:15:00": 17,
"15:21:00": 18,
"15:28:00": 19,
"15:34:00": 1,
"15:41:00": 2,
"15:47:00": 3,
"15:54:00": 4,

"16:00:00": 5,
"16:07:00": 6,
"16:13:00": 7,
"16:20:00": 8,
"16:26:00": 9,
"16:33:00": 10,
"16:39:00": 11,
"16:46:00": 12,
"16:53:00": 13,

"17:00:00": 14,
"17:07:00": 15,
"17:14:00": 16,
"17:15:00": 20,
"17:21:00": 17,
"17:28:00": 18,
"17:33:00": 19,
"17:35:00": 1,
"17:42:00": 2,
"17:49:00": 3,
"17:56:00": 4,

"18:03:00": 5,
"18:10:00": 6,
"18:17:00": 7,
"18:24:00": 8,
"18:31:00": 9,
"18:38:00": 10,
"18:45:00": 11,
"18:52:00": 12,
"18:59:00": 13,

"19:06:00": 14,
"19:13:00": 15,
"19:20:00": 16,
"19:27:00": 17,
"19:28:00": 18,
"19:35:00": 1,
"19:43:00": 2,
"19:51:00": 3,

"20:00:00": 4,
"20:03:00": 5,
"20:08:00": 6,
"20:17:00": 7,
"20:25:00": 8,
"20:30:00": 9,
"20:34:00": 10,
"20:42:00": 11,
"20:49:00": 12,
"20:51:00": 13,
"20:59:00": 14,

"21:08:00": 16,
"21:16:00": 17,
"21:25:00": 1,
"21:34:00": 2,
"21:43:00": 3,
"21:52:00": 4,

"22:01:00": 6,
"22:11:00": 7,
"22:22:00": 8,
"22:24:00": 10,
"22:34:00": 11,
"22:40:00": 13,
"22:47:00": 14,
"22:59:00": 17,

"23:00:00": 16,
"23:15:00": 1,
"23:18:00": 2,
"23:22:00": 3,
"23:31:00": 4,
"23:38:00": 6,
"23:50:00": 7
};
const timetableMapB = {
"04:30:00": 17,
"04:45:00": 1,

"05:00:00": 3,
"05:15:00": 8,
"05:28:00": 10,
"05:36:00": 11,
"05:44:00": 13,
"05:51:00": 14,
"05:58:00": 16,

"06:05:00": 17,
"06:11:00": 18,
"06:17:00": 1,
"06:23:00": 2,
"06:29:00": 3,
"06:35:00": 4,
"06:41:00": 5,
"06:47:00": 6,
"06:53:00": 7,
"06:59:00": 8,

"07:05:00": 9,
"07:11:00": 10,
"07:17:00": 11,
"07:23:00": 12,
"07:29:00": 13,
"07:35:00": 19,
"07:41:00": 14,
"07:47:00": 15,
"07:53:00": 16,
"07:59:00": 17,

"08:05:00": 20,
"08:11:00": 18,
"08:17:00": 1,
"08:23:00": 2,
"08:30:00": 3,
"08:36:00": 4,
"08:43:00": 5,
"08:49:00": 6,
"08:56:00": 7,

"09:02:00": 8,
"09:09:00": 9,
"09:15:00": 10,
"09:22:00": 11,
"09:38:00": 12,
"09:35:00": 13,
"09:41:00": 14,
"09:48:00": 15,
"09:54:00": 16,

"10:01:00": 17,
"10:08:00": 18,
"10:14:00": 1,
"10:21:00": 2,
"10:28:00": 3,
"10:35:00": 4,
"10:42:00": 5,
"10:48:00": 6,
"10:55:00": 7,

"11:02:00": 8,
"11:09:00": 9,
"11:15:00": 10,
"11:22:00": 11,
"11:29:00": 12,
"11:35:00": 13,
"11:42:00": 14,
"11:49:00": 15,
"11:56:00": 16,

"12:02:00": 17,
"12:09:00": 18,
"12:16:00": 1,
"12:22:00": 2,
"12:29:00": 3,
"12:35:00": 4,
"12:42:00": 5,
"12:48:00": 6,
"12:55:00": 7,

"13:02:00": 8,
"13:08:00": 9,
"13:15:00": 10,
"13:21:00": 11,
"13:28:00": 12,
"13:35:00": 13,
"13:41:00": 14,
"13:48:00": 15,
"13:54:00": 16,

"14:01:00": 20,
"14:07:00": 17,
"14:14:00": 18,
"14:20:00": 19,
"14:27:00": 1,
"14:33:00": 2,
"14:40:00": 3,
"14:46:00": 4,
"14:53:00": 5,
"14:59:00": 6,

"15:06:00": 7,
"15:12:00": 8,
"15:19:00": 9,
"15:25:00": 10,
"15:31:00": 11,
"15:38:00": 12,
"15:44:00": 13,
"15:51:00": 14,
"15:57:00": 15,

"16:04:00": 16,
"16:10:00": 20,
"16:17:00": 17,
"16:23:00": 18,
"16:30:00": 19,
"16:36:00": 1,
"16:43:00": 2,
"16:49:00": 3,
"16:56:00": 4,

"17:02:00": 5,
"17:09:00": 6,
"17:16:00": 7,
"17:22:00": 8,
"17:29:00": 9,
"17:35:00": 10,
"17:42:00": 11,
"17:48:00": 12,
"17:55:00": 13,

"18:01:00": 14,
"18:08:00": 15,
"18:14:00": 16,
"18:21:00": 17,
"18:28:00": 18,
"18:35:00": 1,
"18:42:00": 2,
"18:49:00": 3,
"18:56:00": 4,

"19:03:00": 5,
"19:10:00": 6,
"19:17:00": 7,
"19:24:00": 8,
"19:31:00": 9,
"19:38:00": 10,
"19:45:00": 11,
"19:52:00": 12,
"19:59:00": 13,

"20:06:00": 14,
"20:08:00": 15,
"20:13:00": 16,
"20:21:00": 17,
"20:29:00": 1,
"20:38:00": 2,
"20:46:00": 3,
"20:55:00": 4,

"21:03:00": 6,
"21:12:00": 7,
"21:20:00": 8,
"21:29:00": 10,
"21:37:00": 11,
"21:46:00": 13,
"21:54:00": 14,

"22:03:00": 16,
"22:11:00": 17,
"22:20:00": 1,
"22:29:00": 2,
"22:38:00": 3,
"22:47:00": 4,
"22:56:00": 6,

"23:05:00": 7,
"23:15:00": 8,
"23:25:00": 11,
"23:35:00": 14,
"23:45:00": 16,

"00:00:00": 1,
};

// !!! OVDE KOPIRAJTE VAŠU KOMPLETNU LISTU URL-OVA !!!
const URLS = [
    // Smer A: ZVEZDARA 2
    { url: "https://beograd.prometko.si/api/stations/arrivals?station=22389", timetable: timetableMapB },
    { url: "https://beograd.prometko.si/api/stations/arrivals?station=20368", timetable: timetableMapB },
	{ url: "https://beograd.prometko.si/api/stations/arrivals?station=20311", timetable: timetableMapB },
	{ url: "https://beograd.prometko.si/api/stations/arrivals?station=20178", timetable: timetableMapB },
    
    // Smer B: NOVO b. GROBLJE
    { url: "https://beograd.prometko.si/api/stations/arrivals?station=21069", timetable: timetableMapA },
    { url: "https://beograd.prometko.si/api/stations/arrivals?station=20085", timetable: timetableMapA },
    { url: "https://beograd.prometko.si/api/stations/arrivals?station=20369", timetable: timetableMapA },
	{ url: "https://beograd.prometko.si/api/stations/arrivals?station=21123", timetable: timetableMapA },
];
const CLEAN_REGEX = /[^\d:.]/g;

// --- 2. LOGIKA ZA GOOGLE SHEETS ---

// Autentifikacija
const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Popravka za Vercel
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
                .filter((bus) => bus.lc === "65")
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


// --- 4. GLAVNA LOGIKA AŽURIRANJA (NOVA) ---
// Ovu funkciju pozivaju i api/95.js i api/run-update.js

export async function runUpdateAndReturnData() {
    // 1. Povuci sveže podatke sa Prometko API-ja
    const freshBuses = await fetchPrometkoData();
    
    try {
        // 2. Učitaj Google Sheet i sve postojeće redove
        const sheet = await loadSheet();
        const existingRows = await sheet.getRows();

        let rowsToAdd = []; 
        let rowsToUpdate = [];

        // 3. Logika za upoređivanje (samo ako Prometko ima podatke)
        if (freshBuses && freshBuses.length > 0) {
            for (const bus of freshBuses) {
                const block = bus.block;
                const vehicle = bus.vehicle;
                const time = bus.time;

                // Nađi da li polazak (block) već postoji u sheet-u
                const row = existingRows.find(r => r.get('Brojpolaska') == block);

                if (!row) {
                    // SLUČAJ 1: Polazak ne postoji. Dodaj ga.
                    // Proveravamo da li je već u baferu za dodavanje
                    if (!rowsToAdd.find(r => r['Brojpolaska'] == block)) {
                        rowsToAdd.push({
                            'Broj Polaska': block,
                            'Broj Vozila': vehicle,
                            'Vreme Polaska': time,
                        });
                    }
                } else {
                    // SLUČAJ 2: Polazak postoji. Proveri da li je vozilo isto.
                    const mainVehicle = row.get('Vozilo');
                    const zamena1 = row.get('Zamena1');
                    const zamena2 = row.get('Zamena2');

                    // Da li je ovo novo vozilo koje već nismo videli?
                    const isNewVehicle = (vehicle != mainVehicle) && (vehicle != zamena1) && (vehicle != zamena2);

                    if (isNewVehicle) {
                        if (!zamena1) {
                            row.set('Zamena1', vehicle);
                            rowsToUpdate.push(row.save()); // Sačuvaj izmenu
                        } else if (!zamena2) {
                            row.set('Zamena2', vehicle);
                            rowsToUpdate.push(row.save()); // Sačuvaj izmenu
                        }
                    }
                }
            }
        }

        // 4. Snimi izmene u Sheet
        if (rowsToAdd.length > 0) {
            await sheet.addRows(rowsToAdd);
        }
        if (rowsToUpdate.length > 0) {
            await Promise.all(rowsToUpdate);
        }
        
        // 5. Ponovo učitaj sheet da dobiješ 100% sveže podatke
        // (Ovo je neophodno ako su dodati novi redovi)
        const updatedSheet = await loadSheet();
        const finalRows = await updatedSheet.getRows();

        // 6. Formatiraj i VRATI podatke
        const results = finalRows.map(row => ({
            block: row.get('Broj Polaska'),
            vehicle: row.get('Broj Vozila'),
            time: row.get('Vreme Polaska'),
            zamena1: row.get('Zamena1') || null,
            zamena2: row.get('Zamena2') || null,
        }));
        
        // Sortiraj po broju polaska (kao integer)
        results.sort((a, b) => parseInt(a.block) - parseInt(b.block));
        return results;

    } catch (error) {
        console.error("Greška u runUpdateAndReturnData:", error);
        throw error; // Prosledi grešku
    }
}
