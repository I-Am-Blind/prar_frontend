"use client"

export const userDataManager = (() => {
  const getall = () => {
    const data = localStorage.getItem('userdata');
    return data ? JSON.parse(data) : null;
  };

  const set = (key, value) => {
    const currentData = getall(); 
    currentData[key] = value;
    localStorage.setItem('userdata', JSON.stringify(currentData));
  };

  return {
    getall,
    set,
  };
})();