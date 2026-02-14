(function() {
    const currentScript = document.currentScript;
    const siteId = currentScript.getAttribute('data-site-id');
    if (!siteId) return;

    async function capturarTudo() {
        try {
            // 1. Geolocalização (IP, Cidade, País)
            const geoRes = await fetch('http://ip-api.com/json/?fields=status,country,city,query');
            const geoData = await geoRes.json();

            // 2. Extrair dados da URL (Campanha e Keywords)
            const urlParams = new URLSearchParams(window.location.search);
            
            // 3. Identificar Navegador
            const ua = navigator.userAgent;
            let browser = "Outro";
            if(ua.includes("Chrome")) browser = "Chrome";
            else if(ua.includes("Firefox")) browser = "Firefox";
            else if(ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";

            const dados = {
                site_id: siteId,
                ip: geoData.query,
                cidade: geoData.city,
                pais: geoData.country,
                navegador: browser,
                campanha: urlParams.get('utm_campaign') || 'Direto/Orgânico',
                palavras_chave: urlParams.get('utm_term') || urlParams.get('q') || 'Não informada',
                user_agent: ua,
                risk_score: 0, // Sua lógica de risco aqui
                timestamp: new Date().toISOString()
            };

            // 4. Enviar para o Supabase
            await fetch('https://xirrtonafivrphrzufbq.supabase.co/rest/v1/visits', {
                method: 'POST',
                headers: {
                    'apikey': 'sb_publishable_A5R5oMe2Xxks-tMfWcVFnA_yscoQYW9',
                    'Authorization': 'Bearer sb_publishable_A5R5oMe2Xxks-tMfWcVFnA_yscoQYW9',
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(dados)
            });

        } catch (e) { console.error("IPShield Error:", e); }
    }
    capturarTudo();
})();
