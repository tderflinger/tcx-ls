import {
  calculateAccumulatedDistance,
  calculateAccumulatedTimeMinutes,
  calculateAccumulatedTimeSeconds,
  calculateAltituteAscent,
} from "./calculations.ts";
import { tcxData, commandOptions } from "./tcx-reader.ts";

export function displayData() {
  console.log("Activity ID: ", tcxData.activityId);
  console.log("Sport: ", tcxData.sport);
  console.log("");
  console.log(
    "Accumulated Time: ",
    calculateAccumulatedTimeMinutes(tcxData.accumulatedTime) +
      ":" +
      calculateAccumulatedTimeSeconds(tcxData.accumulatedTime)
  );
  console.log(
    "Accumulated Distance [km]: ",
    calculateAccumulatedDistance(tcxData.accumulatedDistance)
  );
  console.log("Accumulated Calories: ", tcxData.accumulatedCalories);
  tcxData.altitudeTrackerMax &&
    console.log(
      "Altitude Ascent [m]: " +
        calculateAltituteAscent(
          tcxData.altitudeTrackerMin,
          tcxData.altitudeTrackerMax
        )
    );
  tcxData.altitudeTrackerMin &&
    console.log("Altitude Min [m]: " + tcxData.altitudeTrackerMin.toFixed(2));
  tcxData.altitudeTrackerMax &&
    console.log("Altitude Max [m]: " + tcxData.altitudeTrackerMax.toFixed(2));
  const secondsPerKm =
    tcxData.accumulatedTime / (tcxData.accumulatedDistance / 1000);
  const minPerKm = Math.trunc(
    Math.trunc(tcxData.accumulatedTime / 60) /
      (tcxData.accumulatedDistance / 1000)
  );
  const diffPace = secondsPerKm - minPerKm * 60;

  console.log("Average Pace: ", minPerKm + ":" + Math.round(diffPace));
  tcxData.maxRunCadence &&
    console.log("Maximum Run Cadence: " + tcxData.maxRunCadence);
  tcxData.maxSpeed &&
    console.log("Maximum Speed: " + tcxData.maxSpeed.toFixed(2));
  tcxData.accumulatedHR &&
    console.log(
      "Average Heartrate [bpm]: " +
        Math.round(tcxData.accumulatedHR / tcxData.heartrateCounter)
    );
  tcxData.maxHR && console.log("Maximum Heartrate [bpm]: " + tcxData.maxHR);
  console.log("");

  console.log("Number Laps:", tcxData.laps.length);

  if (commandOptions.listLaps) {
    printLaps();
  }
}

function printLaps() {
  for (const lap of tcxData.laps) {
    console.log("");
    const date = new Date(lap.lapStartTime);
    console.log("Start Time:", date.toLocaleString("de-DE"));
    console.log("Total Time [min]: ", (lap.lapTime / 60).toFixed(2));
    console.log("Distance [km]: ", (lap.lapDistance / 1000).toFixed(2));
    console.log("Maximum Speed: ", lap.lapMaxSpeed.toFixed(2));
    console.log("Calories: ", lap.lapCalories);
    lap.lapAvgHeartRate &&
      console.log("Average Heartrate [bpm]: ", lap.lapAvgHeartRate);
    lap.lapMaxHeartRate &&
      console.log("Maximum Heartrate [bpm]: ", lap.lapMaxHeartRate);
  }
}

export function printAuthor(tcxd: any) {
  if (!tcxd.authorData?.available) {
    return;
  }
  console.log("");
  console.log("Author Data");
  console.log("");
  console.log("Name: " + tcxd.authorData.name);
  console.log("Version Major: " + tcxd.authorData.build.versionMajor);
  console.log("Version Minor: " + tcxd.authorData.build.versionMinor);
  console.log("Build Major: " + tcxd.authorData.build.buildMajor);
  console.log("Build Minor: " + tcxd.authorData.build.buildMinor);
  console.log("Language: " + tcxd.authorData.lang);
  console.log("Part Number: " + tcxd.authorData.partNumber);
}

export function printCreator(tcxd: any) {
  if (!tcxd.creatorData?.available) {
    return;
  }

  console.log("");
  console.log("Creator Data");
  console.log("");
  console.log("Name: " + tcxd.creatorData.name);
  console.log("Unit ID: " + tcxd.creatorData.unitId);
  console.log("Product ID: " + tcxd.creatorData.productID);
  console.log("Version Major: " + tcxd.creatorData.versionMajor);
  console.log("Version Minor: " + tcxd.creatorData.versionMinor);
  console.log("Build Major: " + tcxd.creatorData.buildMajor);
  console.log("Build Minor: " + tcxd.creatorData.buildMinor);
}

export function printHelp() {
  console.error("tcx-ls - List TCX information.");
  console.error("No tcx file provided.");
  console.error("Usage: tcx-ls [Options] TCXFILE.tcx");
  console.error("");
  console.error("Options:");
  console.error("-l : List laps");
  console.error("-c : List creator data");
  console.error("-a : List author data");
}
