
(function() {
    const API_ENDPOINT = 'https://ipshield-saas.vercel.app/api/collect';
    
    const data = {
        domain: window.location.hostname,
        path: window.location.pathname,
        referrer: document.referrer,
        screen: `${window.screen.width}x${window.screen.height}`
    };

    fetch(API_ENDPOINT, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).catch(err => console.error('IPShield error:', err));
})();
