import { runUpdateAndReturnData } from './_utilss.js';

export default async function handler(request, response) {
    try {
        // 1. Pokreni kompletnu logiku (Fetch, Compare, Write)
        // I SAČEKAJ REZULTATE. Ovo je spor korak.
        const results = await runUpdateAndReturnData();

        // 2. Pošalji sveže rezultate pregledaču
        // (Keširanje je i dalje dobra ideja da smanji opterećenje)
        response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
        
        response.status(200).json({
            lastUpdated: new Date().toISOString(),
            results: results
        });
    
    } catch (error) {
        console.error("Greška u api/65:", error);
        response.status(500).json({ error: "Greška pri ažuriranju i čitanju podataka." });
    }
}
