import ai from "@/public/assets/ai.png";
import Image from "next/image";

const Reading = ({
  results = [{ name: "BP-Systolic", value: "92", unit: "mmHg" }],
  variant = "normal",
}) => {
  return (
    <div className="bg-green2 w-full rounded-2xl p-2 h-[65%] flex flex-col justify-between pt-12 items-center shadow-xl shadow-green2">
      <div className="flex gap-8 justify-center items-center">
      {results.map((result) => {
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-500 text-lg">
              {result?.name}
            </span>
            <span
              className={` ${
                variant === "normal" ? "text-green1" : "text-red-600"
              } text-[4rem] font-semibold`}
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
      <div className="w-full bg-green3 px-4 py-6 rounded-xl">
        <span className="flex gap-2 ">
          <Image src={ai} />
          <h2 className="text-lg font-semibold text-blue-900">Ai Diagnosis</h2>
        </span>
        <p>
          AI diagnosis on this reading will be shown here for the user. If
          everything is good, it will say so.
        </p>
      </div>
    </div>
  );
};

export default Reading;
