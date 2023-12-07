 async function Signin(user) {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/signin`, user);
      console.log('User data:', response.data); 
  
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          console.log("user not found") // User not found
        } else if (error.response.status === 401) {
            console.log("Invalid Password")
        } else {
            console.log("Other error")
        }
      } else {
        console.log("Server or Network error!")
      }
    }
  }
  
  export default Signin