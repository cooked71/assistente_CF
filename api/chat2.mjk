import { leggiMenu, menuBase } from '../lib/menu.mjs';

export const config = { runtime: 'edge' };

// Lingue supportate (Deepgram Aura-2 ha voci per tutte queste)
const LINGUE = { it: 'italiano', en: 'inglese', fr: 'francese', de: 'tedesco', es: 'spagnolo' };

// Voci selezionabili dal cliente: chiave -> [modello Deepgram, lingua]. Il server accetta solo queste.
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

// Frase fissa dell'anteprima voce e messaggi di errore, per lingua
const FRASE_PROVA = {
  it: "Buongiorno, sono l'assistente di Fonte La Tavola. Come posso aiutarla?",
  en: "Good day, I'm the assistant of Fonte La Tavola. How can I help you?",
  fr: "Bonjour, je suis l'assistant de Fonte La Tavola. Comment puis-je vous aider ?",
  de: "Guten Tag, ich bin der Assistent von Fonte La Tavola. Wie kann ich Ihnen helfen?",
  es: "Buenos días, soy el asistente de Fonte La Tavola. ¿En qué puedo ayudarle?",
};
const MSG = {
  it: { config: 'Errore config: Chiavi API o Token mancanti su Vercel.', anteprima: 'Anteprima non disponibile.', vuoto: 'Scrivi o dì qualcosa e ti rispondo volentieri.', errore: 'Mi dispiace, ho avuto un problema tecnico. Puoi ripetere?' },
  en: { config: 'Configuration error: API keys or tokens are missing on Vercel.', anteprima: 'Preview not available.', vuoto: 'Type or say something and I will gladly answer.', errore: 'Sorry, I had a technical problem. Could you repeat that?' },
  fr: { config: 'Erreur de configuration : clés API ou jetons manquants sur Vercel.', anteprima: 'Aperçu indisponible.', vuoto: 'Écrivez ou dites quelque chose et je vous répondrai volontiers.', errore: "Désolé, j'ai eu un problème technique. Pouvez-vous répéter ?" },
  de: { config: 'Konfigurationsfehler: API-Schlüssel oder Token fehlen auf Vercel.', anteprima: 'Vorschau nicht verfügbar.', vuoto: 'Schreiben oder sagen Sie etwas, ich antworte gern.', errore: 'Entschuldigung, es gab ein technisches Problem. Können Sie das wiederholen?' },
  es: { config: 'Error de configuración: faltan claves API o tokens en Vercel.', anteprima: 'Vista previa no disponible.', vuoto: 'Escriba o diga algo y con gusto le respondo.', errore: 'Lo siento, he tenido un problema técnico. ¿Puede repetirlo?' },
};

const json = (oggetto, status = 200) =>
  new Response(JSON.stringify(oggetto), { status, headers: { 'Content-Type': 'application/json' } });

function inBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

