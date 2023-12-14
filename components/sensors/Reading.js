import ai from "@/public/assets/ai.png";
import Image from "next/image";

const Reading = ({
  results = [{ name: "No value to display", value: "", unit: "" }],
  variant = "normal",
}) => {
  return (
    <div className="bg-green2 rounded-2xl  flex shadow-xl shadow-green2  w-full h-full">
      <div className="flex gap-8 justify-center items-center w-[50%]">
      {results.map((result) => {
        return (
          <div className="flex flex-col">
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
