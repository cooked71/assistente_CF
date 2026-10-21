import { interpreta, applica } from '../../lib/logica.mjs';
import { leggiMenu, menuBase } from '../../lib/menu.mjs';

const CODICE = "fonte2024"; 

export async function onRequest(context) {
  const { request, env } = context;
  
  if (request.headers.get('x-codice') !== (env.GESTIONE_PASSWORD || CODICE)) {
    return new Response(JSON.stringify({ messaggio: 'Codice errato' }), { status: 401 });
  }

  let giorno = [];
  let menu = null;

  try {
    const rawData = await env.MENU_STORE.get("stato_ristorante");
    if (rawData) {
      const data = JSON.parse(rawData);
      giorno = Array.isArray(data.piatti_del_giorno) ? data.piatti_del_giorno : [];
      menu = leggiMenu(data.menu);
    }
  } catch (e) {
    console.error("Errore lettura KV:", e);
  }

  if (!menu) menu = menuBase([]);
  const stato = { giorno, menu };

  if (request.method === 'GET') {
    return new Response(JSON.stringify({ report: stato }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (request.method === 'POST') {
    try {
      const corpo = await request.json();
      const { comando, azione, ...dati } = corpo || {};
      
      const richiesta = azione ? { azione, ...dati } : interpreta(comando);
      if (!richiesta) {
        return new Response(JSON.stringify({
          messaggio: 'Non ho capito. Prova: "Piatto del giorno: ...", "Tagliata esaurita", "Ripristina tutto".',
          report: stato
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      const { azione: tipoAzione, ...parametri } = richiesta;
      const { messaggio, modificato } = applica(stato, tipoAzione, parametri);

      if (modificato) {
        const payload = {
          menu: stato.menu,
          piatti_del_giorno: stato.giorno,
          piatti_esauriti: [] 
        };
        await env.MENU_STORE.put("stato_ristorante", JSON.stringify(payload));
      }

      return new Response(JSON.stringify({ messaggio, report: stato }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ messaggio: 'Errore interno del server.' }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ messaggio: 'Metodo non consentito' }), { status: 405 });
}