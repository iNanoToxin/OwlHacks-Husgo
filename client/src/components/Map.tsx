"use client";

if (!process.env.NEXT_PUBLIC_MAPBOX_KEY) {
  throw new Error("Missing NEXT_PUBLIC_MAPBOX_KEY");
}

import mapboxgl, {  } from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";


export default function MapComponent({coordinatesPath}: {coordinatesPath: number[][]}) {
  const mapContainerRef = useRef<HTMLElement | string>("");
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_KEY) {
      throw new Error("Missing NEXT_PUBLIC_MAPBOX_KEY");
    }
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-75.16, 39.95],
      zoom: 13,
      maxBounds: [-75.2, 39.8, -75.1, 40.1],
      maxZoom: 24,
    });

    mapRef.current.on("load", () => {
      if (!mapRef.current!.getSource('line-source')) {
        mapRef.current!.addSource("line-source", {
            type: "geojson",
            // @ts-expect-error ppooop
            data: {
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: coordinatesPath,
                },
            },
        });
      }

      if (!mapRef.current!.getLayer('line-layer')) {
        mapRef.current!.addLayer({
            id: "line-layer",
            type: "line",
            source: "line-source",
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                "line-color": "#ff0000",
                "line-width": 5,
            },
        });
      }
    });
  }, []);

  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      // @ts-expect-error ppooop
      ref={mapContainerRef}
      className="map-container"
    />
  );
}
