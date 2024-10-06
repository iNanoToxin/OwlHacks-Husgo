"use client";

import AutocompleteLocationInput from "@/components/AutocompleteLocationInput";
import MapComponent from "@/components/Map";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

import { getCoordinatesPath } from "@/actions/getCoordinatesPath";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
export type TCordinates = {
  latitude: number;
  longitude: number;
};
export default function MapApp() {
  const { toast } = useToast();
  const [fromCordinates, setFromCordinates] = useState<TCordinates | undefined>();
  const [toCordinates, setToCordinates] = useState<TCordinates | undefined>();
  const [travelModel, setTravelMode] = useState<"driving" | "walk" | "bike">("walk");

  useEffect(() => {
    console.log({ fromCordinates, toCordinates });
  }, [fromCordinates, toCordinates]);

  //[longitude, latitude]
  const [coordinatesPath, setCoordinatesPath] = useState<[number, number][]>([]);

  async function handleGetPath() {
    if (fromCordinates && toCordinates) {
      const response = await getCoordinatesPath({
        fromCordinates,
        toCordinates,
      });

      setCoordinatesPath(response);
    } else {
      toast({
        title: "Please select a location to go to",
        variant: "destructive",
      })
      console.warn("Please select a location to go to");
    }
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFromCordinates({ latitude, longitude });

        console.log({ latitude, longitude })
      });
    }

  }, []);

  return (
    <div className="size-screen relative">
      <div className="absolute top-4 left-6 w-full">
        <div className="relative flex z-10 flex-col gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg max-w-[220px] sm:max-w-[350px] sm:min-w-[150px] mr-6">
          <div className="relative flex">
            <i
              className="fa-solid fa-location-arrow absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 "
              style={{ color: fromCordinates ? "blue" : "red" }}
            ></i>
            <AutocompleteLocationInput
              placeholder="Search place to go"
              state={toCordinates}
              setState={setToCordinates}
            />
            <Button
              asChild
              variant={"ghost"}
              className="ml-2 pt-3 absolute right-0.5 top-1/2 -translate-y-1/2"
            >
              <i className="fa-solid fa-ellipsis-vertical text-lg"></i>
            </Button>
            {/*
            <Dialog>
              <DialogTrigger></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>More Options</DialogTitle>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            */}
          </div>

          <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:justify-between">
            <div className="flex gap-2">
              <Button
                variant={"ghost"}
                style={{ backgroundColor: travelModel === "walk" ? "lightGray" : undefined }}
                onClick={() => setTravelMode("walk")}
              >
                <i className="fa-solid fa-person-walking text-xl"></i>
              </Button>
              <Button
                variant={"ghost"}
                style={{ backgroundColor: travelModel === "driving" ? "lightGray" : undefined }}
                onClick={() => setTravelMode("driving")}
              >
                <i className="fa-solid fa-car text-xl"></i>
              </Button>
              <Button
                variant={"ghost"}
                style={{ backgroundColor: travelModel === "bike" ? "lightGray" : undefined }}
                onClick={() => setTravelMode("bike")}
              >
                <i className="fa-solid fa-bicycle text-xl"></i>
              </Button>
            </div>
            <Button onClick={() => handleGetPath()}>Get Path</Button>
          </div>
        </div>

        <div className="h-full w-screen"></div>
      </div>

      <div className="size-full z-1 relative">
        <MapComponent coordinatesPath={coordinatesPath} fromCordinates={fromCordinates} />
      </div>
    </div>
  );
}
