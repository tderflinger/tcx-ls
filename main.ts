import { parseArgs } from "@std/cli/parse-args";
import { tcxData, TcxReader } from "./src/tcx-reader.ts";
import { TcxConsolePrinter } from "./src/tcx-console-printer.ts";
import { parseXmlFileToJson } from "./src/parse-tcx-xml.ts";

async function writeGeoJsonFile(filePath: string) {
  const geoJson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [] as [number, number][],
        },
      },
    ],
  };
  geoJson.features[0].geometry.coordinates = tcxData.coordinates;

  try {
    await Deno.writeTextFile(
      filePath,
      JSON.stringify(geoJson, null, 2)
    );
  } catch (error) {
    console.error("Error writing the GeoJSON file:", error);
  }
}

async function readTcxFile(filePath: string) {
  try {
    const jsonData = await parseXmlFileToJson(filePath);
    if (!jsonData) {
      console.error("Error reading or parsing the file");
      Deno.exit(1);
    }

    const tcxReader = new TcxReader(jsonData);
    tcxReader.readLaps(tcxReader.readGeneralPart());
    tcxReader.readAuthorData(
      (jsonData as { [key: string]: any })["TrainingCenterDatabase"]
    );
  } catch (error) {
    console.error("Error reading or parsing the file:", error);
  }
}

if (import.meta.main) {
  const tcxConsolePrinter = new TcxConsolePrinter(tcxData);
  if (Deno.args.length === 0) {
    tcxConsolePrinter.printHelp();
    Deno.exit(1);
  }

  const args = parseArgs(Deno.args, {
    boolean: ["l", "c", "a"],
    string: ["geojson"],
    alias: { _: ["file"] },
  });

  if (args._.length === 0) {
    tcxConsolePrinter.printHelp();
    Deno.exit(1);
  }

  await readTcxFile(String(args._[0]));

  if (args.geojson) {
    const geojsonFilePath = args.geojson;
    await writeGeoJsonFile(geojsonFilePath);
  }

  tcxConsolePrinter.displayData(args.l);

  if (args.a) {
    tcxConsolePrinter.printAuthor();
  }

  if (args.c) {
    tcxConsolePrinter.printCreator();
  }
}
