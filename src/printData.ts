import { tcxData, commandOptions } from "./readTcx.ts";

function calculateAccumulatedTimeMinutes() {
  return Math.trunc(tcxData.accumulatedTime / 60);
}

function calculateAccumulatedTimeSeconds() {
  const seconds = Math.trunc(
    tcxData.accumulatedTime - Math.trunc(tcxData.accumulatedTime / 60) * 60
  );

  if (seconds < 10) {
    return "0" + seconds;
  }

  return seconds;
}

export function displayData() {
  console.log("Activity ID: ", tcxData.activityId);
  console.log("Sport: ", tcxData.sport);
  console.log("");
  console.log(
    "Accumulated Time: ",
    calculateAccumulatedTimeMinutes() + ":" + calculateAccumulatedTimeSeconds()
  );
  console.log(
    "Accumulated Distance [km]: ",
    (tcxData.accumulatedDistance / 1000).toFixed(2)
  );
  console.log("Accumulated Calories: ", tcxData.accumulatedCalories);
  console.log(
    "Altitude Ascent [m]: ",
    (tcxData.altitudeTrackerMax - tcxData.altitudeTrackerMin).toFixed(2)
  );
  console.log("Altitude Min [m]: ", tcxData.altitudeTrackerMin.toFixed(2));
  console.log("Altitude Max [m]: ", tcxData.altitudeTrackerMax.toFixed(2));

  const secondsPerKm =
    tcxData.accumulatedTime / (tcxData.accumulatedDistance / 1000);
  const minPerKm = Math.trunc(
    Math.trunc(tcxData.accumulatedTime / 60) /
      (tcxData.accumulatedDistance / 1000)
  );
  const diffPace = secondsPerKm - minPerKm * 60;

  console.log("Average Pace: ", minPerKm + ":" + Math.round(diffPace));
  console.log("Maximum Run Cadence: ", tcxData.maxRunCadence);
  console.log("Maximum Speed: ", tcxData.maxSpeed.toFixed(2));
  console.log(
    "Average Heartrate [bpm]: ",
    Math.round(tcxData.accumulatedHR / tcxData.heartrateCounter)
  );
  console.log("Maximum Heartrate [bpm]: ", tcxData.maxHR);
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
    console.log("Average Heartrate [bpm]: ", lap.lapAvgHeartRate);
    console.log("Maximum Heartrate [bpm]: ", lap.lapMaxHeartRate);
  }
}

export function printAuthor() {
  if (!tcxData.authorData) {
    return;
  }
  console.log("");
  console.log("Author Data:");
  console.log("Name: ", tcxData.authorData.name);
  console.log("Version Major: ", tcxData.authorData.build.versionMajor);
  console.log("Version Minor: ", tcxData.authorData.build.versionMinor);
  console.log("Build Major: ", tcxData.authorData.build.buildMajor);
  console.log("Build Minor: ", tcxData.authorData.build.buildMinor);
  console.log("Language: ", tcxData.authorData.lang);
  console.log("Part Number: ", tcxData.authorData.partNumber);
}

export function printCreator() {
  if (!tcxData.creatorData) {
    return;
  }
  
  console.log("");
  console.log("Creator Data:");
  console.log("Name: ", tcxData.creatorData.name);
  console.log("Unit ID: ", tcxData.creatorData.unitId);
  console.log("Product ID: ", tcxData.creatorData.productID);
  console.log("Version Major: ", tcxData.creatorData.versionMajor);
  console.log("Version Minor: ", tcxData.creatorData.versionMinor);
  console.log("Build Major: ", tcxData.creatorData.buildMajor);
  console.log("Build Minor: ", tcxData.creatorData.buildMinor);
}

export function printHelp() {
  console.error("tcx-ls - List TCX information.");
  console.error("No tcx file provided.");
  console.error("Usage: tcx-ls [Options] TCXFILE.tcx");
  console.error("");
  console.error("Options:");
  console.error("-l : List laps");
}
