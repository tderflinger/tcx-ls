import { parseArgs } from "@std/cli/parse-args";
import {
  tcxData,
  commandOptions,
  TcxReader,
} from "./tcx-reader.ts";
import {
  displayData,
  printAuthor,
  printCreator,
  printHelp,
} from "./print-data.ts";
import { parseXmlFileToJson } from "./parse-tcx-xml.ts";

// Function to read and parse JSON file
async function readTcxFile(filePath: string) {
  try {
    const jsonData = await parseXmlFileToJson(filePath);

    const tcxReader = new TcxReader(jsonData);

    tcxReader.readLaps(tcxReader.readGeneralPart());
    tcxReader.readAuthorData(jsonData["TrainingCenterDatabase"]);

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

  const args = parseArgs(Deno.args, { boolean: ["l", "c", "a"], _: ["file"] });

  if (args.l) {
    commandOptions.listLaps = true;
  }

  if (args._.length === 0) {
    printHelp();
    Deno.exit(1);
  }

  await readTcxFile(args._[0]);
  displayData();

  if (args.a) {
    printAuthor(tcxData);
  }

  if (args.c) {
    printCreator(tcxData);
  }
}
