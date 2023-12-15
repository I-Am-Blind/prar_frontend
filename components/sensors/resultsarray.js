// No function
// Just for backup


{state === "results" && (
    <div className="flex flex-col gap-8 w-[85%] h-full">
      <h1 className="text-3xl font-semibold text-slate-600 text-center m">
        Test Successfully Taken
      </h1>
      <Reading results={sensorresults} />
      <div className="buttons flex justify-center gap-4 w-full mt-4">
        <Button
          className="w-56 h-14 shadow-xl shadow-gray-200 "
          variant="outline"
        >
          Check Again
        </Button>
        <Button className="w-56 h-14 shadow-lg shadow-blue-200 ">
          Done
        </Button>
      </div>
    </div>
  )}