import { loadSheet } from './_utilss.js';

export default async function handler(request, response) {
    try {
        const sheet = await loadSheet();
        
        // 1. Obriši sve postojeće redove
        const rows = await sheet.getRows();
        for (let i = rows.length - 1; i >= 0; i--) {
            await rows[i].delete();
        }
        
        // 2. (Opciono, ali preporučeno) Osiguraj da zaglavlja ostanu
        await sheet.setHeaderRow([
            'Broj Polaska', 
            'Broj Vozila', 
            'Vreme Polaska', 
            'Zamena1', 
            'Zamena2'
        ]);

        console.log("Sheet je uspešno resetovan.");
        response.status(200).json({ message: "Sheet je uspešno resetovan." });
    
    } catch (error) {
        console.error("Greška u run-reset:", error);
        response.status(500).json({ error: error.message });
    }
}
