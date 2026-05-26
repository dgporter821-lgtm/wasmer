export function serveStatic() {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>XHTTP Config Generator</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#0f1117;--surface:#1a1d27;--surface2:#22263a;
    --accent:#6d6aff;--accent2:#4ecca3;
    --text:#e2e8f0;--muted:#8892a4;--border:#2d3348;
    --err:#ff6b6b;--ok:#4ecca3;
  }
  body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;padding:24px 16px}
  h1{font-size:1.6rem;font-weight:700;background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px}
  .sub{color:var(--muted);font-size:.9rem;margin-bottom:32px}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:24px;margin-bottom:20px;max-width:780px;margin-left:auto;margin-right:auto}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  @media(max-width:560px){.grid{grid-template-columns:1fr}}
  label{display:block;font-size:.82rem;color:var(--muted);margin-bottom:6px;font-weight:500}
  input,select,textarea{width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:10px 12px;font-size:.9rem;outline:none;transition:border .2s}
  input:focus,select:focus{border-color:var(--accent)}
  .field{margin-bottom:16px}
  .row{display:flex;align-items:center;gap:10px}
  .toggle{position:relative;width:44px;height:24px;flex-shrink:0}
  .toggle input{opacity:0;width:0;height:0}
  .slider{position:absolute;inset:0;background:var(--border);border-radius:12px;cursor:pointer;transition:.3s}
  .slider:before{content:'';position:absolute;width:18px;height:18px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.3s}
  .toggle input:checked+.slider{background:var(--accent)}
  .toggle input:checked+.slider:before{transform:translateX(20px)}
  .btn{width:100%;padding:14px;background:linear-gradient(135deg,var(--accent),#5558ee);color:#fff;border:none;border-radius:10px;font-size:1rem;font-weight:600;cursor:pointer;transition:opacity .2s;margin-top:8px}
  .btn:hover{opacity:.88}
  .btn:disabled{opacity:.5;cursor:not-allowed}
  .tabs{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
  .tab{padding:7px 16px;border-radius:8px;border:1px solid var(--border);background:transparent;color:var(--muted);cursor:pointer;font-size:.85rem;transition:.2s}
  .tab.active{background:var(--accent);color:#fff;border-color:var(--accent)}
  .output{background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:16px;font-family:'Cascadia Code','Fira Code',monospace;font-size:.78rem;white-space:pre-wrap;word-break:break-all;max-height:420px;overflow-y:auto;color:#c9d1d9;line-height:1.6}
  .copy-btn{padding:8px 18px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--text);cursor:pointer;font-size:.82rem;transition:.2s}
  .copy-btn:hover{border-color:var(--accent2);color:var(--accent2)}
  .copy-btn.copied{color:var(--ok);border-color:var(--ok)}
  .badge{display:inline-block;padding:2px 10px;border-radius:20px;font-size:.75rem;font-weight:600;background:rgba(109,106,255,.18);color:var(--accent)}
  .link-box{background:var(--surface2);border:1px solid var(--accent);border-radius:10px;padding:12px 16px;font-family:monospace;font-size:.78rem;word-break:break-all;color:var(--accent2);margin-bottom:12px}
  .flex-end{display:flex;justify-content:flex-end;gap:8px;margin-top:10px}
  .err{color:var(--err);font-size:.85rem;margin-top:8px}
  .hd{display:flex;align-items:center;gap:12px;margin-bottom:20px}
  .hd h2{font-size:1rem;font-weight:600}
  .dot{width:8px;height:8px;border-radius:50%;background:var(--ok)}
  select option{background:#1a1d27}
  .notice{background:rgba(78,204,163,.08);border:1px solid rgba(78,204,163,.25);border-radius:8px;padding:12px 16px;font-size:.82rem;color:var(--accent2);margin-bottom:16px;line-height:1.6}
</style>
</head>
<body>
<div style="max-width:780px;margin:0 auto">
  <h1>⚡ XHTTP Config Generator</h1>
  <p class="sub">ساخت کانفیگ VLESS + XHTTP (SplitHTTP) برای Xray-core</p>

  <div class="card">
    <div class="hd"><div class="dot"></div><h2>تنظیمات اصلی</h2></div>
    <div class="notice">
      ℹ️ XHTTP (SplitHTTP) یک پروتکل مدرن Xray است که ترافیک را به شکل HTTP POST/GET تقسیم می‌کند و از CDN‌های مثل Cloudflare عبور می‌کند.
    </div>

    <div class="grid">
      <div class="field">
        <label>آدرس سرور</label>
        <input id="address" type="text" value="your-domain.com" placeholder="example.com">
      </div>
      <div class="field">
        <label>پورت</label>
        <input id="port" type="number" value="443" min="1" max="65535">
      </div>
      <div class="field">
        <label>UUID (خودکار تولید می‌شه)</label>
        <input id="uuid" type="text" placeholder="کلیک کنید تا تولید شود" readonly style="cursor:pointer;color:var(--accent2)" onclick="genUUID()">
      </div>
      <div class="field">
        <label>Path</label>
        <input id="path" type="text" value="/xhttp/auto">
      </div>
      <div class="field">
        <label>SNI (اختیاری، پیش‌فرض = آدرس)</label>
        <input id="sni" type="text" placeholder="sni.example.com">
      </div>
      <div class="field">
        <label>نوع خروجی</label>
        <select id="mode">
          <option value="both">هر دو (کلاینت + سرور)</option>
          <option value="client">فقط کلاینت</option>
          <option value="server">فقط سرور</option>
        </select>
      </div>
    </div>

    <div class="grid" style="margin-bottom:16px">
      <div class="field">
        <label>حداکثر POST همزمان</label>
        <input id="scMaxConcurrentPosts" type="number" value="4" min="1" max="64">
      </div>
      <div class="field">
        <label>Buffer POSTs</label>
        <input id="scMaxBufferedPosts" type="number" value="8" min="1" max="64">
      </div>
      <div class="field">
        <label>حداقل فاصله بین POSTها (ms)</label>
        <input id="scMinPostsIntervalMs" type="number" value="30" min="0">
      </div>
      <div class="field">
        <label>Padding بایت (مثلاً 100-1000)</label>
        <input id="xPaddingBytes" type="text" value="100-1000">
      </div>
    </div>

    <div class="row" style="margin-bottom:12px">
      <label class="toggle"><input type="checkbox" id="tls" checked><span class="slider"></span></label>
      <span>TLS فعال</span>
      <span style="margin-right:auto"></span>
      <label class="toggle"><input type="checkbox" id="allowInsecure"><span class="slider"></span></label>
      <span>اجازه گواهی نامعتبر</span>
    </div>
    <div class="row" style="margin-bottom:16px">
      <label class="toggle"><input type="checkbox" id="noGRPCHeader"><span class="slider"></span></label>
      <span>بدون gRPC Header</span>
    </div>

    <button class="btn" id="genBtn" onclick="generate()">🔧 تولید کانفیگ</button>
    <div class="err" id="errMsg"></div>
  </div>

  <div class="card" id="resultCard" style="display:none">
    <div class="hd"><div class="dot" style="background:var(--accent)"></div><h2>نتیجه <span class="badge">آماده کپی</span></h2></div>

    <div id="shareSection" style="margin-bottom:16px">
      <label style="margin-bottom:8px;display:block">🔗 لینک اشتراک‌گذاری (Import Link)</label>
      <div class="link-box" id="shareLink">-</div>
      <div class="flex-end">
        <button class="copy-btn" onclick="copyText('shareLink', this)">📋 کپی لینک</button>
      </div>
    </div>

    <div class="tabs" id="tabs"></div>
    <div class="output" id="output"></div>
    <div class="flex-end">
      <button class="copy-btn" onclick="copyOutput()">📋 کپی JSON</button>
      <button class="copy-btn" onclick="downloadOutput()">⬇️ دانلود JSON</button>
    </div>
  </div>
</div>

<script>
  let result = {};
  let activeTab = 'client';

  window.onload = () => { genUUID(); genPath(); };

  function genUUID() {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random()*16|0, v = c==='x'?r:(r&0x3|0x8);
      return v.toString(16);
    });
    document.getElementById('uuid').value = uuid;
  }

  function genPath() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let rand = '';
    for(let i=0;i<8;i++) rand += chars[Math.floor(Math.random()*chars.length)];
    document.getElementById('path').value = '/xhttp/' + rand;
  }

  async function generate() {
    const btn = document.getElementById('genBtn');
    const err = document.getElementById('errMsg');
    err.textContent = '';
    btn.disabled = true;
    btn.textContent = '⏳ در حال تولید...';

    const params = {
      mode: document.getElementById('mode').value,
      address: document.getElementById('address').value.trim(),
      port: parseInt(document.getElementById('port').value),
      uuid: document.getElementById('uuid').value.trim(),
      path: document.getElementById('path').value.trim(),
      sni: document.getElementById('sni').value.trim(),
      tls: document.getElementById('tls').checked,
      allowInsecure: document.getElementById('allowInsecure').checked,
      noGRPCHeader: document.getElementById('noGRPCHeader').checked,
      scMaxConcurrentPosts: parseInt(document.getElementById('scMaxConcurrentPosts').value),
      scMaxBufferedPosts: parseInt(document.getElementById('scMaxBufferedPosts').value),
      scMinPostsIntervalMs: parseInt(document.getElementById('scMinPostsIntervalMs').value),
      xPaddingBytes: document.getElementById('xPaddingBytes').value.trim()
    };

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'خطای ناشناخته');

      result = data.config;
      renderResult(params.mode);
    } catch(e) {
      err.textContent = '❌ ' + e.message;
    } finally {
      btn.disabled = false;
      btn.textContent = '🔧 تولید کانفیگ';
    }
  }

  function renderResult(mode) {
    document.getElementById('resultCard').style.display = 'block';
    document.getElementById('shareLink').textContent = result.shareLink || '';

    const tabs = document.getElementById('tabs');
    tabs.innerHTML = '';
    const available = [];
    if (result.client) available.push({id:'client', label:'🖥️ کانفیگ کلاینت'});
    if (result.server) available.push({id:'server', label:'🖧 کانفیگ سرور'});
    available.push({id:'uuid', label:'🔑 UUID'});

    available.forEach((t, i) => {
      const btn = document.createElement('button');
      btn.className = 'tab' + (i===0?' active':'');
      btn.textContent = t.label;
      btn.onclick = () => {
        document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTab = t.id;
        showTab(t.id);
      };
      tabs.appendChild(btn);
    });

    activeTab = available[0].id;
    showTab(activeTab);
    document.getElementById('resultCard').scrollIntoView({behavior:'smooth'});
  }

  function showTab(tab) {
    const out = document.getElementById('output');
    if (tab === 'uuid') {
      out.textContent = 'UUID: ' + result.uuid + '\\n\\nPath: ' + result.path;
    } else {
      out.textContent = JSON.stringify(result[tab], null, 2);
    }
  }

  function copyText(id, btn) {
    const text = document.getElementById(id).textContent;
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = '✅ کپی شد';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = '📋 کپی لینک'; btn.classList.remove('copied'); }, 2000);
    });
  }

  function copyOutput() {
    const text = document.getElementById('output').textContent;
    navigator.clipboard.writeText(text).then(() => {
      const btn = event.target;
      btn.textContent = '✅ کپی شد';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = '📋 کپی JSON'; btn.classList.remove('copied'); }, 2000);
    });
  }

  function downloadOutput() {
    const text = document.getElementById('output').textContent;
    const blob = new Blob([text], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = activeTab + '-config.json';
    a.click();
  }
</script>
</body>
</html>`;
}
