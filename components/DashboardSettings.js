import Image from "next/image"
import ausa_logo from '@/public/assets/ausa_logo.svg'
import sound from '@/public/assets/icons/sound.svg'
import brightness from '@/public/assets/icons/brightness.svg'
import notifications from '@/public/assets/icons/notifications.svg'
import settings from '@/public/assets/icons/settings.svg'
import textinc from '@/public/assets/icons/textinc.svg'
import textdec from '@/public/assets/icons/textdec.svg'
import profile from '@/public/assets/icons/profile.png'

export const DashboardSettings = ({handleTextSize}) => {

 const handleButtonClick = (button) => {
   console.log(button)
 }

  const buttonLayout = (button,img)=>{
   return (
    <button className="bg-slate-100 rounded-sm w-12 h-12 flex justify-center items-center"><Image src={img} alt={button} onClick={()=>{handleButtonClick(button)}}/></button>
   )
  }

  return (
    <div className=" flex justify-between ">
        <Image src={ausa_logo} alt="AUSA"/>
        <div className=" card-1 btn-container bg-background w-max h-full flex gap-4 p-[0.8rem]">
          {buttonLayout('sound',sound)}
          {buttonLayout('brightness',brightness)}
          {buttonLayout('notifications',notifications)}
          {buttonLayout('settings',settings)}
          {buttonLayout('textinc',textinc)}
          {buttonLayout('textdec',textdec)}
          {buttonLayout('profile',profile)}
        </div>
    </div>
  )
}
