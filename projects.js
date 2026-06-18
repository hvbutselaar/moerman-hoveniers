/* Moerman Hoveniers — gedeelde projectdata + rendering.
   Eén bron van waarheid voor de overzichtspagina (werk.html) en de
   "andere projecten"-sectie op de detailpagina's. Placeholder-teksten
   (blurb) zijn bedoeld om later door echte projectomschrijvingen te
   vervangen. `built: true` = detailpagina bestaat (werk-<slug>.html). */

const PROJECTS = [
  { slug: 'tuin-kootwijk', title: 'Tuin in Kootwijk', location: 'Kootwijk', type: 'Ontwerp & aanleg', built: true,
    blurb: 'Een ruime achtertuin met warme houttinten, grind en siergrassen — een rustige plek om in alle seizoenen buiten te leven.' },
  { slug: 'veranda-barneveld', title: 'Veranda in Barneveld', location: 'Barneveld', type: 'Houtbouw & terras', built: true,
    blurb: 'Een sfeervolle veranda met aangrenzend terras en zwembad, omkaderd door volle borders die het geheel laten samensmelten met de tuin.' },
  { slug: 'zembad', title: 'Zwembadtuin', location: 'Gelderland', type: 'Aanleg & bestrating', built: true,
    blurb: 'Een strakke tuin rond het zwembad, met een houten poolhouse, ruime bestrating en kleurrijke beplanting voor een vakantiegevoel thuis.' },
  { slug: 'tuin-veenendaal', title: 'Tuin in Veenendaal', location: 'Veenendaal', type: 'Ontwerp & aanleg', built: true,
    blurb: 'Een complete tuinrenovatie met een natuurlijke overgang tussen terras, gazon en beplanting.' },
  { slug: 'tuin-uddel', title: 'Tuin in Uddel', location: 'Uddel', type: 'Ontwerp & aanleg', built: true,
    blurb: 'Een landelijke tuin met ruimte, groen en doordachte zichtlijnen vanuit het huis.' },
  { slug: 'veranda-uddel', title: 'Veranda in Uddel', location: 'Uddel', type: 'Houtbouw', built: true,
    blurb: 'Een robuuste veranda die het hele jaar door beschut buitenleven mogelijk maakt.' },
  { slug: 'achtertuin', title: 'Achtertuin op maat', location: 'Gelderland', type: 'Ontwerp & aanleg', built: true,
    blurb: 'Een besloten achtertuin met siergrassen en een warme, natuurlijke uitstraling.' },
  { slug: 'bestrating', title: 'Bestrating & oprit', location: 'Gelderland', type: 'Bestrating', built: true,
    blurb: 'Strakke bestrating die de tuin structuur en een verzorgde eerste indruk geeft.' },
  { slug: 'voortuin', title: 'Voortuin met allure', location: 'Gelderland', type: 'Ontwerp & aanleg', built: true,
    blurb: 'Een representatieve voortuin die het huis verwelkomend en compleet maakt.' },
  { slug: 'project-1-velp', title: 'Tuin in Velp', location: 'Velp', type: 'Ontwerp & aanleg', built: true,
    blurb: 'Een groene tuin met volle borders, grindpaden en rustige lijnen.' },
  { slug: 'project-2-velp', title: 'Tuin in Velp II', location: 'Velp', type: 'Aanleg', built: true,
    blurb: 'Een verzorgde tuinaanleg met aandacht voor afwerking en detail.' },
  { slug: 'project-elst', title: 'Tuin in Elst', location: 'Elst', type: 'Ontwerp & aanleg', built: true,
    blurb: 'Een evenwichtige tuin waarin bestrating en beplanting elkaar versterken.' },
  { slug: 'project-veenendaal', title: 'Tuinpad in Veenendaal', location: 'Veenendaal', type: 'Bestrating', built: true,
    blurb: 'Een fraai aangelegd pad met stapstenen dat de tuin verbindt.' },
  { slug: 'vijver-amerongen', title: 'Vijver in Amerongen', location: 'Amerongen', type: 'Vijver & water', built: true,
    blurb: 'Een formele vijver die rust en weerspiegeling aan de tuin toevoegt.' }
];

/* Verberg klikgedrag voor projecten zonder eigen pagina, maar toon ze wel. */
function projectCardHTML(p) {
  const inner = `
      <div class="pcard-img" style="background-image:url('img/projecten/${p.slug}/cover.jpg')">
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
