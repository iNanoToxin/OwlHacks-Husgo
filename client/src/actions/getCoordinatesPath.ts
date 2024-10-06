"use server";

import { TCordinates } from "@/app/(app)/page";

export async function getCoordinatesPath({
  fromCordinates,
  toCordinates,
}: {
  fromCordinates: TCordinates;
  toCordinates: TCordinates;
}) {
  const response = fetch("http://127.0.0.1:5000/api/get-path", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      "graph_type":"walk",
      "longitude_x1": fromCordinates.longitude,
      "latitude_y1": fromCordinates.latitude,
      "longitude_x2": toCordinates.longitude,
      "latitude_y2": toCordinates.latitude
    }),
  });
  return response;
}