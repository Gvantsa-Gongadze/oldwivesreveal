import type { AdminRevealsResponse } from '@oldwivesreveal/shared-types';
import { getAdminToken } from '../lib/adminAuth';

const API_ORIGIN: string = import.meta.env.VITE_API_ORIGIN ?? '';
const BASE_URL = API_ORIGIN ? `${API_ORIGIN}/admin` : '/api/admin';

export class AdminUnauthorizedError extends Error {}

export async function listAllReveals(limit: number, offset: number): Promise<AdminRevealsResponse> {
  const token = getAdminToken();
  const response = await fetch(`${BASE_URL}/reveals?limit=${limit}&offset=${offset}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (response.status === 401) {
    throw new AdminUnauthorizedError('Incorrect admin password.');
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.message ?? `Request failed with status ${response.status}`;
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }
  return body;
}
