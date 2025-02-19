![Logo tcx-ls](./doc/tcx-ls-logo.png)

This is a command line tool to view information from a TCX-file. It displays information like accumulated time, accumulated distance, maximum speed, average pace, maximum run cadence, and more.

The TCX file format is used by Garmin devices and other devices to store data such as GPS coordinates, heart rate, and other sensor data. You can export it for example from the Garmin Connect application.

The TCX file format schema is described on this page: https://www8.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd

With the optional '-l' flag you can also display the individual laps of the activity.

## Binary Release

You can download the binary version of the CLI tool from the releases page. The binary is compiled for x86 Linux.

First, make it executable, like so:

```bash
chmod +x ./tcx-ls
```

Start the application via:

```bash
./tcx-ls /path/to/your/file.tcx
```

## Source Installation

Install the dependencies using the following command:

```bash
deno install 
```

## Usage

Specify the TCX file as an argument to view the sports activity information.

```bash
deno run --allow-read src/main.ts /path/to/your/file.tcx
```

## License

This project is licensed under the MIT License.
