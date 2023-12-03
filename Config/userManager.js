export const userDataManager = (() => {
    const get = () => {
      const data = localStorage.getItem('userdata');
      return data ? JSON.parse(data) : {};
    };

    const set = (key, value) => {
      const currentData = get(); 
      currentData[key] = value;
      localStorage.setItem('userdata', JSON.stringify(currentData));
    };
  
    return {
      get,
      set
    };
  })();