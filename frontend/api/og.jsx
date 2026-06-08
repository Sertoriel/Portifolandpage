import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Recupera parâmetros da URL
    const title = searchParams.get('title') || "Sertoriel's Portfolio";
    const category = searchParams.get('category') || 'Portfolio';

    // Obtém o host dinâmico para carregar a logo do site de forma absoluta
    const { protocol, host } = new URL(req.url);
    const logoUrl = `${protocol}//${host}/ST.png`;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            background: 'radial-gradient(circle at 10% 20%, rgb(15, 23, 42) 0%, rgb(7, 8, 11) 90%)',
            padding: '80px 80px',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Efeito decorativo de Grid no fundo */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(rgba(101, 175, 157, 0.15) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
              opacity: 0.5,
            }}
          />

          {/* Brilho decorativo neon no canto */}
          <div
            style={{
              position: 'absolute',
              bottom: '-150px',
              right: '-150px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'rgba(101, 175, 157, 0.25)',
              filter: 'blur(80px)',
            }}
          />

          {/* Cabeçalho */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={logoUrl}
                alt="ST"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  marginRight: '20px',
                  border: '1px solid rgba(101, 175, 157, 0.3)',
                }}
              />
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  letterSpacing: '0.05em',
                }}
              >
                Sertoriel
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '16px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: '#65af9d',
                letterSpacing: '0.15em',
                padding: '6px 16px',
                borderRadius: '99px',
                border: '1px solid rgba(101, 175, 157, 0.3)',
                backgroundColor: 'rgba(101, 175, 157, 0.05)',
              }}
            >
              {category}
            </div>
          </div>

          {/* Corpo do Banner */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              zIndex: 10,
              maxWidth: '900px',
            }}
          >
            <h1
              style={{
                fontSize: title.length > 50 ? '52px' : '64px',
                fontWeight: '800',
                color: '#ffffff',
                lineHeight: '1.2',
                marginBottom: '20px',
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h1>
          </div>

          {/* Rodapé / Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '30px',
              zIndex: 10,
            }}
          >
            <span
              style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.4)',
                fontFamily: 'monospace',
              }}
            >
              ~/portfolio/share-preview
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e.message);
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}
