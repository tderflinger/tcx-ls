import { parseArgs } from "@std/cli/parse-args";
import {
  tcxData,
  TcxReader,
} from "./tcx-reader.ts";
import {
  TcxConsolePrinter,
} from "./tcx-console-printer.ts";
import { parseXmlFileToJson } from "./parse-tcx-xml.ts";

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
  const tcxConsolePrinter = new TcxConsolePrinter(tcxData);
  if (Deno.args.length === 0) {
    tcxConsolePrinter.printHelp();
    Deno.exit(1);
  }

  const args = parseArgs(Deno.args, { boolean: ["l", "c", "a"], _: ["file"] });

  if (args._.length === 0) {
    tcxConsolePrinter.printHelp();
    Deno.exit(1);
  }

  await readTcxFile(String(args._[0]));

  tcxConsolePrinter.displayData(args.l);

  if (args.a) {
    tcxConsolePrinter.printAuthor();
  }

  if (args.c) {
    tcxConsolePrinter.printCreator();
  }
}
