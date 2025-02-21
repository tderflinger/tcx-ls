![Futuristic runner](./doc/futuristic-jogger.png)

![Logo tcx-ls](./doc/tcx-ls-logo.png)

This is a command line tool to view information from a TCX-file. It displays information like accumulated time, accumulated distance, maximum speed, average pace, maximum run cadence, and more.

Furthermore, export the tracks as a GeoJSON file or the lap information as a CSV file.

The TCX file format is used by Garmin devices and other devices to store data such as GPS coordinates, heart rate, and other sensor data. You can export it for example from the Garmin Connect application.

The TCX file format schema is described on this page: https://www8.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd


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

In order to view the lap details, use the '-l' flag:

```bash
./tcx-ls -l /path/to/your/file.tcx
```

You can also export the tracks as a GeoJSON file:

```bash
./tcx-ls --geojson output.json /path/to/your/file.tcx
```

In order to export the laps as a CSV file:

```bash
./tcx-ls --csv laps.csv /path/to/your/file.tcx
```

## Command Options

| Option          | Description                           |
|-----------------|---------------------------------------|
| `-l`            | View the lap details                  |
| `-c`            | View the creator data                 |
| `-a`            | View the author data                  |
| `--geojson`     | Export the tracks as a GeoJSON file   |
| `--csv`         | Export the laps as a CSV file         |


## Source Installation

As a pre-requisite for running `tcx-ls` from source, you need to have [Deno](https://www.deno.com) installed.

Then, install the dependencies using the following command:

```bash
deno install 
```

## Usage

Specify the TCX file as an argument to view the sports activity information.

```bash
deno run --allow-read main.ts /path/to/your/file.tcx
```

If you want to export GeoJSON or CSV data you need to add --allow-write.

## License

This project is licensed under the MIT License.
