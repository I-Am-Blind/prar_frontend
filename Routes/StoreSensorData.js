import axios from "axios";
import moment from 'moment';
async function StoreSensorData(userId, sensor, value) {
 
    const data = {
        value : value,
        recorded_at : moment().format('MMM DD, YYYY [at] h:mm:ss A [UTC]Z'),
        updated_at : ''
       }
       
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/sensordata`,
      {  userId: userId, sensor: sensor, data: data }
    );
    return response?.data
  } catch (error) {
    console.log(error)
    return error
  }
}
export default StoreSensorData;
