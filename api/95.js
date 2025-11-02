import { loadSheet } from './_utils.js';

export default async function handler(request, response) {
    try {
        // 1. Učitaj Sheet i sve redove
        const sheet = await loadSheet();
        const rows = await sheet.getRows();

        // 2. Pretvori podatke u JSON format koji tvoj frontend očekuje
        const results = rows.map(row => ({
            block: row.get('Broj polaska'),
            vehicle: row.get('Vozilo'),
            time: row.get('Vreme polaska'),
            zamena1: row.get('Zamena 1') || null, // Vrati null ako je prazno
            zamena2: row.get('Zamena 2') || null,
        }));

        // 3. Sortiraj po broju polaska
        results.sort((a, b) => a.block - b.block);

        // 4. Pošalji odgovor
        // Keširamo odgovor na 1 minut (kao i pre)
        response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
        
        response.status(200).json({
            lastUpdated: new Date().toISOString(), // Vreme kada je sajt povukao podatke
            results: results
        });
    
    } catch (error) {
        console.error("Greška u api/95:", error);
        response.status(500).json({ error: "Greška pri čitanju iz Google Sheet-a." });
    }
}