// Trasforma il testo in audio (mp3 in base64) con la voce scelta
async function sintetizza(testo, voceScelta, lingua, chiave) {
  // La voce scelta deve appartenere alla lingua; altrimenti si usa quella predefinita della lingua
  const voceOk = VOCI[voceScelta] && VOCI[voceScelta][1] === lingua;
  const modello = voceOk
    ? VOCI[voceScelta][0]
    : (lingua === 'it' && process.env.DEEPGRAM_VOICE) || VOCI[VOCE_PREDEFINITA[lingua]][0];
  // Toglie simboli, emoji e markdown che la sintesi vocale legge male
  const pulito = testo
    .replace(/[*_#`>~|]+/g, ' ')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/(\d+),00\b/g, '$1')
    .replace(/€/g, ' euro')
    .replace(/\s+/g, ' ')
    .trim();

  const r = await fetch(`https://api.deepgram.com/v1/speak?model=${encodeURIComponent(modello)}`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${chiave}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: pulito })
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.err_msg || err.error || `Errore TTS Deepgram (${r.status})`);
  }
  return inBase64(await r.arrayBuffer());
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Metodo non consentito' }), { status: 405 });
  }

  let corpo = {};
  try { corpo = await req.json(); } catch (e) {}
  const { messaggio = '', voce: voceScelta, audio: vuoleAudio = false, anteprima = false, lingua: linguaRichiesta } = corpo;
  const lingua = LINGUE[linguaRichiesta] ? linguaRichiesta : 'it';
  const msg = MSG[lingua];
  const domanda = String(messaggio).slice(0, 500);
  const GROQ_API_KEY = process.env.GROQ_API_KEY; 
  const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
  const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
  const EDGE_CONFIG_ID = process.env.EDGE_CONFIG_ID;
  
  if (!GROQ_API_KEY || !DEEPGRAM_API_KEY || !VERCEL_API_TOKEN || !EDGE_CONFIG_ID) {
    return new Response(JSON.stringify({ risposta: msg.config }), { status: 500 });
  }

  // Anteprima della voce scelta (frase fissa, nessuna chiamata a Groq)
  if (anteprima) {
    try {
      return json({ audio: await sintetizza(FRASE_PROVA[lingua], voceScelta, lingua, DEEPGRAM_API_KEY) });
    } catch (e) {
      console.error('Errore anteprima voce:', e);
      return json({ risposta: msg.anteprima });
    }
  }
  if (!domanda.trim()) return json({ risposta: msg.vuoto }, 400);

  // 1. Leggi i dati in tempo reale da Edge Config
  let menu = null;
  let piattiDelGiorno = [];
  let esauritiVecchioSistema = [];
  const lista = (v) => (Array.isArray(v) ? v.filter(x => typeof x === 'string' && x.trim()) : []);

  try {
    const team = process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : '';
    const configResponse = await fetch(`https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/items${team}`, {
      headers: {
        'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (configResponse.ok) {
      const raw = await configResponse.json();
      // L'API di gestione restituisce un array [{key, value}, ...]
      const data = Array.isArray(raw) ? Object.fromEntries(raw.map(i => [i.key, i.value])) : raw;
      menu = leggiMenu(data.menu);
      esauritiVecchioSistema = lista(data.piatti_esauriti);
      piattiDelGiorno = lista(data.piatti_del_giorno);
      // compatibilità con la vecchia chiave a singolo piatto
      if (!piattiDelGiorno.length && typeof data.piatto_del_giorno === 'string' && data.piatto_del_giorno.trim()
          && !data.piatto_del_giorno.startsWith('Nessun piatto')) {
        piattiDelGiorno = [data.piatto_del_giorno.trim()];
      }
    } else {
      console.error("Risposta API Edge Config non valida:", configResponse.status);
    }
  } catch (error) {
    console.error("Errore lettura Edge Config tramite Fetch:", error);
  }

  // Se il menu non è ancora stato salvato da gestione.html, si usa quello di lib/menu.mjs
  if (!menu) menu = menuBase(esauritiVecchioSistema);

  // 2. Separa disponibili e non disponibili
  const piattiEsauriti = menu.piatti.filter(p => !p.disponibile).map(p => p.nome);
  const viniEsauriti = menu.vini.filter(v => !v.disponibile).map(v => v.nome);

  // I piatti del giorno entrano nella lista dei piatti, così il modello li "vede" come gli altri
  const vociGiorno = piattiDelGiorno.map(nome => ({
    nome, categoria: "PIATTO DEL GIORNO", prezzo: "chiedere al personale", allergeni: "Chiedere al personale"
  }));
  const piattiPerIlModello = [
    ...vociGiorno,
    ...menu.piatti.filter(p => p.disponibile).map(({ nome, categoria, prezzo, allergeni }) => ({ nome, categoria, prezzo, allergeni })),
  ];
  const viniPerIlModello = menu.vini
    .filter(v => v.disponibile)
    .map(({ nome, tipo, regione, prezzo }) => ({ nome, tipo, regione, prezzo }));

  const systemPrompt = `
    Sei l'assistente virtuale del ristorante "Fonte La Tavola". 
    Il tuo tono è cordiale, professionale e appassionato.
    LINGUA: rispondi SEMPRE in ${LINGUE[lingua]}, qualunque sia la lingua del menu o della domanda. Mantieni in italiano i nomi dei piatti e dei vini (puoi aggiungere una breve spiegazione nella lingua del cliente). I prezzi sono in euro.
    
    ${piattiDelGiorno.length
      ? `Oggi i piatti del giorno (fuori dal menu fisso) sono: ${piattiDelGiorno.join('; ')}.`
      : 'Oggi non ci sono piatti del giorno.'}
    
    ATTENZIONE: i seguenti piatti NON SONO DISPONIBILI oggi: ${piattiEsauriti.length ? piattiEsauriti.join('; ') : 'Nessuno'}.
    I seguenti vini NON SONO DISPONIBILI oggi: ${viniEsauriti.length ? viniEsauriti.join('; ') : 'Nessuno'}.
    Non proporli assolutamente. Se un cliente ti chiede un piatto o un vino che non è nella lista dei disponibili, scusati e suggerisci un'alternativa.
    
    Ecco il menu dei piatti DISPONIBILI (prezzi in euro):
    ${JSON.stringify(piattiPerIlModello)}
    
    Ecco i vini ATTUALMENTE DISPONIBILI (prezzi in euro):
    ${JSON.stringify(viniPerIlModello)}
    
    REGOLE FONDAMENTALI:
    1. Se un cliente chiede informazioni su allergeni non presenti, digli, nella sua lingua, che per sicurezza deve chiedere sempre conferma al personale in sala.
    2. Consiglia SOLO i vini presenti nella lista dei disponibili.
    3. Sii conciso, massimo 2-3 frasi. Il testo verrà letto ad alta voce.
    4. I piatti del giorno fanno parte del menu a tutti gli effetti. Quando il cliente chiede di un ingrediente o di una portata (es. "funghi", "carne", "primi"), considera TUTTI i piatti pertinenti nella lista, piatti del giorno compresi, e citali sempre per primi se pertinenti.
    5. Scrivi in italiano semplice e parlato: niente elenchi puntati, asterischi, emoji o simboli. Scrivi i prezzi con la parola euro (es. "12 euro").
    6. La carta dei vini è ampia: consiglia al massimo 2 o 3 vini alla volta, adatti al piatto o alla richiesta, indicando il prezzo.
  `;

  try {
    // 3. Groq per il testo
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        reasoning_effort: 'low',
        messages: [ { role: 'system', content: systemPrompt }, { role: 'user', content: domanda } ],
        temperature: 0.5,
      })
    });

    const groqData = await groqResponse.json();
    if (!groqResponse.ok) throw new Error(groqData.error?.message || 'Errore Groq');
    
    const testoRisposta = groqData.choices[0].message.content;

    // 4. Voce (solo se richiesta): se fallisce, il testo viene comunque restituito
    let audio = null;
    if (vuoleAudio) {
      try {
        audio = await sintetizza(testoRisposta, voceScelta, lingua, DEEPGRAM_API_KEY);
      } catch (e) {
        console.error('Errore TTS:', e);
      }
    }
    return json({ risposta: testoRisposta, audio });

  } catch (error) {
    console.error('Errore:', error);
    return json({ risposta: msg.errore });
  }
}
