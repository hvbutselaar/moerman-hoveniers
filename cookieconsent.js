/* Moerman Hoveniers — cookie consent manager (vanilla JS, geen libraries).
   Blokkeert niet-noodzakelijke content (nu: Google Maps) tot toestemming,
   en staat klaar om later analytics (Google Analytics) te gaten.

   Categorieën:
     necessary  — altijd aan (geen opslag/tracking nodig voor de site zelf)
     statistics — analytics (stub: window.mhLoadAnalytics)
     external   — externe content met eigen cookies (Google Maps e.d.)

   Embeds worden gegate via een placeholder:
     <div data-mh-embed="maps" data-mh-src="https://...">…</div>
   Bij external-consent wordt daar een <iframe src=data-mh-src> in geïnjecteerd.

   Herzien: window.mhOpenCookiePrefs() of een link met [data-mh-prefs]. */
(function () {
  'use strict';

  var KEY = 'mh_cookie_consent_v1';
  var VERSION = 1;

  /* ---------- opslag ---------- */
  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (!obj || obj.version !== VERSION) return null;
      return obj;
    } catch (e) { return null; }
  }
  function write(consent) {
    var obj = {
      necessary: true,
      statistics: !!consent.statistics,
      external: !!consent.external,
      ts: new Date().toISOString(),
      version: VERSION
    };
    try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) {}
    return obj;
  }

  /* ---------- CSS ---------- */
  var CSS = ''
    + '#mh-cc,#mh-cc *{box-sizing:border-box}'
    + '#mh-cc{font-family:"Manrope",system-ui,sans-serif;color:#38363A}'
    + '.mh-cc-banner{position:fixed;left:50%;transform:translateX(-50%);bottom:16px;z-index:9999;'
    + 'width:calc(100% - 32px);max-width:560px;'
    + 'background:#fffdf9;border:1px solid #e7e1d6;border-radius:20px;'
    + 'box-shadow:0 18px 50px rgba(56,54,58,.22);padding:24px 26px}'
    + '.mh-cc-banner h2{font-family:"Fraunces",serif;font-weight:600;font-size:21px;'
    + 'line-height:1.1;letter-spacing:-.01em;margin:0 0 8px}'
    + '.mh-cc-banner p{font-size:14px;line-height:1.6;color:#5d5b5f;margin:0 0 18px}'
    + '.mh-cc-banner p a{color:#A90083;text-decoration:underline}'
    + '.mh-cc-actions{display:flex;gap:12px;align-items:center;flex-wrap:wrap}'
    + '.mh-cc-btn{font-family:inherit;font-weight:700;font-size:14px;border-radius:40px;'
    + 'padding:12px 24px;border:none;cursor:pointer;transition:transform .2s,box-shadow .2s}'
    + '.mh-cc-btn:hover{transform:translateY(-2px)}'
    + '.mh-cc-primary{background:#A90083;color:#fff}'
    + '.mh-cc-primary:hover{box-shadow:0 10px 24px rgba(169,0,131,.35)}'
    + '.mh-cc-ghost{background:transparent;border:1.5px solid #d8d2c7;color:#38363A}'
    + '.mh-cc-ghost:hover{border-color:#38363A;transform:none}'
    + '.mh-cc-link{background:none;border:none;color:#5d5b5f;font-family:inherit;'
    + 'font-size:14px;font-weight:600;text-decoration:underline;cursor:pointer;padding:6px 4px}'
    + '.mh-cc-link:hover{color:#A90083}'
    + '.mh-cc-overlay{position:fixed;inset:0;z-index:10000;background:rgba(31,29,33,.55);'
    + 'display:flex;align-items:center;justify-content:center;padding:20px}'
    + '.mh-cc-modal{background:#f3efe7;border-radius:24px;max-width:540px;width:100%;'
    + 'max-height:90vh;overflow:auto;padding:34px;box-shadow:0 24px 70px rgba(0,0,0,.4)}'
    + '.mh-cc-modal h2{font-family:"Fraunces",serif;font-weight:600;font-size:26px;'
    + 'line-height:1.1;letter-spacing:-.01em;margin:0 0 6px}'
    + '.mh-cc-modal>p{font-size:14px;line-height:1.6;color:#5d5b5f;margin:0 0 22px}'
    + '.mh-cc-cat{background:#fffdf9;border:1px solid #e7e1d6;border-radius:16px;'
    + 'padding:18px 20px;margin-bottom:14px;display:flex;gap:16px;align-items:flex-start;'
    + 'justify-content:space-between}'
    + '.mh-cc-cat h3{font-family:"Manrope",sans-serif;font-size:15px;font-weight:700;margin:0 0 4px}'
    + '.mh-cc-cat p{font-size:13px;line-height:1.55;color:#6a686c;margin:0}'
    + '.mh-cc-switch{position:relative;flex:0 0 46px;width:46px;height:26px;margin-top:2px}'
    + '.mh-cc-switch input{position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:pointer}'
    + '.mh-cc-track{position:absolute;inset:0;background:#cfc9bd;border-radius:30px;transition:background .2s}'
    + '.mh-cc-track::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;'
    + 'background:#fff;border-radius:50%;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.25)}'
    + '.mh-cc-switch input:checked+.mh-cc-track{background:#A90083}'
    + '.mh-cc-switch input:checked+.mh-cc-track::after{transform:translateX(20px)}'
    + '.mh-cc-switch input:disabled+.mh-cc-track{background:#4b6b4f;opacity:.55}'
    + '.mh-cc-modal-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}'
    /* embed placeholder */
    + '.mh-embed-ph{position:relative;width:100%;min-height:100%;background:#ece6da;'
    + 'display:flex;align-items:center;justify-content:center;text-align:center;padding:32px}'
    + '.mh-embed-ph .mh-embed-inner{max-width:360px}'
    + '.mh-embed-ph p{font-size:14px;line-height:1.6;color:#5d5b5f;margin:0 0 16px}'
    + '@media(max-width:560px){'
    + '.mh-cc-actions{flex-direction:column;align-items:stretch}'
    + '.mh-cc-btn,.mh-cc-link{width:100%}'
    + '.mh-cc-modal-actions .mh-cc-btn{width:100%}'
    + '}';

  function injectCSS() {
    if (document.getElementById('mh-cc-style')) return;
    var s = document.createElement('style');
    s.id = 'mh-cc-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------- embeds gaten ---------- */
  function loadEmbed(el) {
    var src = el.getAttribute('data-mh-src');
    if (!src || el.querySelector('iframe')) return;
    el.innerHTML = '';
    var f = document.createElement('iframe');
    f.src = src;
    f.loading = 'lazy';
    f.title = el.getAttribute('data-mh-title') || 'Externe content';
    f.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    f.style.width = '100%';
    f.style.height = '100%';
    f.style.border = '0';
    f.style.display = 'block';
    el.appendChild(f);
  }

  function showPlaceholder(el) {
    if (el.querySelector('iframe') || el.querySelector('.mh-embed-ph')) return;
    var label = el.getAttribute('data-mh-label')
      || 'Hier staat een Google Maps-kaart. Door de kaart te laden gaat u akkoord met cookies van Google.';
    var ph = document.createElement('div');
    ph.className = 'mh-embed-ph';
    ph.innerHTML = '<div class="mh-embed-inner"><p>' + label + '</p>'
      + '<button type="button" class="mh-cc-btn mh-cc-primary" data-mh-load>Kaart laden</button></div>';
    el.appendChild(ph);
    ph.querySelector('[data-mh-load]').addEventListener('click', function () {
      // klik-om-te-laden zet meteen external-consent
      var c = read() || {};
      save({ statistics: !!c.statistics, external: true }, true);
    });
  }

  function applyConsent() {
    var c = read();
    var embeds = document.querySelectorAll('[data-mh-embed]');
    embeds.forEach(function (el) {
      if (c && c.external) {
        loadEmbed(el);
      } else {
        // toestemming afwezig of ingetrokken → verwijder een eventueel geladen iframe
        if (el.querySelector('iframe')) el.innerHTML = '';
        showPlaceholder(el);
      }
    });
    if (c && c.statistics && typeof window.mhLoadAnalytics === 'function') {
      try { window.mhLoadAnalytics(); } catch (e) {}
    }
    window.dispatchEvent(new CustomEvent('mh-consent-change', { detail: c }));
  }

  /* ---------- banner ---------- */
  function removeBanner() {
    var b = document.getElementById('mh-cc-banner');
    if (b) b.parentNode.removeChild(b);
  }
  function buildBanner() {
    if (document.getElementById('mh-cc-banner')) return;
    var wrap = document.getElementById('mh-cc') || mkRoot();
    var b = document.createElement('div');
    b.id = 'mh-cc-banner';
    b.className = 'mh-cc-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Cookievoorkeuren');
    b.innerHTML =
      '<h2>Cookies op onze website</h2>'
      + '<p>Wij gebruiken alleen noodzakelijke cookies voor de werking van de site. '
      + 'Voor externe content zoals Google Maps en eventuele statistieken vragen wij uw toestemming. '
      + 'Lees meer in onze <a href="privacy.html">privacyverklaring</a>.</p>'
      + '<div class="mh-cc-actions">'
      + '<button type="button" class="mh-cc-btn mh-cc-primary" data-mh-accept-all>Alle accepteren</button>'
      + '<button type="button" class="mh-cc-btn mh-cc-ghost" data-mh-necessary>Alleen noodzakelijk</button>'
      + '<button type="button" class="mh-cc-link" data-mh-open-prefs>Voorkeuren</button>'
      + '</div>';
    wrap.appendChild(b);
    b.querySelector('[data-mh-accept-all]').addEventListener('click', function () {
      save({ statistics: true, external: true });
    });
    b.querySelector('[data-mh-necessary]').addEventListener('click', function () {
      save({ statistics: false, external: false });
    });
    b.querySelector('[data-mh-open-prefs]').addEventListener('click', openPrefs);
  }

  /* ---------- voorkeuren-modal ---------- */
  function closePrefs() {
    var o = document.getElementById('mh-cc-overlay');
    if (o) o.parentNode.removeChild(o);
    document.removeEventListener('keydown', onEsc);
  }
  function onEsc(e) { if (e.key === 'Escape') closePrefs(); }

  function openPrefs() {
    injectCSS();
    var c = read() || { statistics: false, external: false };
    var wrap = document.getElementById('mh-cc') || mkRoot();
    closePrefs();
    var o = document.createElement('div');
    o.id = 'mh-cc-overlay';
    o.className = 'mh-cc-overlay';
    o.innerHTML =
      '<div class="mh-cc-modal" role="dialog" aria-modal="true" aria-label="Cookievoorkeuren">'
      + '<h2>Cookievoorkeuren</h2>'
      + '<p>Kies welke categorieën u toestaat. Noodzakelijke cookies zijn altijd actief.</p>'
      + cat('necessary', 'Noodzakelijk', 'Nodig voor de basiswerking van de website. Altijd actief.', true, true)
      + cat('statistics', 'Statistieken', 'Anonieme bezoekersstatistieken om de site te verbeteren.', !!c.statistics, false)
      + cat('external', 'Externe content', 'Content van derden met eigen cookies, zoals de Google Maps-kaart.', !!c.external, false)
      + '<div class="mh-cc-modal-actions">'
      + '<button type="button" class="mh-cc-btn mh-cc-primary" data-mh-save>Voorkeuren opslaan</button>'
      + '<button type="button" class="mh-cc-btn mh-cc-ghost" data-mh-accept-all2>Alle accepteren</button>'
      + '</div>'
      + '</div>';
    wrap.appendChild(o);
    o.addEventListener('click', function (e) { if (e.target === o) closePrefs(); });
    document.addEventListener('keydown', onEsc);
    o.querySelector('[data-mh-save]').addEventListener('click', function () {
      save({
        statistics: o.querySelector('#mh-cc-statistics').checked,
        external: o.querySelector('#mh-cc-external').checked
      });
    });
    o.querySelector('[data-mh-accept-all2]').addEventListener('click', function () {
      save({ statistics: true, external: true });
    });
  }

  function cat(id, title, desc, checked, disabled) {
    return '<div class="mh-cc-cat"><div><h3>' + title + '</h3><p>' + desc + '</p></div>'
      + '<label class="mh-cc-switch"><input type="checkbox" id="mh-cc-' + id + '"'
      + (checked ? ' checked' : '') + (disabled ? ' disabled' : '') + '>'
      + '<span class="mh-cc-track"></span></label></div>';
  }

  /* ---------- opslaan + toepassen ---------- */
  function save(consent, keepPlaceholderFlow) {
    write(consent);
    removeBanner();
    closePrefs();
    applyConsent();
  }

  function mkRoot() {
    var r = document.getElementById('mh-cc');
    if (r) return r;
    r = document.createElement('div');
    r.id = 'mh-cc';
    document.body.appendChild(r);
    return r;
  }

  /* ---------- publieke API ---------- */
  window.mhOpenCookiePrefs = function () { openPrefs(); };

  /* ---------- init ---------- */
  function init() {
    injectCSS();
    mkRoot();
    // footer-link(s) koppelen
    document.querySelectorAll('[data-mh-prefs]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); openPrefs(); });
    });
    applyConsent();              // laad embeds of toon placeholders volgens huidige keuze
    if (!read()) buildBanner();  // eerste bezoek → banner
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
