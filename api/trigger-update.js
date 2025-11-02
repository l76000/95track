// Uvozimo samo glavnu logiku za ažuriranje
import { runUpdateAndReturnData } from './_utils.js';

export default async function handler(request, response) {
    try {
        // Postavite Cors headere za Domain B (ZAMENITE SA STVARNIM DOMENOM B)
        response.setHeader('Access-Control-Allow-Origin', 'https://pratilaclinija.neocities.org/'); 
        response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Odgovorite na OPTIONS zahtev (preflight) odmah
        if (request.method === 'OPTIONS') {
            return response.status(200).end();
        }

        // 1. Pokreni ažuriranje. Koristimo runUpdateAndReturnData ali ignorišemo rezultat.
        // NEMA await-a! Cilj je da se brzo pošalje odgovor klijentu,
        // dok se dugačka operacija ažuriranja i dalje radi u pozadini.
        runUpdateAndReturnData().catch(e => {
            // Logujte grešku, ali ne prekidajte brzi odgovor klijentu
            console.error("Asinhrono ažuriranje nije uspelo:", e);
        });

        // 2. Pošaljite BRZ odgovor na Domenu B
        response.status(202).json({ 
            message: "Ažuriranje je započeto u pozadini." 
        });

    } catch (error) {
        console.error("Greška pri pokretanju ažuriranja:", error);
        // Čak i ako ovde greška pukne, vraćamo brzi odgovor
        response.status(500).json({ error: "Greška servera pri pokretanju ažuriranja." });
    }
}
