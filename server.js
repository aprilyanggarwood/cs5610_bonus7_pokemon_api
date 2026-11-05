// cs5610_bonus7_pokemon_api — Pokemon API
// Author: April Yang
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { db } from './db.js';

const app = new Hono();

app.get('/', (c) => c.text('Pokemon API is running'));

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 3000,
});
console.log('http://localhost:3000');