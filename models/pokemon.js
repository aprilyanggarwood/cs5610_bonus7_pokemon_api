// models/pokemon.js — all MongoDB access for pokemon
import { db } from '../db.js';

const collection = db.collection('pokemon');

// insert a new pokemon document; returns the created document
export async function createPokemon(data) {
  const result = await collection.insertOne(data);
  return { _id: result.insertedId, ...data };
}

// return every pokemon
export async function listPokemon() {
  return await collection.find({}).toArray();
}