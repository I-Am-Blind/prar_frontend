export class UserDataManager {
  constructor() {
    if (typeof window !== 'undefined')
      this.storage = sessionStorage;

  }

  getAll() {
    const data = this.storage.getItem('userdata');
    return data ? JSON.parse(data) : {};
  }
  
  get(key) {
    const currentData = this.getAll();
    return currentData ? currentData[key] : undefined;
  }

  set(key, value) {
    const currentData = this.getAll();
    currentData[key] = value;
    this.storage.setItem('userdata', JSON.stringify(currentData));
  }

  deleteSession() {
    this.storage.removeItem('userdata');
  }
}