// cs5610_bonus7_pokemon_api — Pokemon API
// Author: April Yang
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { HTTPException } from 'hono/http-exception';
import { db } from './db.js';
import { createPokemon, listPokemon } from './models/pokemon.js';

const app = new Hono();

app.get('/', (c) => c.text('Pokemon API is running'));

// LIST all pokemon
app.get('/api/pokemon', async (c) => {
  const all = await listPokemon();
  return c.json(all);
});

// CREATE a pokemon
app.post('/api/pokemon', async (c) => {
  const body = await c.req.json();

  // --- validate at the edge (before touching the database) ---
  // species and owner must be present (never falsy)
  if (!body.species || !body.owner) {
    throw new HTTPException(400, { message: 'species and owner are required' });
  }
  // the client must NOT send an id (the server assigns it)
  if (body.id !== undefined || body._id !== undefined) {
    throw new HTTPException(400, { message: 'do not include an id' });
  }

  // --- build the new pokemon ---
  const pokemon = {
    name: body.name || body.species,           // name defaults to species if absent
    species: body.species,
    owner: body.owner,
    health: Math.floor(Math.random() * 100) + 1,  // random health between 1 and 100
    level: Math.floor(Math.random() * 50) + 1,   // random level between 1 and 50
  };

  const created = await createPokemon(pokemon);
  return c.json(created, 201);
});

// central error handler
app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse();
  console.error(err);
  return c.json({ error: 'Internal error' }, 500);
});

serve({ fetch: app.fetch, port: Number(process.env.PORT) || 3000 });
console.log('http://localhost:3000');