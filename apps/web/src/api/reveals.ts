import type { CreateRevealRequest, Reveal } from '@oldwivesreveal/shared-types';

const BASE_URL = '/api/reveals';

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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseJsonOrThrow(response);
}

export async function listReveals(limit = 10): Promise<Reveal[]> {
  const response = await fetch(`${BASE_URL}?limit=${limit}`);
  return parseJsonOrThrow(response);
}
