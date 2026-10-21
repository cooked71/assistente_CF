// Logica dei comandi di gestione (testo -> azione, e applicazione dell'azione allo stato)
import { norm, simili, normalizzaMenu, normalizzaVoce } from './menu.mjs';

// Parole "vuote" da togliere solo a inizio/fine del nome (mai in mezzo, es. "Stinco di agnello")
const VUOTE = new Set(['il','lo','la','i','gli','le','un','una','e','sono','ora','adesso','ancora','di','nuovo','piu','vino','tutti','tutto','tutte']);

function trimVuote(s) {
  const p = s.replace(/\bl'/g, ' ').split(/\s+/).filter(Boolean);
  while (p.length && VUOTE.has(p[0])) p.shift();
  while (p.length && VUOTE.has(p[p.length - 1])) p.pop();
  return p.join(' ');
}

const RIMUOVI = /\b(elimina|eliminare|togli|togliere|rimuovi|rimuovere|cancella|cancellare|svuota|azzera|resetta|nessun)\b/g;
const NEG = /esaurit[oaie]|finit[oaie]|terminat[oaie]|\bmanca(no)?\b|\bnon c'?e\b|\bnon abbiamo\b|\bnon (e )?disponibil[ei]/;
const STRIP_NEG = /esaurit[oaie]|finit[oaie]|terminat[oaie]|\bmanca(no)?\b|\bnon c'?e\b|\bnon abbiamo\b|\bnon (e )?disponibil[ei]|\bpiu\b/g;
const RIPR = /ripristin|riabilit|riaggiung|\bdi nuovo\b|tornat[oaie]|\btorna\b/;
const STRIP_RIPR = /ripristin\w*|riabilit\w*|riaggiung\w*|\bdi nuovo\b|tornat[oaie]|\btorna\b|\bdisponibil[ei]\b/g;

const ripulisci = (s) => s
  .replace(/^[\s:,;\-–]+|[\s:,;\-–]+$/g, '')
  .replace(/^((il|i|è|sono)\s+)+/i, '')
  .replace(/^[\s:,;\-–]+/, '')
  .trim();

export function interpreta(testo) {
  const t = String(testo || '').replace(/[’‘`´]/g, "'").trim();
  const n = norm(t);
  if (!n) return null;

  // --- Piatti del giorno ---
  if (/piatt[oi] del giorno|\boggi c'?e\b/.test(n)) {
    if (new RegExp(RIMUOVI.source).test(n)) {
      const nome = trimVuote(
        n.replace(RIMUOVI, ' ').replace(/piatt[oi] del giorno/g, ' ').replace(/\boggi c'?e\b/g, ' ')
      );
      return nome ? { azione: 'rimuovi_giorno', nome } : { azione: 'svuota_giorno' };
    }
    const nome = ripulisci(
      t.replace(/\b(aggiungi|aggiungere|metti|inserisci|imposta)\b/gi, ' ')
       .replace(/piatt[oi]\s+del\s+giorno/gi, ' ')
       .replace(/\boggi\s+c'?[eè](?=\s|$|[:,])/gi, ' ')
    );
    return nome ? { azione: 'aggiungi_giorno', nome } : null;
  }

  const neg = NEG.test(n);
  const ripr = RIPR.test(n);
  const disp = /\bdisponibil[ei]\b/.test(n);

  // --- Ripristino ---
  if (ripr || (disp && !neg)) {
    const nome = trimVuote(n.replace(STRIP_RIPR, ' '));
    if (/\b(tutto|tutti|tutte)\b/.test(n) && !nome) return { azione: 'ripristina_tutto' };
    return nome ? { azione: 'ripristina', nome } : null;
  }

  // --- Esaurito ---
  if (neg) {
    const nome = trimVuote(n.replace(STRIP_NEG, ' '));
    return nome ? { azione: 'esaurito', nome } : null;
  }
  return null;
}

const ha = (lista, x) => lista.some(e => norm(e) === norm(x));
const elenco = (menu) => [
  ...menu.piatti.map(voce => ({ tipo: 'piatto', voce })),
  ...menu.vini.map(voce => ({ tipo: 'vino', voce })),
];
const nomi = (voci) => voci.map(v => (v.voce ? v.voce.nome : v.nome)).join('; ');
const listaDi = (menu, tipo) => (tipo === 'vino' ? menu.vini : tipo === 'piatto' ? menu.piatti : null);
const maxId = (lista) => lista.reduce((m, x) => Math.max(m, x.id || 0), 0);
const NO = (messaggio) => ({ messaggio, modificato: false });

// stato = { menu: { piatti: [], vini: [] }, giorno: [] } — viene modificato sul posto
export function applica(stato, azione, dati = {}) {
  const { menu } = stato;
  const nome = String(dati.nome || '').trim();

  switch (azione) {
    // ---------- Piatti del giorno ----------
    case 'aggiungi_giorno': {
      const nomiNuovi = nome.split(/[;\n]+|\s\+\s/).map(s => s.trim()).filter(Boolean);
      const nuovi = nomiNuovi.filter(x => !ha(stato.giorno, x));
      stato.giorno.push(...nuovi);
      if (!nuovi.length) return NO('Era già tra i piatti del giorno.');
      return { messaggio: `Piatto del giorno aggiunto: ${nuovi.join('; ')}`, modificato: true };
    }

    case 'rimuovi_giorno':
    case 'rimuovi_giorno_esatto': {
      const uguale = azione === 'rimuovi_giorno_esatto'
        ? (e) => norm(e) === norm(nome)
        : (e) => simili(e, nome);
      const tolti = stato.giorno.filter(uguale);
      if (!tolti.length) return NO(`Tra i piatti del giorno non trovo "${nome}".`);
      stato.giorno = stato.giorno.filter(e => !uguale(e));
      return { messaggio: `Tolto dai piatti del giorno: ${tolti.join('; ')}`, modificato: true };
    }

    case 'svuota_giorno': {
      if (!stato.giorno.length) return NO("Non c'erano piatti del giorno.");
      stato.giorno = [];
      return { messaggio: 'Piatti del giorno eliminati.', modificato: true };
    }

    // ---------- Disponibilità (comandi a parole) ----------
    case 'esaurito': {
      if (!nome) return NO('Non ho capito quale piatto o vino sia esaurito.');

      const viniT = menu.vini.filter(v => simili(v.nome, nome));
      if (viniT.length) {
        const esatti = viniT.filter(v => norm(v.nome) === norm(nome));
        const scelti = esatti.length === 1 ? esatti : viniT.length === 1 ? viniT : null;
        if (!scelti) {
          return NO(`Più vini corrispondono a "${nome}": ${viniT.slice(0, 6).map(v => v.nome).join('; ')}${viniT.length > 6 ? '…' : ''}. Dimmi il nome completo.`);
        }
        const v = scelti[0];
        if (!v.disponibile) return NO(`${v.nome} risulta già non disponibile.`);
        v.disponibile = false;
        return { messaggio: `Vino esaurito: ${v.nome}`, modificato: true };
      }

      const piattiT = menu.piatti.filter(p => simili(p.nome, nome));
      const giornoT = stato.giorno.filter(e => simili(e, nome));
      const nuovi = piattiT.filter(p => p.disponibile);
      nuovi.forEach(p => { p.disponibile = false; });
      const parti = [];
      if (nuovi.length) parti.push(`Esaurito: ${nomi(nuovi)}`);
      else if (piattiT.length) parti.push(`Già non disponibile: ${nomi(piattiT)}`);
      if (giornoT.length) {
        stato.giorno = stato.giorno.filter(e => !simili(e, nome));
        parti.push(`Tolto dai piatti del giorno: ${giornoT.join('; ')}`);
      }
      if (!parti.length) return NO(`Non trovo nessun piatto o vino chiamato "${nome}". Non ho cambiato nulla.`);
      return { messaggio: parti.join(' — '), modificato: nuovi.length > 0 || giornoT.length > 0 };
    }

    case 'ripristina': {
      const trovati = elenco(menu).filter(x => !x.voce.disponibile && simili(x.voce.nome, nome));
      if (!trovati.length) return NO(`"${nome}" non risulta tra gli esauriti.`);
      trovati.forEach(x => { x.voce.disponibile = true; });
      return { messaggio: `Di nuovo disponibile: ${nomi(trovati)}`, modificato: true };
    }

    case 'ripristina_tutto': {
      const tutti = elenco(menu).filter(x => !x.voce.disponibile);
      const ripristinabili = tutti.filter(x => !x.voce.nota);
      const restano = tutti.length - ripristinabili.length;
      if (!ripristinabili.length) {
        return NO(tutti.length
          ? `Restano ${restano} voci con una nota (es. "in arrivo"): riattivale una per una dal menu.`
          : "Non c'era nulla di esaurito.");
      }
      ripristinabili.forEach(x => { x.voce.disponibile = true; });
      return {
        messaggio: `Di nuovo disponibili: ${ripristinabili.length}.` +
          (restano ? ` ${restano} voci con una nota (es. "in arrivo") restano non disponibili.` : ''),
        modificato: true,
      };
    }

    // ---------- Azioni dai pulsanti della pagina ----------
    case 'disponibilita': {
      const lista = listaDi(menu, dati.tipo);
      const voce = lista && lista.find(x => x.id === dati.id);
      if (!voce) return NO('Voce non trovata.');
      voce.disponibile = !!dati.disponibile;
      return { messaggio: `${voce.nome}: ${voce.disponibile ? 'di nuovo disponibile' : 'segnato come esaurito'}`, modificato: true };
    }

    case 'salva_voce': {
      const lista = listaDi(menu, dati.tipo);
      if (!lista) return NO('Tipo di voce non valido.');
      const grezza = dati.voce || {};
      const esistente = Number.isInteger(grezza.id) ? lista.find(x => x.id === grezza.id) : null;
      const pulita = normalizzaVoce(dati.tipo, grezza, esistente ? esistente.id : maxId(lista) + 1);
      if (!pulita) return NO('Il nome è obbligatorio.');
      if (esistente) {
        if (grezza.disponibile === undefined) pulita.disponibile = esistente.disponibile;
        lista[lista.indexOf(esistente)] = pulita;
        return { messaggio: `Salvato: ${pulita.nome}`, modificato: true };
      }
      lista.push(pulita);
      return { messaggio: `Aggiunto al menu: ${pulita.nome}`, modificato: true };
    }

    case 'elimina_voce': {
      const lista = listaDi(menu, dati.tipo);
      const voce = lista && lista.find(x => x.id === dati.id);
      if (!voce) return NO('Voce non trovata.');
      lista.splice(lista.indexOf(voce), 1);
      return { messaggio: `Eliminato dal menu: ${voce.nome}`, modificato: true };
    }

    case 'importa_menu': {
      const nuovo = normalizzaMenu(dati.menu);
      if (!nuovo.piatti.length && !nuovo.vini.length) return NO('Il file non contiene né piatti né vini.');
      stato.menu = nuovo;
      return { messaggio: `Menu importato: ${nuovo.piatti.length} piatti e ${nuovo.vini.length} vini.`, modificato: true };
    }

    default:
      return NO('Azione non valida.');
  }
}
