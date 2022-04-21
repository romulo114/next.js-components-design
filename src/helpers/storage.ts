import { ScanInfo } from "../types";
import { storage } from "./base";

const KEY_API_KEY = 'api_key'
const KEY_BASE_URL = 'base_url'
const KEY_SCAN_HISTORY = 'scan_history'

export async function saveApiKey(key: string) {
  return await storage.set(KEY_API_KEY, key)
}

export async function getApiKey() {
  const result = await storage.get(KEY_API_KEY)
  return result[KEY_API_KEY]
}

export async function saveBaseURL(url: string) {
  return await storage.set(KEY_BASE_URL, url)
}

export async function getBaseURL() {
  const result = await storage.get(KEY_BASE_URL)
  return result[KEY_BASE_URL]
}

export async function saveHistory(items: ScanInfo[]) {
  return await storage.set(KEY_SCAN_HISTORY, items)
}

export async function getHistory() {
  const result = await storage.get(KEY_SCAN_HISTORY)
  if (!result || !result[KEY_SCAN_HISTORY]) {
    return []
  }

  return result[KEY_SCAN_HISTORY]
}
