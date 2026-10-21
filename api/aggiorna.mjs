// api/aggiorna.mjs — gestione di piatti del giorno, piatti esauriti e vini esauriti
import { interpreta, applica } from '../lib/logica.mjs';
import { leggiMenu, menuBase } from '../lib/menu.mjs';

export const config = { runtime: 'nodejs' };

// Per cambiare il codice di accesso: variabile d'ambiente GESTIONE_PASSWORD su Vercel
const CODICE = process.env.GESTIONE_PASSWORD || 'fonte2024';

const urlItems = (id) =>
  `https://api.vercel.com/v1/edge-config/${id}/items` +
  (process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : '');

const lista = (v) => (Array.isArray(v) ? v.filter(x => typeof x === 'string' && x.trim()) : []);

async function leggi(id, token) {
  const r = await fetch(urlItems(id), { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!r.ok) throw new Error(`Lettura Edge Config fallita (${r.status}): ${await r.text()}`);
  const raw = await r.json();
  const o = Array.isArray(raw) ? Object.fromEntries(raw.map(i => [i.key, i.value])) : raw;

  let giorno = lista(o.piatti_del_giorno);
  // compatibilità con la vecchia chiave a singolo piatto
  if (!giorno.length && typeof o.piatto_del_giorno === 'string' && o.piatto_del_giorno.trim()
      && !o.piatto_del_giorno.startsWith('Nessun piatto')) {
    giorno = [o.piatto_del_giorno.trim()];
  }
  // Menu salvato; se non c'è ancora si parte da quello di lib/menu.mjs
  const menu = leggiMenu(o.menu) || menuBase(lista(o.piatti_esauriti));
  return { giorno, menu };
}

async function scrivi(id, token, stato) {
  const r = await fetch(urlItems(id), {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        { operation: 'upsert', key: 'menu', value: stato.menu },
        { operation: 'upsert', key: 'piatti_del_giorno', value: stato.giorno },
        // chiavi del vecchio sistema: ora la disponibilità sta dentro il menu
        { operation: 'upsert', key: 'piatti_esauriti', value: [] },
        { operation: 'upsert', key: 'vini_esauriti', value: [] },
        { operation: 'upsert', key: 'piatto_del_giorno', value: '' },
      ],
    }),
  });
  if (!r.ok) throw new Error(`Scrittura Edge Config fallita (${r.status}): ${await r.text()}`);
}

export default async function handler(req, res) {
  const token = process.env.VERCEL_API_TOKEN;
  const id = process.env.EDGE_CONFIG_ID;
  if (!token || !id) return res.status(500).json({ messaggio: 'Errore config: VERCEL_API_TOKEN o EDGE_CONFIG_ID mancanti.' });

  if (req.headers['x-codice'] !== CODICE) return res.status(401).json({ messaggio: 'Codice errato' });

  try {
    const stato = await leggi(id, token);

    if (req.method === 'GET') return res.status(200).json({ report: stato });
    if (req.method !== 'POST') return res.status(405).json({ messaggio: 'Metodo non consentito' });

    const { comando, azione, ...dati } = req.body || {};
    const richiesta = azione ? { azione, ...dati } : interpreta(comando);
    if (!richiesta) {
      return res.status(200).json({
        messaggio: 'Non ho capito. Prova: "Piatto del giorno: ...", "Tagliata esaurita", "Ripristina tagliata".',
        report: stato,
      });
    }

    const { azione: tipoAzione, ...parametri } = richiesta;
    const { messaggio, modificato } = applica(stato, tipoAzione, parametri);
    if (modificato) await scrivi(id, token, stato);
    return res.status(200).json({ messaggio, report: stato });
  } catch (e) {
    console.error('Errore aggiorna:', e);
    return res.status(500).json({ messaggio: 'Errore di comunicazione con Vercel. Controlla i log.' });
  }
}
