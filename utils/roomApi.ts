import type{ APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from './logger.js';

export class RoomApi {
  constructor(private request: APIRequestContext) {}

  async createRoom(
    payload: object,
    options: { headers?: Record<string, string> } = {}
  ): Promise<APIResponse> {
    logger.info('Creating room via API');
    return this.request.post('/api/room', {
      data: payload,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      maxRedirects: 0,
    });
  }

  async getRoom(
    id: number,
    options: { headers?: Record<string, string> } = {}
  ): Promise<APIResponse> {
    logger.info(`Fetching room ${id}`);
    return this.request.get(`/api/room/${id}`, {
      headers: { ...options.headers },
      maxRedirects: 0,
    });
  }

  async listRooms(
    options: { headers?: Record<string, string> } = {}
  ): Promise<APIResponse> {
    logger.info('Listing rooms via API');
    return this.request.get('/api/room', {
      headers: { ...options.headers },
      maxRedirects: 0,
    });
  }

  async deleteRoom(
    id: number,
    options: { headers?: Record<string, string> } = {}
  ): Promise<APIResponse> {
    logger.info(`Deleting room ${id}`);
    return this.request.delete(`/api/room/${id}`, {
      headers: { ...options.headers },
      maxRedirects: 0,
    });
  }
}