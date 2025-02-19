import { TcxData } from "./tcx-reader.ts";

export async function writeGeoJsonFile(filePath: string, tcxData: TcxData) {
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
    await Deno.writeTextFile(filePath, JSON.stringify(geoJson, null, 2));
  } catch (error) {
    console.error("Error writing the GeoJSON file:", error);
  }
}
