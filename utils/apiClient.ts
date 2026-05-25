import type{ APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from './logger.js';

export class ApiClient {
  constructor(private request: APIRequestContext) {}

  async get(endpoint: string): Promise<APIResponse> {
    logger.info(`GET ${endpoint}`);
    return this.request.get(endpoint);
  }

  async post(endpoint: string, payload: object): Promise<APIResponse> {
    logger.info(`POST ${endpoint}`);
    return this.request.post(endpoint, {
      data: payload,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async delete(endpoint: string): Promise<APIResponse> {
    logger.info(`DELETE ${endpoint}`);
    return this.request.delete(endpoint);
  }
}