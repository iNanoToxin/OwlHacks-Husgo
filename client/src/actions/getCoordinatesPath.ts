"use server";

import { TCordinates } from "@/app/(app)/page";

export async function getCoordinatesPath({
  fromCordinates,
  toCordinates,
}: {
  fromCordinates: TCordinates;
  toCordinates: TCordinates;
}) {
  console.log("asdfsdf")
  const response = await fetch("https://getcoordinatespath-1041591461837.us-central1.run.app", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      "graph_type":"walk",
      "longitude_x1": -75.0554076,
      "latitude_y1": 40.0866726,
      "longitude_x2": -75.1957886,
      "latitude_y2": 39.9522188
    }),
  });
  console.log(response);

  const coordinatePath: [number, number][] = await response.json();

  return coordinatePath;
}
