class LocalStorage {

  static instance: LocalStorage | null = null
  public static getInstance(): LocalStorage {
    if (LocalStorage.instance === null) {
      return new LocalStorage()
    } else {
      return LocalStorage.instance
    }
  }

  get(key: string) {
    return chrome.storage.local.get(key)
  }

  set(key: string, value: any) {
    return chrome.storage.local.set({ [key]: value })
  }
}

export const storage: LocalStorage = LocalStorage.getInstance()
