(function() {
  var BASE_URL = 'https://ipshield-saas.vercel.app';

  function getParam(name) {
    var url = new URLSearchParams(window.location.search);
    return url.get(name);
  }

  function collect() {
    var payload = {
      page:       window.location.href,
      referrer:   document.referrer,
      user_agent: navigator.userAgent,
      gclid:      getParam('gclid'),
      site_id:    window.IPSHIELD_SITE_ID || null,
    };

    fetch(BASE_URL + '/api/collect', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
      keepalive: true,
    }).catch(function() {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', collect);
  } else {
    collect();
  }
})();
