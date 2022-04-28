import { ScanInfo } from "../types";
import { storage } from "./base";
import { FSIO_MENU_ID } from './constants';

const KEY_API_KEY = 'api_key'
const KEY_BASE_URL = 'base_url'
const KEY_SCAN_DOWNLOAD = 'scan_download'
const KEY_MAX_FILE_SIZE = 'max_filesize'
const KEY_SCAN_HISTORY = 'scan_history'
const KEY_ACCEPTED = 'key_accepted'

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

export async function saveScanDownload(flag: boolean) {
  return await storage.set(KEY_SCAN_DOWNLOAD, flag)
}

export async function getScanDownload() {
  const result = await storage.get(KEY_SCAN_DOWNLOAD)
  return result[KEY_SCAN_DOWNLOAD]
}

export async function saveMaxFileSize(size: number) {
  return await storage.set(KEY_MAX_FILE_SIZE, size)
}

export async function getMaxFileSize() {
  const result = await storage.get(KEY_MAX_FILE_SIZE)
  return result[KEY_MAX_FILE_SIZE]
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

export async function getAccepted() {
  const result = await storage.get(KEY_ACCEPTED)
  return result[KEY_ACCEPTED]
}

export async function saveAccepted() {
  chrome.contextMenus.create({
    title: `Scan with FileScan.IO`,
    contexts: ['link'],
    id: FSIO_MENU_ID
  })
  return await storage.set(KEY_ACCEPTED, true)
}

export async function clearAccepted() {
  chrome.contextMenus.remove(FSIO_MENU_ID)
  return await storage.set(KEY_ACCEPTED, false)
}
