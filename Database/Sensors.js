import { getDbInstance } from "./database"
import moment from 'moment';

export const StoreReadings = async (userId, sensor, readings) => {
    try {
      const db = getDbInstance();
      
      const timestamp = moment().format('MMM DD, YYYY [at] h:mm:ss A [UTC]Z')
      await db[`${sensor}_last`].put({ userId, readings, timestamp});
      await db[`${sensor}_readings`].add({ userId, readings, timestamp});
      
      console.log("Updated Sensordata to localdb")
    } catch (error) {
      console.log('An Error Occured During storing sensordata : ',error)
    }
  };

  export const GetReadings = async (sensor = null) => {
    try {
      const db = getDbInstance();
      let sensors = [];
      if (sensor)
       sensors = [sensor]
    else 
       sensors = ['bp', 'bg', 't', 'hr', 'sp']
      const allReadings = {}

      for (const sensor of sensors) {
        allReadings[sensor] = await db[`${sensor}_readings`].toArray();
      }
  
      return allReadings
      
    } catch (error) {
      console.log('An Error Occured when trying to retrieve sensor  readings')
    }
  };

  export const GetLastReadings = async () => {
    try {
      const db = getDbInstance();
      const sensors = ['bp', 'bg', 't', 'hr', 'sp']
      const allReadings = {}

      for (const sensor of sensors) {
        allReadings[sensor] = await db[`${sensor}_last`].toArray();
      }
  
      return allReadings
      
    } catch (error) {
      console.log('An Error Occured when trying to retrieve last readings')
    }
  };
