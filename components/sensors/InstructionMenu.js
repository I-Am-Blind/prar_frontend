"use client"

import Image from "next/image"
import { Button } from "../ui/button"


const InstructionMenu = ({heading, instructions, ino, sensor_images, handleBack, handleNext, handleSkip}) => {
  return (
    <>
      <div className="header flex justify-between w-full h-1/6">
        <h2 className="font-semibold text-xl">{heading}</h2>
        <button className="text-blue-500 font-bold" onClick={handleSkip} >Skip</button>
      </div>
      <div className="instruction flex justify-between w-full  items-center h-4/6">
        <p className="w-[50%]  text-lg">{instructions[ino]}</p>
        <Image src={sensor_images[ino]} alt="image" className="w-64 h-64 object-contain" />
      </div>
      <div className="buttons flex justify-center gap-4 w-full h-1/6">
        { ino !== 0 && <Button className='w-32 shadow-xl shadow-gray-200 '  variant='outline' onClick = {handleBack} >Back</Button> }
        <Button className='w-32 shadow-lg shadow-blue-200 ' onClick = {handleNext} >{ino === instructions.length -1 ? 'Start': 'Next'}</Button>
      </div>
    </>
  )
}

export default InstructionMenu