export const userDataManager = (() => {

  const get = (key) => {
    const data = localStorage.getItem('userdata');
    return data ? JSON.parse(data)[key] : null;
  };

    const getall = () => {
      const data = localStorage.getItem('userdata');
      return data ? JSON.parse(data) : null;
    };

    const set = (key, value) => {
      const currentData = get(); 
      currentData[key] = value;
      localStorage.setItem('userdata', JSON.stringify(currentData));
    };
  
    return {
      getall,
      set,
      get
    };
  })();