import { parseArgs } from "@std/cli/parse-args";
import {
  tcxData,
  commandOptions,
  readGeneralPart,
  readLaps,
  readAuthorData,
} from "./readTcx.ts";
import {
  displayData,
  printAuthor,
  printCreator,
  printHelp,
} from "./printData.ts";
import { parseXmlFileToJson } from "./parseTcxXml.ts";

// Function to read and parse JSON file
async function readJsonFile(filePath: string) {
  try {
    // Read the JSON file as text
    //const jsonText = await Deno.readTextFile(filePath);

    // Parse the JSON text
    //const jsonData = JSON.parse(jsonText);

    const jsonData = await parseXmlFileToJson(filePath);

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

  const args = parseArgs(Deno.args, { boolean: ["l"], _: ["file"] });

  if (args.l) {
    commandOptions.listLaps = true;
  }

  if (args._.length === 0) {
    printHelp();
    Deno.exit(1);
  }

  await readJsonFile(args._[0]);
  displayData();
  printAuthor();
  printCreator();
}
