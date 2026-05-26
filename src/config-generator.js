/**
 * XHTTP Config Generator
 * Supports: VLESS + XHTTP (SplitHTTP), inbound & outbound
 */

function randomUUID() {
  // Simple UUID v4 generator (no crypto dependency for WASI compat)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function randomPath(prefix = "/xhttp") {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let rand = "";
  for (let i = 0; i < 8; i++) rand += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}/${rand}`;
}

export function generateXhttpConfig(params = {}) {
  const {
    mode = "client",          // "client" | "server" | "both"
    address = "your-server.com",
    port = 443,
    uuid = randomUUID(),
    path = randomPath(),
    tls = true,
    sni = "",
    allowInsecure = false,
    scMaxBufferedPosts = 8,
    scMaxConcurrentPosts = 4,
    scMinPostsIntervalMs = 30,
    scStreamUpServerTimeout = 20000,
    noGRPCHeader = false,
    keepAliveInterval = 0,
    xPaddingBytes = "100-1000",
    extra = {}
  } = params;

  const effectiveSNI = sni || address;

  // ── XHTTP stream settings ─────────────────────────────────────────────────
  const xhttpStreamSettings = {
    network: "xhttp",
    xhttpSettings: {
      path,
      host: [effectiveSNI],
      scMaxBufferedPosts,
      scMaxConcurrentPosts,
      scMinPostsIntervalMs,
      scStreamUpServerTimeout,
      noGRPCHeader,
      keepAliveInterval,
      xPaddingBytes,
      ...extra
    }
  };

  if (tls) {
    xhttpStreamSettings.security = "tls";
    xhttpStreamSettings.tlsSettings = {
      serverName: effectiveSNI,
      allowInsecure,
      fingerprint: "chrome"
    };
  } else {
    xhttpStreamSettings.security = "none";
  }

  // ── Client config (outbound) ──────────────────────────────────────────────
  const clientConfig = {
    log: { loglevel: "warning" },
    inbounds: [
      {
        tag: "socks",
        port: 1080,
        listen: "127.0.0.1",
        protocol: "socks",
        settings: { auth: "noauth", udp: true }
      },
      {
        tag: "http",
        port: 8118,
        listen: "127.0.0.1",
        protocol: "http",
        settings: {}
      }
    ],
    outbounds: [
      {
        tag: "proxy",
        protocol: "vless",
        settings: {
          vnext: [
            {
              address,
              port: Number(port),
              users: [
                {
                  id: uuid,
                  encryption: "none",
                  flow: ""
                }
              ]
            }
          ]
        },
        streamSettings: xhttpStreamSettings,
        mux: { enabled: false }
      },
      { tag: "direct", protocol: "freedom", settings: {} },
      { tag: "block", protocol: "blackhole", settings: {} }
    ],
    routing: {
      domainStrategy: "IPIfNonMatch",
      rules: [
        { type: "field", outboundTag: "direct", domain: ["geosite:cn"] },
        { type: "field", outboundTag: "direct", ip: ["geoip:cn", "geoip:private"] },
        { type: "field", outboundTag: "proxy", domain: ["geosite:geolocation-!cn"] }
      ]
    }
  };

  // ── Server config (inbound) ───────────────────────────────────────────────
  const serverXhttpSettings = {
    network: "xhttp",
    xhttpSettings: {
      path,
      scMaxBufferedPosts,
      scStreamUpServerTimeout,
      noGRPCHeader,
      xPaddingBytes
    }
  };

  if (tls) {
    serverXhttpSettings.security = "tls";
    serverXhttpSettings.tlsSettings = {
      certificates: [
        {
          certificateFile: "/etc/ssl/certs/server.crt",
          keyFile: "/etc/ssl/private/server.key"
        }
      ]
    };
  } else {
    serverXhttpSettings.security = "none";
  }

  const serverConfig = {
    log: { loglevel: "warning", access: "/var/log/xray/access.log", error: "/var/log/xray/error.log" },
    inbounds: [
      {
        tag: "vless-xhttp-in",
        port: Number(port),
        listen: "0.0.0.0",
        protocol: "vless",
        settings: {
          clients: [{ id: uuid, flow: "" }],
          decryption: "none",
          fallbacks: []
        },
        streamSettings: serverXhttpSettings,
        sniffing: { enabled: true, destOverride: ["http", "tls", "quic"] }
      }
    ],
    outbounds: [
      { tag: "direct", protocol: "freedom", settings: {} },
      { tag: "block", protocol: "blackhole", settings: {} }
    ],
    routing: {
      domainStrategy: "IPIfNonMatch",
      rules: [
        { type: "field", outboundTag: "block", ip: ["geoip:private"] }
      ]
    }
  };

  // ── Xray import link (VLESS+XHTTP) ───────────────────────────────────────
  const tlsSuffix = tls ? `&security=tls&sni=${effectiveSNI}&fp=chrome&allowInsecure=${allowInsecure ? 1 : 0}` : "&security=none";
  const shareLink = `vless://${uuid}@${address}:${port}?encryption=none&type=xhttp&path=${encodeURIComponent(path)}&host=${effectiveSNI}${tlsSuffix}#XHTTP-${address}`;

  const result = { uuid, path, shareLink };
  if (mode === "client" || mode === "both") result.client = clientConfig;
  if (mode === "server" || mode === "both") result.server = serverConfig;

  return result;
}
