"use client"

import ai from "@/public/assets/ai.png";
import Image from "next/image";
import StoreSensorData from '@/Routes/StoreSensorData'
import { useEffect } from "react";
import { StoreReadings} from '@/Database/Sensors'

const Reading = ({
  results,
  variant = "normal",
  userId = null
}) => {

  const db_id = {
    'Heart Rate' : 'hr',
    'Spo2' : 'sp',
    'Blood Glucose' : 'bg',
    'Body Temperature' : 't',
  }

useEffect(() => {
  async function storeresults() {
    if ( userId  && results)
    {
      if ( results[0]?.name === 'Systolic' || results[0]?.name === 'Diastolic')
           {
            await StoreReadings(userId, 'bp', `${results[0].value}/${results[1].value}`)
            console.log(await StoreSensorData(userId, 'bp', `${results[0].value}/${results[1].value}`))
           }  else {
            results.forEach(result => {
                  if (result.name && result.value) {                   
                      StoreReadings(userId, db_id[result.name], result.value)
                      StoreSensorData(userId, db_id[result.name], result.value)
                  }
              })
           }
    }
  }

  storeresults();
   
}, [])


  return (
    <div className="bg-green2 rounded-2xl  flex shadow-xl shadow-green2  w-full h-full">
      <div className="flex gap-8 justify-center items-center w-[50%]">
      {results.map((result) => {
        return (
          <div className="flex flex-col" key={result?.name}>
            <span className="font-medium text-gray-500 text-lg">
              {result?.name}
            </span>
            <span
              className={` ${
                variant === "normal" ? "text-green1" : "text-red-600"
              } text-[3rem] font-semibold`}
            >
              {result?.value}
            </span>
            <span
              className={` ${
                variant === "normal" ? "text-green1" : "text-red-600"
              } font-semibold`}
            >
              {result?.unit}
            </span>
          </div>
        );
      })}
      </div>
      <div className=" bg-green2 px-4 py-6 rounded-r-2xl w-[50%] ">
        <h2 className="bg-green3 px-4 py-2 rounded-xl w-max mb-8">Your Readings are normal</h2>
        <span className="flex gap-2 ">
          <Image src={ai} alt={'ai'}/>
          <h2 className="text-sm font-semibold text-blue-900">Ai Diagnosis</h2>
        </span>
        <p className="text-sm">
          AI diagnosis on this reading will be shown here for the user. If
          everything is good, it will say so.
        </p>
      </div>
    </div>
  );
};

export default Reading;
