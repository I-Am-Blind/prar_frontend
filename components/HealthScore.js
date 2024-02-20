import moment from "moment";

export default function calculateHealthScores(data) {
   // Initialize arrays to store dates and scores
   const dates = [];
   const scores = [];

   // Helper function to calculate score for each vital sign
   function calculateScore(value, normalRange) {
       const deviation = Math.abs(value - normalRange);
       const score = Math.max(20 - deviation, 0);
       return score;
   }

   // Extract unique days present in the data object
   const uniqueDays = {};
   for (const key in data) {
       if (data[key].length > 0) {
           data[key].forEach(reading => {
               const date = moment(reading.timestamp, "MMM DD, YYYY [at] h:mm:ss A [UTC]Z").format("MMM D, YYYY");
               uniqueDays[date] = true;
           });
       }
   }

   // Iterate through the unique days
   Object.keys(uniqueDays).forEach(date => {
       // Initialize variables to store scores for the day
       let totalScore = 0;
       let totalReadings = 0;

       // Iterate through the vital signs data
       for (const key in data) {
           // Skip if there are no readings for a vital sign
           if (data[key].length === 0) continue;

           // Iterate through each reading
           data[key].forEach(reading => {
               // Extract the reading date
               const readingDate = moment(reading.timestamp, "MMM DD, YYYY [at] h:mm:ss A [UTC]Z").format("MMM D, YYYY");

               // Check if the reading belongs to the current day
               if (readingDate === date) {
                   // Calculate health score based on vital signs
                   let score = 0;
                   switch (key) {
                       case "hr":
                           score = calculateScore(reading.readings, 95); // Normal HR range
                           break;
                       case "bp":
                           // Extract systolic and diastolic readings from blood pressure
                           const [systolic, diastolic] = reading.readings.split('/').map(Number);
                           // Calculate score for systolic and diastolic separately
                           const scoreSystolic = calculateScore(systolic, 120); // Normal systolic BP
                           const scoreDiastolic = calculateScore(diastolic, 80); // Normal diastolic BP
                           // Average the scores
                           score = (scoreSystolic + scoreDiastolic) / 2;
                           break;
                       case "sp":
                           score = calculateScore(reading.readings, 98); // Normal SpO2
                           break;
                       case "t":
                           score = calculateScore(reading.readings, 98.6); // Normal body temperature
                           break;
                       // Add cases for other vital signs if needed
                   }

                   // Add score to the total for the day
                   totalScore += score;
                   totalReadings++;
               }
           });
       }

       // Calculate average health score for the day
       const averageScore = totalReadings > 0 ? totalScore / totalReadings : null;

       // Push the date and score to the respective arrays
       dates.push(date);
       scores.push(averageScore);
   });

   return [dates, scores];
}

