export default async function BlockedPage({
  searchParams,
}: {
  searchParams: Promise<{ ip?: string }>;
}) {
  const params = await searchParams;
  const ip = params.ip || "IP detectado";

  return (
    <div style={{ margin: 0, background: "#0a0a0a", color: "#e8e8e8", fontFamily: "sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ maxWidth: 600, padding: 48, background: "#111", border: "1px solid #222", borderTop: "2px solid #ff2d2d" }}>
        <div style={{ fontSize: 48, marginBottom: 24 }}>🛡️</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>
          Seu IP foi <span style={{ color: "#ff2d2d" }}>filtrado</span> pelo IPShield.
        </h1>
        <div style={{ background: "rgba(255,45,45,0.1)", border: "1px solid rgba(255,45,45,0.3)", padding: "12px 16px", marginBottom: 24, fontFamily: "monospace" }}>
          <span style={{ color: "#ff2d2d", fontSize: 11, letterSpacing: "0.1em" }}>IP DETECTADO: </span>
          <strong>{ip}</strong>
        </div>
        <p style={{ color: "#aaa", lineHeight: 1.7 }}>
          Vimos que você estava interessado em como protegemos nossos anúncios.
          Nosso sistema analisou seu IP, User-Agent e padrão de clique em tempo real
          e tomou uma decisão automática em milissegundos.
        </p>
        <p style={{ color: "#aaa", lineHeight: 1.7, marginTop: 16 }}>
          <strong style={{ color: "#e8e8e8" }}>E se você usasse essa tecnologia a seu favor?</strong>{" "}
          Em vez de clicar nos anúncios da concorrência, que tal proteger os seus?
        </p>
        <a href="mailto:contato@ipshield.app" style={{ display: "block", marginTop: 32, background: "#ff2d2d", color: "#fff", padding: "16px 24px", textAlign: "center", textDecoration: "none", fontWeight: 700 }}>
          Quero proteger meus anúncios →
        </a>
      </div>
    </div>
  );
}
