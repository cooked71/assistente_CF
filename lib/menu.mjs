// Menu di partenza + funzioni di utilità condivise da api/chat.mjs e api/aggiorna.mjs.
// Il menu "vivo" è salvato in Edge Config (chiave "menu") e si modifica da gestione.html:
// questo file serve solo come copia di partenza, finché il menu non viene salvato la prima volta.
export const MENU_BASE = {
  "piatti": [
    {
      "id": 1,
      "nome": "Funghi porcini arrosto",
      "categoria": "Antipasti",
      "prezzo": "16,00",
      "allergeni": "Nessuno segnalato",
      "disponibile": true
    },
    {
      "id": 2,
      "nome": "Millefoglie di pane Carasau con carciofi, scamorza di bufala e speck",
      "categoria": "Antipasti",
      "prezzo": "12,00",
      "allergeni": "Glutine, Latte",
      "disponibile": true
    },
    {
      "id": 3,
      "nome": "Uovo pochè con crema di patate e zafferano, guanciale, pecorino romano",
      "categoria": "Antipasti",
      "prezzo": "11,00",
      "allergeni": "Uova, Latte",
      "disponibile": true
    },
    {
      "id": 4,
      "nome": "Selezione di salumi affettati e formaggi (per 2 persone)",
      "categoria": "Antipasti",
      "prezzo": "22,00",
      "allergeni": "Latte",
      "disponibile": true
    },
    {
      "id": 5,
      "nome": "Carpaccio di manzo con crema di formaggio, confettura di frutta, mix di crescioni e scaglie di parmigiano",
      "categoria": "Antipasti",
      "prezzo": "15,00",
      "allergeni": "Latte",
      "disponibile": true
    },
    {
      "id": 6,
      "nome": "L’alternativa (per 2 persone): Alici del mar Cantabrico, mozzarella, burro di Normandia e crostini",
      "categoria": "Antipasti",
      "prezzo": "22,00",
      "allergeni": "Pesce, Latte, Glutine",
      "disponibile": true
    },
    {
      "id": 7,
      "nome": "Tagliolini con ragù all’Abruzzese",
      "categoria": "Primi piatti",
      "prezzo": "12,00",
      "allergeni": "Glutine, Latte, Uova",
      "disponibile": true
    },
    {
      "id": 8,
      "nome": "Spaghettone cacio e pepi",
      "categoria": "Primi piatti",
      "prezzo": "12,00",
      "allergeni": "Glutine, Latte",
      "disponibile": true
    },
    {
      "id": 9,
      "nome": "Stringoli (acqua e farina) con ragu di agnello in bianco",
      "categoria": "Primi piatti",
      "prezzo": "13,00",
      "allergeni": "Glutine, Latte",
      "disponibile": true
    },
    {
      "id": 10,
      "nome": "Tortelli ripieni di ricotta, pecorino di Pienza e pinoli, con carciofi e mandorle tostate",
      "categoria": "Primi piatti",
      "prezzo": "12,00",
      "allergeni": "Glutine, Latte, Uova, Frutta secca",
      "disponibile": true
    },
    {
      "id": 11,
      "nome": "Gnocchi di patate al sugo di carne (maiale e pecora)",
      "categoria": "Primi piatti",
      "prezzo": "12,00",
      "allergeni": "Glutine, Latte, Uova",
      "disponibile": true
    },
    {
      "id": 12,
      "nome": "Garganelli (acqua e farina) con ragu’ in bianco di vitello e porcini",
      "categoria": "Primi piatti",
      "prezzo": "14,00",
      "allergeni": "Glutine, Latte",
      "disponibile": true
    },
    {
      "id": 13,
      "nome": "Tagliata di Manzo con rucola e crema di aceto balsamico",
      "categoria": "Secondi",
      "prezzo": "22,00",
      "allergeni": "Nessuno segnalato",
      "disponibile": true
    },
    {
      "id": 14,
      "nome": "Guanciale di vitello brasato al Montepulciano",
      "categoria": "Secondi",
      "prezzo": "17,00",
      "allergeni": "Vino",
      "disponibile": true
    },
    {
      "id": 15,
      "nome": "Carrè di agnello alla brace con verdure",
      "categoria": "Secondi",
      "prezzo": "19,00",
      "allergeni": "Nessuno segnalato",
      "disponibile": true
    },
    {
      "id": 16,
      "nome": "Stinco di agnello brasato al Cerasuolo",
      "categoria": "Secondi",
      "prezzo": "17,00",
      "allergeni": "Vino",
      "disponibile": true
    },
    {
      "id": 17,
      "nome": "Tagliatina di pollo fritto panato in salsa allo zenzero",
      "categoria": "Secondi",
      "prezzo": "12,00",
      "allergeni": "Glutine, Uova",
      "disponibile": true
    },
    {
      "id": 18,
      "nome": "Baccalà “Rafols” a modo nostro",
      "categoria": "Secondi",
      "prezzo": "22,00",
      "allergeni": "Pesce",
      "disponibile": true
    },
    {
      "id": 19,
      "nome": "Costine di maiale in doppia cottura",
      "categoria": "Secondi",
      "prezzo": "16,00",
      "allergeni": "Nessuno segnalato",
      "disponibile": true
    },
    {
      "id": 20,
      "nome": "Contorni del giorno",
      "categoria": "Secondi",
      "prezzo": "5,00",
      "allergeni": "Chiedere al personale",
      "disponibile": true
    },
    {
      "id": 21,
      "nome": "Passione e ragione",
      "categoria": "Desserts",
      "prezzo": "9,00",
      "allergeni": "Chiedere al personale",
      "disponibile": true
    },
    {
      "id": 22,
      "nome": "Croccante “Vintage”",
      "categoria": "Desserts",
      "prezzo": "6,00",
      "allergeni": "Chiedere al personale",
      "disponibile": true
    },
    {
      "id": 23,
      "nome": "Tartufo bianco con cuore alla nocciola",
      "categoria": "Desserts",
      "prezzo": "7,00",
      "allergeni": "Latte, Frutta secca",
      "disponibile": true
    },
    {
      "id": 24,
      "nome": "La Sfera, servita con crema calda al mou, cioccolato e nocciola",
      "categoria": "Desserts",
      "prezzo": "7,00",
      "allergeni": "Latte, Frutta secca",
      "disponibile": true
    },
    {
      "id": 25,
      "nome": "Dolci del giorno",
      "categoria": "Desserts",
      "prezzo": "6,00",
      "allergeni": "Chiedere al personale",
      "disponibile": true
    },
    {
      "id": 26,
      "nome": "Caffè",
      "categoria": "Bevande",
      "prezzo": "2,00",
      "allergeni": "Nessuno",
      "disponibile": true
    },
    {
      "id": 27,
      "nome": "Caffè e piccola pasticceria",
      "categoria": "Bevande",
      "prezzo": "6,00",
      "allergeni": "Chiedere al personale",
      "disponibile": true
    },
    {
      "id": 28,
      "nome": "Acqua Surgiva in vetro 0.75 lt.",
      "categoria": "Bevande",
      "prezzo": "2,50",
      "allergeni": "Nessuno",
      "disponibile": true
    },
    {
      "id": 29,
      "nome": "Pane e Coperto",
      "categoria": "Coperto",
      "prezzo": "3,00",
      "allergeni": "Glutine",
      "disponibile": true
    }
  ],
  "vini": [
    {
      "id": 1,
      "nome": "Franciacorta Saten (Antica Fratta)",
      "regione": "Lombardia",
      "tipo": "Bollicine",
      "prezzo": "40,00",
      "disponibile": true
    },
    {
      "id": 2,
      "nome": "Franciacorta Nature Dosage Zero (Antica Fratta)",
      "regione": "Lombardia",
      "tipo": "Bollicine",
      "prezzo": "40,00",
      "disponibile": true
    },
    {
      "id": 3,
      "nome": "Franciacorta Rosè (Antica Fratta)",
      "regione": "Lombardia",
      "tipo": "Bollicine",
      "prezzo": "42,00",
      "disponibile": true
    },
    {
      "id": 4,
      "nome": "’61 Nature Rosè (Berlucchi)",
      "regione": "Lombardia",
      "tipo": "Bollicine",
      "prezzo": "60,00",
      "disponibile": true
    },
    {
      "id": 5,
      "nome": "Vintage Collection Brut (Cà del Bosco)",
      "regione": "Lombardia",
      "tipo": "Bollicine",
      "prezzo": "70,00",
      "disponibile": true
    },
    {
      "id": 6,
      "nome": "Vittoria Rosè (Pasetti)",
      "regione": "Abruzzo",
      "tipo": "Bollicine",
      "prezzo": "25,00",
      "disponibile": true
    },
    {
      "id": 7,
      "nome": "Ribolla gialla metodo classico Brut (Puiatti)",
      "regione": "Friuli",
      "tipo": "Bollicine",
      "prezzo": "35,00",
      "disponibile": true
    },
    {
      "id": 8,
      "nome": "Ribolla gialla metodo classico Rosè (Puiatti)",
      "regione": "Friuli",
      "tipo": "Bollicine",
      "prezzo": "37,00",
      "disponibile": true
    },
    {
      "id": 9,
      "nome": "Moscato rosa spumante dolce (Forchir)",
      "regione": "Friuli",
      "tipo": "Bollicine",
      "prezzo": "0,00",
      "disponibile": false,
      "nota": "In arrivo nuova annata"
    },
    {
      "id": 10,
      "nome": "Spumante Cuvee Millesimo (Le Manzane)",
      "regione": "Veneto",
      "tipo": "Bollicine",
      "prezzo": "16,00",
      "disponibile": true
    },
    {
      "id": 11,
      "nome": "Roseo spumante rosè (Le Manzane)",
      "regione": "Veneto",
      "tipo": "Bollicine",
      "prezzo": "18,00",
      "disponibile": true
    },
    {
      "id": 12,
      "nome": "Lume Trebbiano d’Abruzzo (I Lauri)",
      "regione": "Abruzzo",
      "tipo": "Bianco",
      "prezzo": "18,00",
      "disponibile": true
    },
    {
      "id": 13,
      "nome": "Avalos Pecorino (I Lauri)",
      "regione": "Abruzzo",
      "tipo": "Bianco",
      "prezzo": "19,00",
      "disponibile": true
    },
    {
      "id": 14,
      "nome": "Gianni Trebbiano d’Abruzzo (Masciarelli)",
      "regione": "Abruzzo",
      "tipo": "Bianco",
      "prezzo": "20,00",
      "disponibile": true
    },
    {
      "id": 15,
      "nome": "Villa Gemma bianco (Masciarelli)",
      "regione": "Abruzzo",
      "tipo": "Bianco",
      "prezzo": "22,00",
      "disponibile": true
    },
    {
      "id": 16,
      "nome": "Testarossa Passerina (Pasetti)",
      "regione": "Abruzzo",
      "tipo": "Bianco",
      "prezzo": "20,00",
      "disponibile": true
    },
    {
      "id": 17,
      "nome": "Collecivetta Pecorino (Pasetti)",
      "regione": "Abruzzo",
      "tipo": "Bianco",
      "prezzo": "22,00",
      "disponibile": true
    },
    {
      "id": 18,
      "nome": "Roero Arneis DOCG (Gabriele Scaglione)",
      "regione": "Piemonte",
      "tipo": "Bianco",
      "prezzo": "30,00",
      "disponibile": true
    },
    {
      "id": 19,
      "nome": "Chardonnay (H-Lun - Girlan)",
      "regione": "Trentino Alto-Adige",
      "tipo": "Bianco",
      "prezzo": "26,00",
      "disponibile": true
    },
    {
      "id": 20,
      "nome": "Műller Thurgau (H-Lun - Girlan)",
      "regione": "Trentino Alto-Adige",
      "tipo": "Bianco",
      "prezzo": "27,00",
      "disponibile": true
    },
    {
      "id": 21,
      "nome": "Gewurztraminer (H-Lun - Girlan)",
      "regione": "Trentino Alto-Adige",
      "tipo": "Bianco",
      "prezzo": "30,00",
      "disponibile": true
    },
    {
      "id": 22,
      "nome": "Ribolla Gialla (Famiglia Bianchini Forchir)",
      "regione": "Friuli Venezia Giulia",
      "tipo": "Bianco",
      "prezzo": "25,00",
      "disponibile": true
    },
    {
      "id": 23,
      "nome": "Friulano Isonzo DOC (Sgubin Renzo)",
      "regione": "Friuli Venezia Giulia",
      "tipo": "Bianco",
      "prezzo": "27,00",
      "disponibile": true
    },
    {
      "id": 24,
      "nome": "Sauvignon Isonzo DOC (Sgubin Renzo)",
      "regione": "Friuli Venezia Giulia",
      "tipo": "Bianco",
      "prezzo": "28,00",
      "disponibile": true
    },
    {
      "id": 25,
      "nome": "Cervaro della Sala (Antinori)",
      "regione": "Toscana",
      "tipo": "Bianco",
      "prezzo": "0,00",
      "disponibile": false,
      "nota": "In arrivo nuova annata"
    },
    {
      "id": 26,
      "nome": "Cacchione (Casa Divina Provvidenza)",
      "regione": "Lazio",
      "tipo": "Bianco",
      "prezzo": "20,00",
      "disponibile": true
    },
    {
      "id": 27,
      "nome": "Roma DOP Bellone (Casa Divina Provvidenza)",
      "regione": "Lazio",
      "tipo": "Bianco",
      "prezzo": "24,00",
      "disponibile": true
    },
    {
      "id": 28,
      "nome": "Falanghina (Torre Varano)",
      "regione": "Campania",
      "tipo": "Bianco",
      "prezzo": "22,00",
      "disponibile": true
    },
    {
      "id": 29,
      "nome": "Greco DOC (Torre Varano)",
      "regione": "Campania",
      "tipo": "Bianco",
      "prezzo": "24,00",
      "disponibile": true
    },
    {
      "id": 30,
      "nome": "Fiano DOC (Torre Varano)",
      "regione": "Campania",
      "tipo": "Bianco",
      "prezzo": "24,00",
      "disponibile": true
    },
    {
      "id": 31,
      "nome": "Chiarandà Chardonnay (Donnafugata)",
      "regione": "Sicilia",
      "tipo": "Bianco",
      "prezzo": "0,00",
      "disponibile": false,
      "nota": "In arrivo nuova annata"
    },
    {
      "id": 32,
      "nome": "Chiola Cerasuolo (I Lauri)",
      "regione": "Abruzzo",
      "tipo": "Rosato",
      "prezzo": "18,00",
      "disponibile": true
    },
    {
      "id": 33,
      "nome": "Villa Gemma Cerasuolo (Masciarelli)",
      "regione": "Abruzzo",
      "tipo": "Rosato",
      "prezzo": "25,00",
      "disponibile": true
    },
    {
      "id": 34,
      "nome": "Gianni Masciarelli Cerasuolo (Masciarelli)",
      "regione": "Abruzzo",
      "tipo": "Rosato",
      "prezzo": "20,00",
      "disponibile": true
    },
    {
      "id": 35,
      "nome": "Testarossa rosato (Pasetti)",
      "regione": "Abruzzo",
      "tipo": "Rosato",
      "prezzo": "24,00",
      "disponibile": true
    },
    {
      "id": 36,
      "nome": "Veritas (Torrevento)",
      "regione": "Puglia",
      "tipo": "Rosato",
      "prezzo": "24,00",
      "disponibile": true
    },
    {
      "id": 37,
      "nome": "Divina Aeris (Divina Provvidenza)",
      "regione": "Lazio",
      "tipo": "Rosato",
      "prezzo": "26,00",
      "disponibile": true
    },
    {
      "id": 38,
      "nome": "Domaines Ott Chateau Romassan Bandol",
      "regione": "Francia",
      "tipo": "Rosato",
      "prezzo": "60,00",
      "disponibile": true
    },
    {
      "id": 39,
      "nome": "Bajo Montepulciano d’Abruzzo (I Lauri)",
      "regione": "Abruzzo",
      "tipo": "Rosso",
      "prezzo": "18,00",
      "disponibile": true
    },
    {
      "id": 40,
      "nome": "Gianni Montepulciano d’Abruzzo (Masciarelli)",
      "regione": "Abruzzo",
      "tipo": "Rosso",
      "prezzo": "23,00",
      "disponibile": true
    },
    {
      "id": 41,
      "nome": "Villa Gemma Montepulciano (Masciarelli)",
      "regione": "Abruzzo",
      "tipo": "Rosso",
      "prezzo": "70,00",
      "disponibile": true
    },
    {
      "id": 42,
      "nome": "Marina Cvetić Montepulciano (Masciarelli)",
      "regione": "Abruzzo",
      "tipo": "Rosso",
      "prezzo": "42,00",
      "disponibile": true
    },
    {
      "id": 43,
      "nome": "Marina Cvetić Merlot (Masciarelli)",
      "regione": "Abruzzo",
      "tipo": "Rosso",
      "prezzo": "42,00",
      "disponibile": true
    },
    {
      "id": 44,
      "nome": "Marina Cvetić Syrah (Masciarelli)",
      "regione": "Abruzzo",
      "tipo": "Rosso",
      "prezzo": "67,00",
      "disponibile": true
    },
    {
      "id": 45,
      "nome": "Iskra da uve Montepulciano (Masciarelli)",
      "regione": "Abruzzo",
      "tipo": "Rosso",
      "prezzo": "45,00",
      "disponibile": true
    },
    {
      "id": 46,
      "nome": "Testarossa Montepulciano riserva (Pasetti)",
      "regione": "Abruzzo",
      "tipo": "Rosso",
      "prezzo": "40,00",
      "disponibile": true
    },
    {
      "id": 47,
      "nome": "Dieci Coppe (Pasetti)",
      "regione": "Abruzzo",
      "tipo": "Rosso",
      "prezzo": "20,00",
      "disponibile": true
    },
    {
      "id": 48,
      "nome": "Barbera d’Alba DOC “I quattro conigli bianchi” (Gabriele Scaglione)",
      "regione": "Piemonte",
      "tipo": "Rosso",
      "prezzo": "28,00",
      "disponibile": true
    },
    {
      "id": 49,
      "nome": "Pinot Nero (H-Lun - Girlan)",
      "regione": "Trentino Alto-Adige",
      "tipo": "Rosso",
      "prezzo": "28,00",
      "disponibile": true
    },
    {
      "id": 50,
      "nome": "Amarone della Valpolicella (Bertani)",
      "regione": "Veneto",
      "tipo": "Rosso",
      "prezzo": "60,00",
      "disponibile": true
    },
    {
      "id": 51,
      "nome": "Ripassa (Zenato)",
      "regione": "Veneto",
      "tipo": "Rosso",
      "prezzo": "0,00",
      "disponibile": false,
      "nota": "In arrivo nuova annata"
    },
    {
      "id": 52,
      "nome": "Merlot Isonzo DOC (Renzo Sgubin)",
      "regione": "Friuli Venezia Giulia",
      "tipo": "Rosso",
      "prezzo": "35,00",
      "disponibile": true
    },
    {
      "id": 53,
      "nome": "Tignanello (Antinori)",
      "regione": "Toscana",
      "tipo": "Rosso",
      "prezzo": "0,00",
      "disponibile": false,
      "nota": "In arrivo nuova annata"
    },
    {
      "id": 54,
      "nome": "Solaia 2013 (Antinori)",
      "regione": "Toscana",
      "tipo": "Rosso",
      "prezzo": "250,00",
      "disponibile": true
    },
    {
      "id": 55,
      "nome": "Solaia 2003 (Antinori)",
      "regione": "Toscana",
      "tipo": "Rosso",
      "prezzo": "340,00",
      "disponibile": true
    },
    {
      "id": 56,
      "nome": "Morellino di Scansano DOCG (Fattoria dei Barbi)",
      "regione": "Toscana",
      "tipo": "Rosso",
      "prezzo": "21,00",
      "disponibile": true
    },
    {
      "id": 57,
      "nome": "Chianti DOCG (Fattoria dei Barbi)",
      "regione": "Toscana",
      "tipo": "Rosso",
      "prezzo": "22,00",
      "disponibile": true
    },
    {
      "id": 58,
      "nome": "Chianti classico Clemente VII (Castelli del Grevepesa)",
      "regione": "Toscana",
      "tipo": "Rosso",
      "prezzo": "28,00",
      "disponibile": true
    },
    {
      "id": 59,
      "nome": "Borgo Lazio (Casa Divina Provvidenza)",
      "regione": "Lazio",
      "tipo": "Rosso",
      "prezzo": "22,00",
      "disponibile": true
    },
    {
      "id": 60,
      "nome": "Cesanese (Casa Divina Provvidenza)",
      "regione": "Lazio",
      "tipo": "Rosso",
      "prezzo": "25,00",
      "disponibile": true
    },
    {
      "id": 61,
      "nome": "Aglianico DOCG (Torre Varano)",
      "regione": "Campania",
      "tipo": "Rosso",
      "prezzo": "27,00",
      "disponibile": true
    },
    {
      "id": 62,
      "nome": "Nero di Troia (Torrevento)",
      "regione": "Puglia",
      "tipo": "Rosso",
      "prezzo": "20,00",
      "disponibile": true
    },
    {
      "id": 63,
      "nome": "Sine Nomine Salice Salentino (Torrevento)",
      "regione": "Puglia",
      "tipo": "Rosso",
      "prezzo": "24,00",
      "disponibile": true
    },
    {
      "id": 64,
      "nome": "Ghenos Primitivo (Torrevento)",
      "regione": "Puglia",
      "tipo": "Rosso",
      "prezzo": "27,00",
      "disponibile": true
    },
    {
      "id": 65,
      "nome": "Angheli Merlot, Cabernet Sauvignon (Donnafugata)",
      "regione": "Sicilia",
      "tipo": "Rosso",
      "prezzo": "0,00",
      "disponibile": false,
      "nota": "In arrivo nuova annata"
    },
    {
      "id": 66,
      "nome": "Cuvee Premiere Brut (Chassenay d’Arce)",
      "regione": "Francia",
      "tipo": "Bollicine Francia",
      "prezzo": "65,00",
      "disponibile": true
    },
    {
      "id": 67,
      "nome": "Cristal 2004 (Roederer)",
      "regione": "Francia",
      "tipo": "Bollicine Francia",
      "prezzo": "350,00",
      "disponibile": true
    },
    {
      "id": 68,
      "nome": "Petit Chablis APCC (Albert Pic)",
      "regione": "Francia",
      "tipo": "Bianco Francia",
      "prezzo": "50,00",
      "disponibile": true
    },
    {
      "id": 69,
      "nome": "Poully Fumè APFC (Ladoucette)",
      "regione": "Francia",
      "tipo": "Bianco Francia",
      "prezzo": "55,00",
      "disponibile": true
    },
    {
      "id": 70,
      "nome": "Muscat de Beaumes de venice (Delas)",
      "regione": "Francia",
      "tipo": "Bianco Francia",
      "prezzo": "45,00",
      "disponibile": true
    }
  ]
};

