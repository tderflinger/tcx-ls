let tcxData = {
  activityId: String,
  sport: String,
  accumulatedTime: 0,
  accumulatedDistance: 0,
  accumulatedCalories: 0,
  maxRunCadence: 0,
  maxSpeed: 0,
  maxHR: 0,
  averageHR: 0,
  heartrateCounter: 0,
  accumulatedHR: 0,
  laps: [] as Array<{
    lapStartTime: string;
    lapTime: number;
    lapDistance: number;
    lapMaxSpeed: number;
    lapCalories: number;
    lapAvgHeartRate: number;
    lapMaxHeartRate: number;
  }>,
  altitudeTrackerMax: 0,
  altitudeTrackerMin: 99999999999,
  coordinates: [] as Array<[number, number]>,
  authorData: {
    name: String,
    build: {
      versionMajor: Number,
      versionMinor: Number,
      buildMajor: Number,
      buildMinor: Number,
    },
    lang: String,
    partNumber: String,
  },
  creatorData: {
    name: String,
    unitId: String,
    productID: String,
    versionMajor: String,
    versionMinor: String,
    buildMajor: String,
    buildMinor: String,
  },
};

let commandOptions = {
  listLaps: false,
};

function readGeneralPart(jsonData): any {
  const trainingCenter = jsonData["TrainingCenterDatabase"];
  const activities = trainingCenter["Activities"];
  const activity = activities["Activity"];
  tcxData.activityId = activity["Id"]["#text"];
  tcxData.sport = activity["@attributes"]["Sport"];

  readCreatorData(activity);

  return activity["Lap"];
}

function readLaps(laps) {
  for (const lap of laps) {
    let lapData = {
      lapStartTime: String,
      lapTime: 0,
      lapDistance: 0,
      lapMaxSpeed: 0,
      lapCalories: 0,
      lapAvgHeartRate: 0,
      lapMaxHeartRate: 0,
    };

    lapData.lapStartTime = lap["@attributes"]["StartTime"];
    lapData.lapTime = parseFloat(lap["TotalTimeSeconds"]["#text"]);
    lapData.lapDistance = parseFloat(lap["DistanceMeters"]["#text"]);
    lapData.lapMaxSpeed = parseFloat(lap["MaximumSpeed"]["#text"]);
    lapData.lapCalories = parseInt(lap["Calories"]["#text"]);
    lapData.lapAvgHeartRate = parseInt(
      lap["AverageHeartRateBpm"]["Value"]["#text"]
    );
    lapData.lapMaxHeartRate = parseInt(
      lap["MaximumHeartRateBpm"]["Value"]["#text"]
    );
    tcxData.maxHR = Math.max(tcxData.maxHR, lapData.lapMaxHeartRate);
    tcxData.maxSpeed = Math.max(tcxData.maxSpeed, lapData.lapMaxSpeed);

    tcxData.laps.push(lapData);

    tcxData.accumulatedTime += lapData.lapTime;
    tcxData.accumulatedDistance += lapData.lapDistance;
    tcxData.accumulatedCalories += lapData.lapCalories;

    const track = lap["Track"];
    const trackPoints = track["Trackpoint"];
    readTrackPoints(trackPoints);
  }
}

function readTrackPoints(trackPoints) {
  for (const trackPoint of trackPoints) {
    const altitude = trackPoint?.["AltitudeMeters"]["#text"];
    tcxData.altitudeTrackerMax = Math.max(tcxData.altitudeTrackerMax, altitude);
    tcxData.altitudeTrackerMin = Math.min(tcxData.altitudeTrackerMin, altitude);
    /*
    console.log("Trackpoint Time: ", trackPoint?.["Time"]["#text"]);
    console.log("Altitude [m]: ", trackPoint?.["AltitudeMeters"]["#text"]);
    console.log("Distance [m]: ", trackPoint?.["DistanceMeters"]["#text"]);
    console.log("Heartrate [bpm]: ", trackPoint?.["HeartRateBpm"]["Value"]["#text"]);

    console.log("Position Latitude: ", trackPoint?.["Position"]?.["LatitudeDegrees"]["#text"]);
    console.log("Position Longitude: ", trackPoint?.["Position"]?.["LongitudeDegrees"]["#text"]); */

    tcxData.accumulatedHR += parseInt(
      trackPoint?.["HeartRateBpm"]["Value"]["#text"]
    );
    tcxData.heartrateCounter++;
    tcxData.maxRunCadence = Math.max(
      tcxData.maxRunCadence,
      trackPoint?.["Extensions"]["ns3:TPX"]["ns3:RunCadence"]["#text"]
    );
    tcxData.maxSpeed = Math.max(
      tcxData.maxSpeed,
      trackPoint?.["Extensions"]["ns3:TPX"]["ns3:Speed"]["#text"]
    );
    tcxData.maxHR = Math.max(
      tcxData.maxHR,
      trackPoint?.["HeartRateBpm"]["Value"]["#text"]
    );
    tcxData.coordinates.push([
      parseFloat(trackPoint?.["Position"]?.["LongitudeDegrees"]["#text"]),
      parseFloat(trackPoint?.["Position"]?.["LatitudeDegrees"]["#text"]),
    ]);
  }
}

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

