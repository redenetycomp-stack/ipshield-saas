// pixel.js
(async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const siteId = new URLSearchParams(document.currentScript.src.split('?')[1]).get('id');
    
    if (!siteId) return console.error("IPShield: ID ausente.");

    // Coleta dados básicos
    const data = {
        site_id: siteId,
        ip: "Carregando...", // O Supabase pode capturar isso via Edge Function ou API externa
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        referência: document.referrer,
        url_atual: window.location.href,
        risk_score: Math.floor(Math.random() * 100) // Simulação de risco para o seu teste
    };

    // Enviar para o seu Supabase
    fetch('https://xirrtonafivrphrzufbq.supabase.co/rest/v1/visits', {
        method: 'POST',
        headers: {
            'apikey': 'sb_publishable_A5R5oMe2Xxks-tMfWcVFnA_yscoQYW9',
            'Authorization': 'Bearer sb_publishable_A5R5oMe2Xxks-tMfWcVFnA_yscoQYW9',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify(data)
    });
})();
