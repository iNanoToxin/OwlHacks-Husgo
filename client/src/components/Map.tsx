"use client";

if (!process.env.NEXT_PUBLIC_MAPBOX_KEY) {
  throw new Error("Missing NEXT_PUBLIC_MAPBOX_KEY");
}

import mapboxgl, { LngLat, LngLatLike } from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";

import crimeDataGeoJSON from "@/utils/crimeDataGeoJSON.json";
import { TCordinates } from "@/app/app/page";

import file from "@/components/path.json"

export default function MapComponent({cordinatesPath}: {cordinatesPath: TCordinates[]}) {
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

    const drawLines = () => {
      mapRef.current?.on('load', () => {
        const geojson: any = {
          type: 'LineString',
          coordinates: JSON.parse(JSON.stringify(file)),
        }

        mapRef.current?.addSource('points', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [-77.03238901390978, 38.913188059745586]
                },
                properties: {} // Add this empty object
              }
            ]
          }
        });
    
        // Add the lines to the map
        mapRef.current?.addLayer({
          id: 'lines',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson,
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#888',
            'line-width': 5,
          },
        })
    
        // Fit the map to the bounds of the coordinates
        const bounds = new mapboxgl.LngLatBounds()
        JSON.parse(JSON.stringify(file)).forEach((coord: any) => bounds.extend(coord))
        mapRef.current?.fitBounds(bounds, { padding: 20 })
      })
    };
    drawLines()


    //squares map crime
    /*
    mapRef.current.on("load", () => {
      // @ts-ignore
      mapRef.current.addSource("crime-data", {
        type: "geojson",
        data: crimeDataGeoJSON as any,
      });

      // @ts-ignore
      mapRef.current.addLayer({
        id: "philly-fill",
        type: "fill",
        source: "crime-data",
        paint: {
          "fill-color": ["get", "color"], // Optional: Get color from properties
          "fill-opacity": 0.5, // Set the opacity of the polygon
        },
      });
    });
    */
  }, []);

  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      // @ts-ignore
      ref={mapContainerRef}
      className="map-container"
    />
  );
}