// Normalizza il testo: minuscolo, senza accenti né punteggiatura
export const norm = (s) => String(s || '')
  .toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[’‘`´]/g, "'")
  .replace(/[^a-z0-9' ]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

// Due nomi "si somigliano" se uno contiene l'altro (dopo la normalizzazione)
export const simili = (a, b) => {
  const x = norm(a), y = norm(b);
  return x.length > 1 && y.length > 1 && (x.includes(y) || y.includes(x));
};

const txt = (v, max) => String(v ?? '').trim().slice(0, max);

// Pulisce una singola voce di menu (tipo = 'piatto' | 'vino')
export function normalizzaVoce(tipo, x, id) {
  if (!x || typeof x !== 'object') return null;
  const base = { id, nome: txt(x.nome, 200) };
  if (!base.nome) return null;
  if (tipo === 'vino') {
    const v = {
      ...base,
      regione: txt(x.regione, 60),
      tipo: txt(x.tipo, 60) || 'Altro',
      prezzo: txt(x.prezzo, 20),
      disponibile: x.disponibile !== false,
    };
    if (txt(x.nota, 200)) v.nota = txt(x.nota, 200);
    return v;
  }
  return {
    ...base,
    categoria: txt(x.categoria, 60) || 'Altro',
    prezzo: txt(x.prezzo, 20),
    allergeni: txt(x.allergeni, 200),
    disponibile: x.disponibile !== false,
  };
}

function normalizzaLista(tipo, lista) {
  const arr = Array.isArray(lista) ? lista.filter(x => x && typeof x === 'object') : [];
  let max = 0;
  arr.forEach(x => { if (Number.isInteger(x.id) && x.id > max) max = x.id; });
  const usati = new Set();
  const out = [];
  for (const x of arr) {
    let id = x.id;
    if (!Number.isInteger(id) || id < 1 || usati.has(id)) id = ++max;
    usati.add(id);
    const voce = normalizzaVoce(tipo, x, id);
    if (voce) out.push(voce);
  }
  return out;
}

// Garantisce una struttura valida { piatti: [...], vini: [...] } con id e flag "disponibile"
export function normalizzaMenu(m) {
  return { piatti: normalizzaLista('piatto', m?.piatti), vini: normalizzaLista('vino', m?.vini) };
}

// Legge il valore salvato in Edge Config (oggetto o stringa JSON). Restituisce null se assente o vuoto.
export function leggiMenu(valore) {
  let v = valore;
  if (typeof v === 'string') { try { v = JSON.parse(v); } catch (e) { return null; } }
  if (!v || typeof v !== 'object') return null;
  const m = normalizzaMenu(v);
  return m.piatti.length || m.vini.length ? m : null;
}

// Menu di partenza; i piatti elencati (vecchio sistema "piatti_esauriti") risultano non disponibili
export function menuBase(piattiEsauriti = []) {
  const m = normalizzaMenu(MENU_BASE);
  for (const e of piattiEsauriti) for (const p of m.piatti) if (simili(p.nome, e)) p.disponibile = false;
  return m;
}
