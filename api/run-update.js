import { runUpdateAndReturnData } from './_utils.js';

export default async function handler(request, response) {
    try {
        // Pokreni logiku ažuriranja
        await runUpdateAndReturnData();
        
        console.log("Cron update je uspešno završen.");
        response.status(200).json({ message: "Cron update završen." });
    
    } catch (error) {
        console.error("Greška u run-update cron-u:", error);
        response.status(500).json({ error: error.message });
    }
}
