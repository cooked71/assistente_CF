import { leggiMenu, menuBase } from '../../lib/menu.mjs';

const LINGUE = { it: 'italiano', en: 'inglese', fr: 'francese', de: 'tedesco', es: 'spagnolo' };

const VOCI = {
  livia: ['aura-2-livia-it', 'it'], cinzia: ['aura-2-cinzia-it', 'it'], melia: ['aura-2-melia-it', 'it'],
  maia: ['aura-2-maia-it', 'it'], demetra: ['aura-2-demetra-it', 'it'],
  flavio: ['aura-2-flavio-it', 'it'], elio: ['aura-2-elio-it', 'it'], cesare: ['aura-2-cesare-it', 'it'], dionisio: ['aura-2-dionisio-it', 'it'],
  thalia: ['aura-2-thalia-en', 'en'], apollo: ['aura-2-apollo-en', 'en'],
  agathe: ['aura-2-agathe-fr', 'fr'], hector: ['aura-2-hector-fr', 'fr'],
  viktoria: ['aura-2-viktoria-de', 'de'], julius: ['aura-2-julius-de', 'de'],
  celeste: ['aura-2-celeste-es', 'es'], nestor: ['aura-2-nestor-es', 'es'],
};
const VOCE_PREDEFINITA = { it: 'livia', en: 'thalia', fr: 'agathe', de: 'viktoria', es: 'celeste' };

const FRASE_PROVA = {
  it: "Buongiorno, sono l'assistente di Fonte La Tavola. Come posso aiutarla?",
  en: "Good day, I'm the assistant of Fonte La Tavola. How can I help you?",
  fr: "Bonjour, je suis l'assistant de Fonte La Tavola. Comment puis-je vous aider ?",
  de: "Guten Tag, ich bin der Assistent von Fonte La Tavola. Wie kann ich Ihnen helfen?",
  es: "Buenos días, soy el asistente de Fonte La Tavola. ¿En qué posso aiutarle?",
};

const MSG = {
  it: { config: 'Errore configurazione: Variabili o Bindings KV mancanti su Cloudflare.', anteprima: 'Anteprima non disponibile.', vuoto: 'Scrivi o dì qualcosa e ti rispondo volentieri.', errore: 'Mi dispiace, ho avuto un problema tecnico. Riprova tra qualche secondo.' },
  en: { config: 'Configuration error: API keys or KV bindings missing on Cloudflare.', anteprima: 'Preview not available.', vuoto: 'Type or say something and I will gladly answer.', errore: 'Sorry, I hit a technical issue. Please try again in a moment.' }
};

