/* Moerman Hoveniers — gedeelde projectdata + rendering.
   Eén bron van waarheid voor de overzichtspagina (werk.html) en de
   "andere projecten"-sectie op de detailpagina's. Placeholder-teksten
   (blurb) zijn bedoeld om later door echte projectomschrijvingen te
   vervangen. `built: true` = detailpagina bestaat (werk-<slug>.html). */

const PROJECTS = [
  { slug: 'tuin-voorthuizen', title: 'Tuin in Voorthuizen', location: 'Voorthuizen', type: 'Ontwerp & aanleg', built: true,
    blurb: 'Een ruime achtertuin met warme houttinten, grind en siergrassen — een rustige plek om in alle seizoenen buiten te leven.' },
  { slug: 'poolberging-arnhem', title: 'Poolberging in Arnhem', location: 'Arnhem', type: 'Houtbouw & aanleg', built: true,
    blurb: 'Een houten berging naast het zwembad, met ruim terras, gazon en volle borders eromheen.' },
  { slug: 'tuin-ede', title: 'Tuin in Ede', location: 'Ede', type: 'Ontwerp & aanleg', built: true,
    blurb: 'Een complete tuinrenovatie met een natuurlijke overgang tussen terras, veranda en beplanting.' },
  { slug: 'tuin-arnhem', title: 'Tuin in Arnhem', location: 'Arnhem', type: 'Ontwerp & aanleg', built: true,
    blurb: 'Een sfeervolle tuin rond een verhoogde vijver, met klinkers, buxus en lavendel.' },
  { slug: 'veranda-velp', title: 'Veranda en schuur in Velp', location: 'Velp', type: 'Houtbouw', built: true,
    blurb: 'Een houten veranda met schuur, verbonden met het huis door stapstenen in het gazon.' },
  { slug: 'achtertuin', title: 'Achtertuin op maat', location: 'Kootwijk', type: 'Ontwerp & aanleg', built: true,
    blurb: 'Een besloten achtertuin met siergrassen en een warme, natuurlijke uitstraling.' },
  { slug: 'bestrating', title: 'Bestrating & grindwerk', location: 'Diverse projecten', type: 'Bestrating & grind', built: true,
    blurb: 'Terrassen, paden en opritten in klinkers, keramiek, natuursteen en grind — strak gelegd op een stevige basis.' },
  { slug: 'voortuin', title: 'Voortuin met allure', location: 'Gelderland', type: 'Ontwerp & aanleg', built: true,
    blurb: 'Een representatieve voortuin die het huis verwelkomend en compleet maakt.' },
  { slug: 'project-veenendaal', title: 'Tuinpad in Veenendaal', location: 'Veenendaal', type: 'Bestrating', built: true,
    blurb: 'Een fraai aangelegd pad met stapstenen dat de tuin verbindt.' },
  { slug: 'vijver-amerongen', title: 'Vijver in Amerongen', location: 'Amerongen', type: 'Vijver & water', built: true,
    blurb: 'Een formele vijver die rust en weerspiegeling aan de tuin toevoegt.' }
];

/* Verberg klikgedrag voor projecten zonder eigen pagina, maar toon ze wel. */
function projectCardHTML(p) {
  const inner = `
      <div class="pcard-img" style="background-image:url('img/projecten/${p.slug}/cover.jpg?v=2')">
        ${p.built ? '' : '<span class="pcard-soon">Binnenkort</span>'}
      </div>
      <div class="pcard-body">
        <span class="pcard-meta">${p.location} · ${p.type}</span>
        <h3>${p.title}</h3>
        <p>${p.blurb}</p>
        ${p.built ? '<span class="pcard-link">Bekijk project →</span>' : ''}
      </div>`;
  return p.built
    ? `<a class="pcard" href="werk-${p.slug}.html">${inner}</a>`
    : `<div class="pcard pcard-disabled">${inner}</div>`;
}

/* Vul de overzicht-grid met alle projecten. */
function renderGrid(targetSelector) {
  const el = document.querySelector(targetSelector);
  if (el) el.innerHTML = PROJECTS.map(projectCardHTML).join('');
}

/* Kies n willekeurige andere projecten (Fisher–Yates), exclusief het huidige. */
function renderOthers(currentSlug, n, targetSelector) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  const pool = PROJECTS.filter(p => p.slug !== currentSlug);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  el.innerHTML = pool.slice(0, n).map(projectCardHTML).join('');
}
