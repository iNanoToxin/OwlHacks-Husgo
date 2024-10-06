"use client";

import AutocompleteLocationInput from "@/components/AutocompleteLocationInput";
import MapComponent from "@/components/Map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export type TCordinates = {
  latitude: number
  longitude: number
}
export default function MapApp() {
  const [fromCordinates, setFromCordinates] = useState<TCordinates | undefined>()
  const [toCordinates, setToCordinates] = useState<TCordinates | undefined>()

  const [cordinatesPath, setCordinatesPath] = useState<TCordinates[]>([])

  return (
    <div className="size-screen relative">
      <div className="absolute flex top-4 left-6 z-10 flex-col gap-2 p-4 bg-white dark:bg-slate-800 rounded-lg max-w-[350px] min-w-[200px] w-full">
        <AutocompleteLocationInput placeholder="From" state={fromCordinates} setState={setFromCordinates} />
        <AutocompleteLocationInput placeholder="To" state={toCordinates} setState={setToCordinates} />

        <Button>
          Get Path
        </Button>
      </div>

      <div className="size-full z-0">
        <MapComponent cordinatesPath={cordinatesPath}/>
      </div>
    </div>
  )
}