const json = (oggetto, status = 200) =>
  new Response(JSON.stringify(oggetto), { status, headers: { 'Content-Type': 'application/json' } });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function normalizzaTesto(t) {
  return String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’‘`´]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function filtraVini(vini, domanda) {
  const q = normalizzaTesto(domanda);
  const vuoleRosso = /(rosso|rossi)/.test(q);
  const vuoleBianco = /(bianco|bianchi)/.test(q);
  const vuoleRosato = /(rosato|rose|rosè)/.test(q);
  const vuoleFrancia = /(francia|francesi)/.test(q);
  const vuoleAbruzzo = /(abruzzo|abruzzesi)/.test(q);

  return vini.filter(v => {
    const tipo = normalizzaTesto(v.tipo);
    const regione = normalizzaTesto(v.regione);

    let okTipo = true;
    if (vuoleRosso) okTipo = okTipo && /(rosso|rossa)/.test(tipo);
    if (vuoleBianco) okTipo = okTipo && /(bianco|bianchi)/.test(tipo);
    if (vuoleRosato) okTipo = okTipo && /(rosato|rose|rosè)/.test(tipo);

    const cercaColore = /(rosso|rossi|bianco|bianchi|rosato|rose|rosè)/.test(q);
    if (cercaColore && !(
      (vuoleRosso && /(rosso|rossa)/.test(tipo)) ||
      (vuoleBianco && /(bianco|bianchi)/.test(tipo)) ||
      (vuoleRosato && /(rosato|rose|rosè)/.test(tipo))
    )) {
      okTipo = false;
    }

    let okRegione = true;
    if (vuoleFrancia) okRegione = okRegione && /francia/.test(regione);
    if (vuoleAbruzzo) okRegione = okRegione && /abruzzo/.test(regione);

    return okTipo && okRegione;
  });
}

function filtraViniSeNecessario(vini, domanda) {
  const q = normalizzaTesto(domanda);
  if (!q) return vini;
  const richiedeSpecifica = /(rosso|rossi|bianco|bianchi|rosato|rose|rosè|abruzzo|abruzzesi|francia|francesi|toscana|piemonte|veneto|friuli|lazio|puglia|sicilia|campania|lombardia|trentino)/.test(q);
  if (!richiedeSpecifica) return vini;
  return filtraVini(vini, q);
}

function espandiDomandaConContesto(domanda, storico) {
  const q = String(domanda || '').trim();
  if (!q) return domanda;

  const precedente = Array.isArray(storico)
    ? [...storico].reverse().find(m => m && m.role === 'user')
    : null;
  const testoPrecedente = precedente ? String(precedente.content || '') : '';
  const prevLower = testoPrecedente.toLowerCase();

  const shortColor = /^(rosso|rossi|bianco|bianchi|rosato|rosati|rose|rosè)$/i.test(q);
  const shortRegion = /^(abruzzo|abruzzesi|francia|francesi|toscana|piemonte|veneto|friuli|lazio|puglia|sicilia|campania|lombardia|trentino)$/i.test(q);

  const prevColore = /(rosso|rossi|bianco|bianchi|rosato|rosati|rose|rosè)/i.exec(prevLower)?.[1]?.toLowerCase();
  const prevRegione = /(abruzzo|abruzzesi|francia|francesi|toscana|piemonte|veneto|friuli|lazio|puglia|sicilia|campania|lombardia|trentino)/i.exec(prevLower)?.[1]?.toLowerCase();

  if (shortColor && prevRegione) return "vini " + q.toLowerCase() + " " + prevRegione + " disponibili oggi";
  if (shortRegion && prevColore) return "vini " + prevColore + " " + q.toLowerCase() + " disponibili oggi";

  return q;
}

async function sintetizza(testo, voceScelta, lingua, chiave) {
  const voceOk = VOCI[voceScelta] && VOCI[voceScelta][1] === lingua;
  const modello = voceOk ? VOCI[voceScelta][0] : VOCI[VOCE_PREDEFINITA[lingua]][0];

  const pulito = testo
    .replace(/[*_#`>~|]+/g, ' ')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/(\d+),00\b/g, '$1')
    .replace(/€/g, ' euro')
    .replace(/\s+/g, ' ')
    .trim();

  const r = await fetch("https://api.deepgram.com/v1/speak?model=" + encodeURIComponent(modello), {
    method: 'POST',
    headers: { 'Authorization': "Token " + chiave, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: pulito })
  });
  if (!r.ok) throw new Error("Errore TTS Deepgram");
  
  const buffer = await r.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

