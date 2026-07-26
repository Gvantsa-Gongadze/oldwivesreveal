import type { CreateRevealRequest, Reveal } from '@oldwivesreveal/shared-types';
import { getClientId } from '../lib/clientId';

// In local dev, requests go through Vite's proxy at /api (see vite.config.ts),
// which forwards to the API on the same machine. In production the web app
// and API are separately hosted, so VITE_API_ORIGIN points straight at the
// deployed API instead.
const API_ORIGIN: string = import.meta.env.VITE_API_ORIGIN ?? '';
export const BASE_URL = API_ORIGIN ? `${API_ORIGIN}/reveals` : '/api/reveals';

async function parseJsonOrThrow(response: Response) {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.message ?? `Request failed with status ${response.status}`;
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }
  return body;
}

export async function createReveal(input: CreateRevealRequest): Promise<Reveal> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Client-Id': getClientId() },
    body: JSON.stringify(input),
  });
  return parseJsonOrThrow(response);
}

export async function listReveals(limit = 10): Promise<Reveal[]> {
  const response = await fetch(`${BASE_URL}?limit=${limit}`, {
    headers: { 'X-Client-Id': getClientId() },
  });
  return parseJsonOrThrow(response);
}

export async function getReveal(id: string): Promise<Reveal> {
  const response = await fetch(`${BASE_URL}/${id}`);
  return parseJsonOrThrow(response);
}
