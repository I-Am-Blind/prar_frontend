import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ctof } from "./utilities/ctof";
import { NORMAL_VALUES } from "@/Config/vitalManager";

  const getColorClass = (vital, value) => {

  
    
    let isAboveNormal = false;

    switch (vital) {
      case 'bloodPressure':
        const [systolic, diastolic] = value.split('/').map(Number);
        isAboveNormal = systolic > NORMAL_VALUES.bloodPressure.systolic || diastolic > NORMAL_VALUES.bloodPressure.diastolic;
        break;
      case 'heartRate':
        isAboveNormal = value > NORMAL_VALUES.heartRate;
        break;
      case 'spo2':
        isAboveNormal = value < NORMAL_VALUES.spo2; // For SpO2, higher is generally normal, lower is concerning
        break;
      case 'bodyTemp':
        isAboveNormal = ctof(value) > ctof(NORMAL_VALUES.bodyTemp); // Compare in Fahrenheit
        break;
      case 'bloodGlucose':
        isAboveNormal = value > NORMAL_VALUES.bloodGlucose;
        break;
      default:
        break;
    }

    return isAboveNormal ? 'text-red-500' : 'text-green-500';
  };
  const DashboardReadings = ({ vitals }) => {

    function renderLines() {
      return (
        <span className="w-[1px] bg-gray-200 h-32"></span>
      )
    } 

    return (
      <div className="flex justify-between px-8 py-0 h-full w-full">
        {/* Blood Pressure */}
        <div className="flex flex-col last-readings-container">
          <div className="vital-name">Blood Pressure</div>
          <p className={`${getColorClass('bloodPressure', vitals[0])} vital-value`}>{vitals[0] !== 'undefined' ? vitals[0] : 'N/A'}</p>
          <p className="vital-unit">mm Hg</p>
        </div>
         {renderLines()}
        {/* Heart Rate */}
        <div className="flex flex-col last-readings-container">
          <h3 className="vital-name">Heart Rate</h3>
          <p className={`${getColorClass('heartRate', vitals[1])} vital-value`}>{vitals[1] ? vitals[1] : 'N/A'}</p>
          <p className="vital-unit">BPM</p>
        </div>
        {renderLines()}
        {/* SpO2 */}
        <div className="flex flex-col last-readings-container">
          <h3 className="vital-name">SpO2</h3>
          <p className={`${getColorClass('spo2', vitals[2])} vital-value`}>{vitals[2] ? vitals[2] : 'N/A' }</p>
          <p className="vital-unit">%</p>
        </div>
        {renderLines()}
        {/* Body Temperature */}
        <div className="flex flex-col last-readings-container">
          <h3 className="vital-name">Body Temperature</h3>
          <Tabs defaultValue="fahrenheit" className="w-full ">           
              <div className="p-2 vital-value">
                <TabsContent value="fahrenheit">
                    <h2 className={`${getColorClass('bodyTemp', vitals[3])} vital-value`}>{vitals[3] ? ctof(vitals[3]) : 'N/A'}°F</h2>
                </TabsContent>
                <TabsContent value="celsius">
                    <h2 className={`${getColorClass('bodyTemp', vitals[3])} vital-value`}>{vitals[3] ? vitals[3] : 'N/A'}°C</h2>
                </TabsContent>
                </div>
              <TabsList className="text-primtext  bg-lightblue h-8 w-22.5 rounded-5 vital-unit">
                <TabsTrigger value="fahrenheit">° F</TabsTrigger>
                <TabsTrigger value="celsius">° C</TabsTrigger>
              </TabsList>
            </Tabs>
        </div>
        {renderLines()}
        {/* Blood Glucose */}
        <div className="flex flex-col last-readings-container">
          <h3 className="vital-name">Blood Glucose</h3>
          <p className={`${getColorClass('bloodGlucose', vitals[4])} vital-value`}>{vitals[4] ? vitals[4] : 'N/A'}</p>
          <p className="vital-unit">Mg/DL</p>
        </div>
      </div>
    );
  };
  
  export default DashboardReadings;
  