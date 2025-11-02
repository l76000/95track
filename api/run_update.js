import { loadSheet, fetchPrometkoData } from './_utils.js';

export default async function handler(request, response) {
    // 1. Povuci sveže podatke sa Prometko API-ja
    const freshBuses = await fetchPrometkoData();
    if (!freshBuses || freshBuses.length === 0) {
        return response.status(200).json({ message: "Nema svežih podataka sa Prometka." });
    }

    try {
        // 2. Učitaj Google Sheet i sve postojeće redove
        const sheet = await loadSheet();
        const existingRows = await sheet.getRows();

        let rowsToAdd = []; // Bafer za nove redove
        let rowsToUpdate = []; // Bafer za ažuriranje

        // 3. Logika za upoređivanje (srce sistema)
        for (const bus of freshBuses) {
            const block = bus.block;
            const vehicle = bus.vehicle;
            const time = bus.time;

            // Nađi da li polazak (block) već postoji u sheet-u
            const row = existingRows.find(r => r.get('Broj polaska') == block);

            if (!row) {
                // SLUČAJ 1: Polazak ne postoji. Dodaj ga.
                // Proveravamo da li je već u baferu za dodavanje
                if (!rowsToAdd.find(r => r['Broj polaska'] == block)) {
                    rowsToAdd.push({
                        'Broj polaska': block,
                        'Vozilo': vehicle,
                        'Vreme polaska': time,
                    });
                }
            } else {
                // SLUČAJ 2: Polazak postoji. Proveri da li je vozilo isto.
                const mainVehicle = row.get('Vozilo');
                const zamena1 = row.get('Zamena 1');
                const zamena2 = row.get('Zamena 2');

                // Da li je ovo novo vozilo koje već nismo videli?
                const isNewVehicle = (vehicle != mainVehicle) && (vehicle != zamena1) && (vehicle != zamena2);

                if (isNewVehicle) {
                    if (!zamena1) {
                        row.set('Zamena 1', vehicle);
                        rowsToUpdate.push(row.save()); // Sačuvaj izmenu
                    } else if (!zamena2) {
                        row.set('Zamena 2', vehicle);
                        rowsToUpdate.push(row.save()); // Sačuvaj izmenu
                    }
                    // Ako su i zamena 1 i 2 popunjene, ignorišemo (po vašem zahtevu)
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
        
        response.status(200).json({ 
            message: `Update završen. Dodato: ${rowsToAdd.length}, Ažurirano: ${rowsToUpdate.length}` 
        });
    
    } catch (error) {
        console.error("Greška u run-update:", error);
        response.status(500).json({ error: error.message });
    }
}
