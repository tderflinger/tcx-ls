import { stringify } from "jsr:@std/csv";
import { LapData } from "./tcx-reader.ts";

export async function writeLapsCsv(laps: LapData[], filePath: string) {
  const csvData = laps.map((lap) => {
    return {
      startTime: lap.lapStartTime,
      totalTime: lap.lapTime,
      distance: lap.lapDistance,
      maximumSpeed: lap.lapMaxSpeed,
      calories: lap.lapCalories,
      averageHeartRate: lap.lapAvgHeartRate,
      maximumHeartRate: lap.lapMaxHeartRate,
    };
  });
  try {
    await Deno.writeTextFile(
      filePath,
      stringify(csvData, {
        columns: [
          "startTime",
          "totalTime",
          "distance",
          "maximumSpeed",
          "calories",
          "averageHeartRate",
          "maximumHeartRate",
        ],
      })
    );
  } catch (error) {
    console.error("Error writing the CSV file:", error);
  }
}
