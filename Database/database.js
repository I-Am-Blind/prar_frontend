import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { userSchema } from './userSchema';
import { addRxPlugin } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
addRxPlugin(RxDBDevModePlugin);

const createDatabase = async () => {
  const db = await createRxDatabase({
    name: 'mydatabase',
    storage: getRxStorageDexie()
  });
  await db.addCollections({
    users: {
      schema: userSchema
    }
  });
  return db;
};

let dbInstance = null;
export const getDatabase = async () => {
  if (!dbInstance) {
    dbInstance = await createDatabase();
  }
  return dbInstance;
};