async function chiediGroq(systemPrompt, storico, domandaFinale, chiave, tentativi = 3) {
  let ultimoErrore = null;
  for (let i = 0; i < tentativi; i++) {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': "Bearer " + chiave, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          reasoning_effort: 'medium',
          messages: [{ role: 'system', content: systemPrompt }, ...storico, { role: 'user', content: domandaFinale }],
          temperature: 0.5,
        })
      });
      const dati = await r.json();
      if (!r.ok) throw new Error(dati.error?.message || 'Errore Groq');
      const testo = dati.choices?.[0]?.message?.content;
      if (!testo || !testo.trim()) throw new Error('Risposta Groq vuota');
      return testo;
    } catch (e) {
      ultimoErrore = e;
      console.error(`Tentativo ${i + 1}/${tentativi} fallito:`, e.message);
      if (i < tentativi - 1) await sleep(800 * (i + 1)); // 800ms, 1600ms
    }
  }
  throw ultimoErrore;
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let corpo = {};
  try { corpo = await request.json(); } catch (e) {}
  const { messaggio = '', voce: voceScelta, audio: vuoleAudio = false, anteprima = false, lingua: linguaRichiesta, storico: storicoClient = [] } = corpo;
  
  const lingua = LINGUE[linguaRichiesta] ? linguaRichiesta : 'it';
  const msg = MSG[lingua] || MSG['it'];
  
  const GROQ_API_KEY = env.GROQ_API_KEY;
  const DEEPGRAM_API_KEY = env.DEEPGRAM_API_KEY;

  if (!GROQ_API_KEY || !DEEPGRAM_API_KEY || !env.MENU_STORE) {
    return json({ risposta: msg.config }, 500);
  }

  if (anteprima) {
    try {
      return json({ audio: await sintetizza(FRASE_PROVA[lingua], voceScelta, lingua, DEEPGRAM_API_KEY) });
    } catch (e) {
      return json({ risposta: msg.anteprima });
    }
  }
  
  const domanda = String(messaggio).slice(0, 500);
  if (!domanda.trim()) return json({ risposta: msg.vuoto }, 400);

  const storico = Array.isArray(storicoClient) ? storicoClient.slice(-12) : [];
  const domandaFinale = espandiDomandaConContesto(domanda, storico);

  let menu = null;
  let piattiDelGiorno = [];
  try {
    const rawData = await env.MENU_STORE.get("stato_ristorante");
    if (rawData) {
      const data = JSON.parse(rawData);
      menu = leggiMenu(data.menu);
      piattiDelGiorno = Array.isArray(data.piatti_del_giorno) ? data.piatti_del_giorno : [];
    }
  } catch (error) {
    console.error('Errore lettura KV:', error);
  }

  if (!menu) menu = menuBase([]);

  const piattiEsauriti = menu.piatti.filter(p => !p.disponibile).map(p => p.nome);
  const viniEsauriti = menu.vini.filter(v => !v.disponibile).map(v => v.nome);

  const vociGiorno = piattiDelGiorno.map(nome => ({
    nome, categoria: 'PIATTO DEL GIORNO', prezzo: 'chiedere al personale', allergeni: 'Chiedere al personale'
  }));
  const piattiPerIlModello = [
    ...vociGiorno,
    ...menu.piatti.filter(p => p.disponibile).map(({ nome, categoria, prezzo, allergeni }) => ({ nome, categoria, prezzo, allergeni })),
  ];
  
  const viniDisponibili = menu.vini.filter(v => v.disponibile);
  const viniPerIlModello = filtraViniSeNecessario(viniDisponibili, domandaFinale)
    .map(({ nome, tipo, regione, prezzo }) => ({ nome, tipo, regione, prezzo }));

  const piattiGiornoTesto = piattiDelGiorno.length ? "Oggi i piatti del giorno sono: " + piattiDelGiorno.join('; ') + "." : "Oggi non ci sono piatti del giorno.";
  const piattiEsauritiTesto = piattiEsauriti.length ? piattiEsauriti.join('; ') : "Nessuno";
  const viniEsauritiTesto = viniEsauriti.length ? viniEsauriti.join('; ') : "Nessuno";

  const systemPrompt = `
Sei il Maître Sommelier di "Fonte La Tavola". Tono cordiale, sicuro, mai saccente. Rispondi SEMPRE in ${LINGUE[lingua]}, mantenendo in italiano i nomi di piatti e vini.

PIATTI: quando l'ospite cita un piatto o una categoria ("agnello", "brace", "pesce"), cita TUTTI i piatti del menu che vi rientrano (es. "agnello" → carré e stinco; "brace" → tagliata, carré, costine). Se non ha ancora scelto, chiedigli cosa mangia.

VINI: consiglia UN solo vino, spiegando in una frase il perché. Massimo 3-4 frasi totali.

STATO:
- ${piattiGiornoTesto}
- NON disponibili oggi — piatti: ${piattiEsauritiTesto}; vini: ${viniEsauritiTesto}.
- Piatti disponibili: ${JSON.stringify(piattiPerIlModello)}
- Vini disponibili: ${JSON.stringify(viniPerIlModello)}

ABBINAMENTI: corpo con corpo, acidità con acidità, grasso con tannino. Se l'ospite scrive solo un colore o una regione, usa lo storico.
`;

  try {
    const testoRisposta = await chiediGroq(systemPrompt, storico, domandaFinale, GROQ_API_KEY);
    let audio = null;
    if (vuoleAudio) {
      audio = await sintetizza(testoRisposta, voceScelta, lingua, DEEPGRAM_API_KEY).catch(() => null);
    }
    return json({ risposta: testoRisposta, audio });
  } catch (error) {
    console.error('Errore esecuzione API:', error);
    return json({ risposta: msg.errore });
  }
}