function readAuthorData(trainingCenter) {
  const author = trainingCenter["Author"];
  tcxData.authorData.name = author["Name"]["#text"];
  tcxData.authorData.build.versionMajor =
    author["Build"]["Version"]["VersionMajor"]["#text"];
  tcxData.authorData.build.versionMinor =
    author["Build"]["Version"]["VersionMinor"]["#text"];
  tcxData.authorData.build.buildMajor =
    author["Build"]["Version"]["BuildMajor"]["#text"];
  tcxData.authorData.build.buildMinor =
    author["Build"]["Version"]["BuildMinor"]["#text"];
  tcxData.authorData.lang = author["LangID"]["#text"];
  tcxData.authorData.partNumber = author["PartNumber"]["#text"];
}

function readCreatorData(trainingCenter) {
  const creator = trainingCenter["Creator"];
  tcxData.creatorData.name = creator["Name"]["#text"];
  tcxData.creatorData.unitId = creator["UnitId"]["#text"];
  tcxData.creatorData.productID = creator["ProductID"]["#text"];
  tcxData.creatorData.versionMajor =
    creator["Version"]["VersionMajor"]["#text"];
  tcxData.creatorData.versionMinor =
    creator["Version"]["VersionMinor"]["#text"];
  tcxData.creatorData.buildMajor = creator["Version"]["BuildMajor"]["#text"];
  tcxData.creatorData.buildMinor = creator["Version"]["BuildMinor"]["#text"];
}

function displayData() {
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

  console.log("");
  console.log("Author Data:");
  console.log("Name: ", tcxData.authorData.name);
  console.log("Version Major: ", tcxData.authorData.build.versionMajor);
  console.log("Version Minor: ", tcxData.authorData.build.versionMinor);
  console.log("Build Major: ", tcxData.authorData.build.buildMajor);
  console.log("Build Minor: ", tcxData.authorData.build.buildMinor);
  console.log("Language: ", tcxData.authorData.lang);
  console.log("Part Number: ", tcxData.authorData.partNumber);

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

function printHelp() {
  console.error("tcx-ls - List TCX information.");
  console.error("No tcx file provided.");
  console.error("Usage: tcx-ls [Options] TCXFILE.tcx");
  console.error("");
  console.error("Options:");
  console.error("-l : List laps");
}

// Function to read and parse JSON file
async function readJsonFile(filePath: string) {
  try {
    // Read the JSON file as text
    const jsonText = await Deno.readTextFile(filePath);

    // Parse the JSON text
    const jsonData = JSON.parse(jsonText);

    const laps = readGeneralPart(jsonData);
    readLaps(laps);
    readAuthorData(jsonData["TrainingCenterDatabase"]);

    await Deno.writeTextFile(
      "./coordinates.txt",
      JSON.stringify(tcxData.coordinates, null, 2)
    );
  } catch (error) {
    console.error("Error reading or parsing the file:", error);
  }
}

if (import.meta.main) {
  if (Deno.args.length === 0) {
    printHelp();
    Deno.exit(1);
  }

  const arg1 = Deno.args[0];
  let filePath = arg1;

  if (arg1 === "-l") {
    commandOptions.listLaps = true;
    filePath = Deno.args[1];
  }

  if (filePath === undefined) {
    printHelp();
    Deno.exit(1);
  }

  await readJsonFile(filePath);
  displayData();
}
