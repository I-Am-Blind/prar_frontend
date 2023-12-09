import Dexie from 'dexie';

class Database extends Dexie {
  constructor() {
    super('UserData');
    this.version(1).stores({
      users: '++id, name, username, pin, age, sex, height, weight, phone, email, healthId, underlyingConditions, emergencyContact, upcoming_appointments',
    });
  }
}

let dbInstance;

export const getDbInstance = () => {
  if (typeof window !== 'undefined') {
    if (!dbInstance) {
      dbInstance = new Database();
    }
    return dbInstance;
  }
};

export default Database;
