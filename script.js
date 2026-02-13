// IPShield - Script Coletor v1.0 (Conexão Direta Supabase)
(function() {
    const CONFIG = {
        SITE_ID: '3bb6f46e-a781-4afd-b9c4-3044b0873228', 
        SUPABASE_URL: 'https://xirrtonafivrphrzufbq.supabase.co',
        SUPABASE_KEY: 'sb_publishable_A5R5oMe2Xxks-tMfWcVFnA_yscoQYW9'
    };

    async function capturarIPShield() {
        try {
            // Obtém o IP do visitante
            const ipRes = await fetch('https://api.ipify.org?format=json');
            const { ip } = await ipRes.json();

            // Monta o pacote de dados conforme sua tabela 'visits'
            const payload = {
                site_id: CONFIG.SITE_ID,
                ip: ip,
                device: navigator.platform,
                user_agent: navigator.userAgent
            };

            // Envia para o banco de dados
            const response = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/visits`, {
                method: 'POST',
                headers: {
                    'apikey': CONFIG.SUPABASE_KEY,
                    'Authorization': `Bearer ${CONFIG.SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log('✅ IPShield: Tráfego monitorado com sucesso.');
            }
        } catch (error) {
            console.error('❌ IPShield: Falha na conexão.', error);
        }
    }

    window.addEventListener('load', capturarIPShield);
})();
