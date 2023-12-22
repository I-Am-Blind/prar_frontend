import Dexie from 'dexie';

class Database extends Dexie {
  constructor() {
    super('UserData');
    this.version(1).stores({
      users: '++id, name, username, pin, age, sex, height, weight, phone, email, healthId, underlyingConditions, emergencyContact, upcoming_appointments',
      bp_last: 'userId, readings, timestamp',
      bg_last: 'userId, readings, timestamp',
      t_last: 'userId, readings, timestamp',
      hr_last: 'userId, readings, timestamp',
      sp_last: 'userId, readings, timestamp',
      bp_readings: '++id, readings, timestamp',
      bg_readings: '++id, readings, timestamp',
      t_readings: '++id, readings, timestamp',
      hr_readings: '++id, readings, timestamp',
      sp_readings: '++id, readings, timestamp',     
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
