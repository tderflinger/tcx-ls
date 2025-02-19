import {
  calculateAccumulatedDistance,
  calculateAccumulatedTimeMinutes,
  calculateAccumulatedTimeSeconds,
  calculateAltituteAscent,
} from "./calculations.ts";
import { TcxData } from "./tcx-reader.ts";

export class TcxConsolePrinter {
  #tcxData: TcxData;

  constructor(tcxData: TcxData) {
    this.#tcxData = tcxData;
  }

  displayData(listLaps: boolean) {
    console.log("Activity ID: ", this.#tcxData.activityId);
    console.log("Sport: ", this.#tcxData.sport);
    console.log("");
    console.log(
      "Accumulated Time: ",
      calculateAccumulatedTimeMinutes(this.#tcxData.accumulatedTime) +
        ":" +
        calculateAccumulatedTimeSeconds(this.#tcxData.accumulatedTime)
    );
    console.log(
      "Accumulated Distance [km]: ",
      calculateAccumulatedDistance(this.#tcxData.accumulatedDistance)
    );
    console.log("Accumulated Calories: ", this.#tcxData.accumulatedCalories);
    this.#tcxData.altitudeTrackerMax &&
      console.log(
        "Altitude Ascent [m]: " +
          calculateAltituteAscent(
            this.#tcxData.altitudeTrackerMin || 0,
            this.#tcxData.altitudeTrackerMax
          )
      );
    this.#tcxData.altitudeTrackerMin &&
      console.log(
        "Altitude Min [m]: " + this.#tcxData.altitudeTrackerMin.toFixed(2)
      );
    this.#tcxData.altitudeTrackerMax &&
      console.log(
        "Altitude Max [m]: " + this.#tcxData.altitudeTrackerMax.toFixed(2)
      );
    const secondsPerKm =
      this.#tcxData.accumulatedTime /
      (this.#tcxData.accumulatedDistance / 1000);
    const minPerKm = Math.trunc(
      Math.trunc(this.#tcxData.accumulatedTime / 60) /
        (this.#tcxData.accumulatedDistance / 1000)
    );
    const diffPace = secondsPerKm - minPerKm * 60;

    console.log("Average Pace: ", minPerKm + ":" + Math.round(diffPace));
    this.#tcxData.maxRunCadence &&
      console.log("Maximum Run Cadence: " + this.#tcxData.maxRunCadence);
    this.#tcxData.maxSpeed &&
      console.log("Maximum Speed: " + this.#tcxData.maxSpeed.toFixed(2));
    this.#tcxData.accumulatedHR &&
      this.#tcxData.heartrateCounter &&
      console.log(
        "Average Heartrate [bpm]: " +
          Math.round(
            this.#tcxData.accumulatedHR / (this.#tcxData.heartrateCounter || 1)
          )
      );
    this.#tcxData.maxHR &&
      console.log("Maximum Heartrate [bpm]: " + this.#tcxData.maxHR);
    console.log("");

    console.log("Number Laps:", this.#tcxData.laps.length);

    if (listLaps) {
      this.printLaps();
    }
  }

  printLaps() {
    for (const lap of this.#tcxData.laps) {
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

  printAuthor() {
    if (!this.#tcxData.authorData?.available) {
      return;
    }

    console.log("");
    console.log("Author Data");
    console.log("");
    console.log(`Name: ${this.#tcxData.authorData.name}`);
    console.log(
      `Version Major: ${this.#tcxData.authorData.build.versionMajor}`
    );
    console.log(
      `Version Minor: ${this.#tcxData.authorData.build.versionMinor}`
    );
    console.log(`Build Major: ${this.#tcxData.authorData.build.buildMajor}`);
    console.log(`Build Minor: ${this.#tcxData.authorData.build.buildMinor}`);
    console.log(`Language: ${this.#tcxData.authorData.lang}`);
    console.log(`Part Number: ${this.#tcxData.authorData.partNumber}`);
  }

  printCreator() {
    if (!this.#tcxData.creatorData?.available) {
      return;
    }

    console.log("");
    console.log("Creator Data");
    console.log("");
    console.log(`Name: ${this.#tcxData.creatorData.name}`);
    console.log(`Unit ID: ${this.#tcxData.creatorData.unitId}`);
    console.log(`Product ID: ${this.#tcxData.creatorData.productID}`);
    console.log(`Version Major: ${this.#tcxData.creatorData.versionMajor}`);
    console.log(`Version Minor: ${this.#tcxData.creatorData.versionMinor}`);
    console.log(`Build Major: ${this.#tcxData.creatorData.buildMajor}`);
    console.log(`Build Minor: ${this.#tcxData.creatorData.buildMinor}`);
  }

  printHelp() {
    console.error("tcx-ls - List TCX information.");
    console.error("No tcx file provided.");
    console.error("Usage: tcx-ls [Options] TCXFILE.tcx");
    console.error("");
    console.error("Options:");
    console.error("-l : List laps");
    console.error("-c : List creator data");
    console.error("-a : List author data");
  }
}
