export const tcxData = {
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
    available: false,
    name: "",
    build: {
      versionMajor: 0,
      versionMinor: 0,
      buildMajor: 0,
      buildMinor: 0,
    },
    lang: "",
    partNumber: "",
  },
  creatorData: {
    available: false,
    name: "",
    unitId: "",
    productID: "",
    versionMajor: 0,
    versionMinor: 0,
    buildMajor: 0,
    buildMinor: 0,
  },
};

export class TcxReader {
  #jsonData: any;

  constructor(jsonData: any) {
    this.#jsonData = jsonData;
  }

  readGeneralPart(): any {
    const trainingCenter = this.#jsonData["TrainingCenterDatabase"];
    const activities = trainingCenter["Activities"];
    const activity = activities["Activity"];
    tcxData.activityId = activity["Id"]["#text"];
    tcxData.sport = activity["@attributes"]["Sport"];

    this.readCreatorData(activity);

    return activity["Lap"];
  }

  readCreatorData(trainingCenter: any) {
    const creator = trainingCenter["Creator"];
    if (!creator) {
      return;
    }
    tcxData.creatorData.available = true;
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

  readLaps(laps: any) {
    if (!Array.isArray(laps)) {
      laps = [laps];
    }

    for (const lap of laps) {
      const lapData = {
        lapStartTime: "",
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
      lapData.lapMaxSpeed = parseFloat(lap["MaximumSpeed"]?.["#text"]);
      lapData.lapCalories = parseInt(lap["Calories"]?.["#text"]);
      lapData.lapAvgHeartRate = parseInt(
        lap["AverageHeartRateBpm"]?.["Value"]["#text"]
      );
      lapData.lapMaxHeartRate = parseInt(
        lap["MaximumHeartRateBpm"]?.["Value"]["#text"]
      );
      tcxData.maxHR = Math.max(tcxData.maxHR, lapData.lapMaxHeartRate);
      tcxData.maxSpeed = Math.max(tcxData.maxSpeed, lapData.lapMaxSpeed);

      tcxData.laps.push(lapData);

      tcxData.accumulatedTime += lapData.lapTime;
      tcxData.accumulatedDistance += lapData.lapDistance;
      tcxData.accumulatedCalories += lapData.lapCalories;

      const track = lap["Track"];
      const trackPoints = track["Trackpoint"];
      this.#readTrackPoints(trackPoints);
    }
  }

  readAuthorData(trainingCenter: any) {
    const author = trainingCenter["Author"];
    if (!author) {
      return;
    }
    tcxData.authorData.available = true;
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

  #readTrackPoints(trackPoints: any) {
    for (const trackPoint of trackPoints) {
      const altitude = trackPoint?.["AltitudeMeters"]?.["#text"];
      tcxData.altitudeTrackerMax = Math.max(
        tcxData.altitudeTrackerMax,
        altitude
      );
      tcxData.altitudeTrackerMin = Math.min(
        tcxData.altitudeTrackerMin,
        altitude
      );
      /*
      console.log("Trackpoint Time: ", trackPoint?.["Time"]["#text"]);
      console.log("Altitude [m]: ", trackPoint?.["AltitudeMeters"]["#text"]);
      console.log("Distance [m]: ", trackPoint?.["DistanceMeters"]["#text"]);
      console.log("Heartrate [bpm]: ", trackPoint?.["HeartRateBpm"]["Value"]["#text"]);
  
      console.log("Position Latitude: ", trackPoint?.["Position"]?.["LatitudeDegrees"]["#text"]);
      console.log("Position Longitude: ", trackPoint?.["Position"]?.["LongitudeDegrees"]["#text"]); */

      tcxData.accumulatedHR += parseInt(
        trackPoint?.["HeartRateBpm"]?.["Value"]["#text"]
      );
      tcxData.heartrateCounter++;
      tcxData.maxRunCadence = Math.max(
        tcxData.maxRunCadence,
        trackPoint?.["Extensions"]?.["ns3:TPX"]?.["ns3:RunCadence"]["#text"]
      );
      tcxData.maxSpeed = Math.max(
        tcxData.maxSpeed,
        trackPoint?.["Extensions"]?.["ns3:TPX"]?.["ns3:Speed"]["#text"]
      );
      tcxData.maxHR = Math.max(
        tcxData.maxHR,
        trackPoint?.["HeartRateBpm"]?.["Value"]["#text"]
      );
      tcxData.coordinates.push([
        parseFloat(trackPoint?.["Position"]?.["LongitudeDegrees"]["#text"]),
        parseFloat(trackPoint?.["Position"]?.["LatitudeDegrees"]["#text"]),
      ]);
    }
  }
}

export const commandOptions = {
  listLaps: false,
};
