import axios from "axios";
async function SignupToFirebase(device_id, userdata) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/signup`,
      { device_id: device_id, userdata: userdata }
    );
    return response?.data
  } catch (error) {
    console.log(error)
    return error
  }
}
export default SignupToFirebase;
