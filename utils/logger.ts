import { test } from '@playwright/test';

const ts = () => new Date().toISOString();

export const logger = {
  info: (msg: string) => {
    console.log(`[INFO]  ${ts()} - ${msg}`);
    try { test.info().annotations.push({ type: 'log', description: msg }); } catch {}
  },
  warn: (msg: string) => {
    console.warn(`[WARN]  ${ts()} - ${msg}`);
    try { test.info().annotations.push({ type: 'warning', description: msg }); } catch {}
  },
  error: (msg: string) => {
    console.error(`[ERROR] ${ts()} - ${msg}`);
    try { test.info().annotations.push({ type: 'error', description: msg }); } catch {}
  },
};