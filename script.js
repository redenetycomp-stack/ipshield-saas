(function() {
    // Identifica o ID do cliente através do atributo 'data-site-id' na tag script
    const currentScript = document.currentScript;
    const siteId = currentScript.getAttribute('data-site-id');

    if (!siteId) {
        console.error("IPShield: ID do site não configurado.");
        return;
    }

    // Configurações do seu Supabase
    const supabaseUrl = 'https://xirrtonafivrphrzufbq.supabase.co';
    const supabaseKey = 'sb_publishable_A5R5oMe2Xxks-tMfWcVFnA_yscoQYW9';

    async function coletarDados() {
        try {
            // Busca o IP do visitante via serviço público
            const ipRes = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipRes.json();
            const userIp = ipData.ip;

            // Lógica Básica de Risco (Exemplo: Se for um IP já conhecido ou padrão suspeito)
            // Aqui você pode expandir para checar User-Agent ou frequência
            const riskScore = 0; 

            // Envia para o seu banco de dados no Supabase
            await fetch(`${supabaseUrl}/rest/v1/visits`, {
                method: 'POST',
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    site_id: siteId,
                    ip: userIp,
                    user_agent: navigator.userAgent,
                    risk_score: riskScore,
                    timestamp: new Date().toISOString()
                })
            });

        } catch (error) {
            console.error("IPShield Error:", error);
        }
    }

    coletarDados();
})();
