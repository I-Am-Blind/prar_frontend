import bp1 from "@/public/assets/instructions/bp1.png";
import bp2 from "@/public/assets/instructions/bp2.png";
import bp3 from "@/public/assets/instructions/bp3.png";
import bp4 from "@/public/assets/instructions/bp4.png";
import bp5 from "@/public/assets/instructions/bp5.png";

import bg1 from "@/public/assets/instructions/bg1.svg";
import bg2 from "@/public/assets/instructions/bg2.png";

import hr1 from '@/public/assets/instructions/hr1.png'
import hr2 from '@/public/assets/instructions/hr2.png'
import hr3 from '@/public/assets/instructions/hr3.png'


export const instructions = {
  bp: [
    "Sit down in a quiet, comfortable place.  Make sure your feet are flat on the ground and your arm is supported at heart level.",
    "Position the cuff around your upper arm, two to three fingers' width above the bend of your elbow.",
    "Press the start button on the blood pressure monitor and wait for it to inflate the cuff.",
    "As the cuff inflates, you may feel some pressure on your arm, but it shouldn't be uncomfortable.",
    "Wait for the monitor to deflate the cuff, and record your systolic and diastolic blood pressure readings."
  ],
  bg: [
    "Insert the strip in the red port as shown until the device detects the glucose strip",
    "Prick the side of your fingertip with the Lancet. Touch and hold the edge of the test strip to the drop of blood.Wash and dry your hands well"
  ],
  hr: [
    "wash your hands with soap and warm water, and dry them thoroughly. ",
    "Insert your finger into the device, ensuring it fits snugly with the sensor on the underside of the device. It’s recommended to use your index or middle finger.",
    "Wait for a few seconds until the oximeter detects your pulse and displays your SpO2 level and pulse rate."
  ]
};


export const sensor_images = {
  bp: [bp1,bp2,bp3,bp4,bp5],
  bg: [bg1,bg2],
  hr: [hr1,hr2,hr3]

}