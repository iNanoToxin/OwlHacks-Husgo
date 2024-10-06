"use client";

import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { Input } from "./ui/input";
import { useState } from "react";
import { TCordinates } from "@/app/app/page";
import { useToast } from "@/hooks/use-toast";

export default function AutocompleteLocationInput({
  placeholder,
  state,
  setState,
}: {
  placeholder: string;
  state: TCordinates | undefined;
  setState: React.Dispatch<React.SetStateAction<TCordinates | undefined>>;
}) {
  const {toast} = useToast()

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | undefined>(undefined);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    throw new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");
  }

  const libraries: "places"[] = ["places"];

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete!.getPlace()

      if (!place.formatted_address?.includes("Philadelphia")) {
        console.log(place.formatted_address)
        toast({
          title: "Please select a location in Philadelphia",
          description: "We unfortunately have only trained crime data in Philadelphia for now.",
          duration: 2000,
          variant: "destructive",
        })
        return
      }
      
      if (place.geometry) {
        const lat = place.geometry.location?.lat()
        const lng = place.geometry.location?.lng()
        setState({ latitude: lat as number, longitude: lng as number })
      }
    }
  };

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  return (
    <div className="w-full">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} libraries={libraries}>
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={handlePlaceSelect}
          options={{
            componentRestrictions: {
              country: "us" 
            },
          }}
        >
          <Input placeholder={placeholder} className="w-full" />
        </Autocomplete>
      </LoadScript>
    </div>
  );
}
