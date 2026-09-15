import { promises as fs } from "fs";
import path from "path";

// File-backed store for the two things that MUST be checked server-side on
// every send, regardless of who's calling: the suppression list (an
// unsubscribe link is clicked from someone's inbox, outside our app) and the
// daily send counter. A real deployment should move this into Postgres —
// this file persists fine for local dev but not across serverless
// invocations/deploys on platforms with an ephemeral filesystem.

const DB_PATH = path.join(process.cwd(), ".data", "gmail-safety.json");

export const DAILY_SEND_LIMIT = 300;

interface SafetyData {
  suppressions: string[]; // lowercased emails
  sendLog: string[]; // ISO timestamps of successful sends
}

async function read(): Promise<SafetyData> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as SafetyData;
  } catch {
    return { suppressions: [], sendLog: [] };
  }
}

async function write(data: SafetyData): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function isSuppressed(email: string): Promise<boolean> {
  const data = await read();
  return data.suppressions.includes(email.toLowerCase());
}

export async function addSuppression(email: string): Promise<void> {
  const data = await read();
  const normalized = email.toLowerCase();
  if (!data.suppressions.includes(normalized)) {
    data.suppressions.push(normalized);
    await write(data);
  }
}

export async function getSuppressionCount(): Promise<number> {
  return (await read()).suppressions.length;
}

function isToday(iso: string): boolean {
  return iso.slice(0, 10) === new Date().toISOString().slice(0, 10);
}

export async function getSentToday(): Promise<number> {
  const data = await read();
  return data.sendLog.filter(isToday).length;
}

export async function recordSend(): Promise<void> {
  const data = await read();
  data.sendLog.push(new Date().toISOString());
  await write(data);
}
