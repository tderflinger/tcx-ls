import { assertEquals } from "jsr:@std/assert";
import { TcxConsolePrinter } from "../src/tcx-console-printer.ts";
import { TcxData } from "../src/tcx-reader.ts";

Deno.test("Test that authorData is correctly written to the console.", () => {
  // Step 1: Mock console.log
  const consoleOutput: string[] = [];
  const originalConsoleLog = console.log;

  // Replace console.log with a mock function
  console.log = (msg: string) => {
    consoleOutput.push(msg);
  };

  const tcxData = {
    authorData: {
      available: true,
      name: "John Test",
      build: {
        versionMajor: 1,
        versionMinor: 2,
        buildMajor: 3,
        buildMinor: 4,
      },
      lang: "en",
      partNumber: "123456",
    },
  };

  const tcxConsolePrinter = new TcxConsolePrinter(tcxData as TcxData);
  tcxConsolePrinter.printAuthor();

  assertEquals(consoleOutput, [
    "",
    "Author Data",
    "",
    "Name: John Test",
    "Version Major: 1",
    "Version Minor: 2",
    "Build Major: 3",
    "Build Minor: 4",
    "Language: en",
    "Part Number: 123456",
  ]);

  // Step 4: Restore the original console.log
  console.log = originalConsoleLog;
});

Deno.test("Test that creatorData is correctly written to the console.", () => {
  // Step 1: Mock console.log
  const consoleOutput: string[] = [];
  const originalConsoleLog = console.log;

  // Replace console.log with a mock function
  console.log = (msg: string) => {
    consoleOutput.push(msg);
  };

  const tcxData = {
    creatorData: {
      available: true,
      name: "John Test",
      unitId: "123456",
      productID: "123456",
      versionMajor: 1,
      versionMinor: 2,
      buildMajor: 3,
      buildMinor: 4,
    },
  };

  const tcxConsolePrinter = new TcxConsolePrinter(tcxData as TcxData);
  tcxConsolePrinter.printCreator();

  assertEquals(consoleOutput, [
    "",
    "Creator Data",
    "",
    "Name: John Test",
    "Unit ID: 123456",
    "Product ID: 123456",
    "Version Major: 1",
    "Version Minor: 2",
    "Build Major: 3",
    "Build Minor: 4",
  ]);

  // Step 4: Restore the original console.log
  console.log = originalConsoleLog;
});
