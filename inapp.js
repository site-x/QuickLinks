/* Social apps (Facebook, Messenger, Instagram, TikTok...) open links in their own built-in browser, and a website can't
   force it to close. What it can do: on Android, ask the system to hand the page to the default browser; on iPhone, show a
   one-tap hint (tap ... then "Open in Safari/Browser") with a copy-link fallback. */
(function () {
  var ua = navigator.userAgent || '';
  var inApp = /FBAN|FBAV|FB_IAB|FBIOS|Messenger|Instagram|TikTok|musical_ly|BytedanceWebview|Line\/|Snapchat|Twitter|LinkedInApp|Pinterest|WhatsApp/i.test(ua);
  if (!inApp) return;
  var isAndroid = /Android/i.test(ua);
  var url = location.href;

  if (isAndroid) {
    try {
      if (!sessionStorage.getItem('ob-tried')) {
        sessionStorage.setItem('ob-tried', '1');
        location.href = 'intent://' + location.host + location.pathname + location.search + location.hash +
          '#Intent;scheme=https;action=android.intent.action.VIEW;S.browser_fallback_url=' + encodeURIComponent(url) + ';end';
      }
    } catch (e) {}
  }

  function show() {
    if (document.getElementById('ob-bar')) return;
    var bar = document.createElement('div');
    bar.id = 'ob-bar';
    bar.setAttribute('role', 'status');
    bar.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;display:flex;gap:10px;align-items:center;padding:12px 14px;border-radius:12px;background:#0f172a;color:#fff;font:600 13px/1.35 system-ui,-apple-system,sans-serif;box-shadow:0 12px 36px rgba(0,0,0,.35)';
    var msg = document.createElement('span');
    msg.style.flex = '1';
    msg.textContent = isAndroid
      ? 'For the best experience, open this page in your browser: tap ⋮ then "Open in browser".'
      : 'For the best experience, open in Safari: tap ••• then "Open in Safari" (or copy the link).';
    var copy = document.createElement('button');
    copy.type = 'button';
    copy.textContent = 'Copy link';
    copy.style.cssText = 'flex:none;border:0;border-radius:8px;padding:8px 12px;background:#2563eb;color:#fff;font:700 12px system-ui,sans-serif;cursor:pointer';
    copy.onclick = function () {
      var done = function () { copy.textContent = 'Copied'; };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, done); else done();
    };
    var x = document.createElement('button');
    x.type = 'button';
    x.setAttribute('aria-label', 'Dismiss');
    x.textContent = '×';
    x.style.cssText = 'flex:none;border:0;background:none;color:#fff;font-size:22px;line-height:1;cursor:pointer';
    x.onclick = function () { bar.remove(); };
    bar.append(msg, copy, x);
    document.body.appendChild(bar);
  }
  if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
})();
