import { ImageSlider } from "./imageSlider";
import { useQuery } from "react-query";
import axios from "axios";
import { useState } from "react";
import './App.css'


const retrieveImages = async () => {
  const response = await axios.get("http://localhost:3000/");
  return response.data;
};

// First, get the user's location coordinates using the Geolocation API
if (navigator.geolocation) {
  !navigator.geolocation.getCurrentPosition(showCity);
} else {
  console.log("Geolocation is not supported by this browser.");
}

// Then, pass the location coordinates to a Geocoding API to get the city name
function showCity(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Make a request to a Geocoding API (e.g. Google Maps Geocoding API)
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBhIekNKQB-blGKBY2csHf5dUcm9mgtH50`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Parse the city name from the API response
      const city = data.results[0].address_components.find((component) =>
        component.types.includes("locality")
      ).long_name;

      console.log(`Your city is ${city}.`);
      window.localStorage.setItem('city', city)
    })
    .catch((error) => console.log(error));
}

function App() {
  const { data: images, error, isLoading } = useQuery("imagesData", retrieveImages);
  const [city, setCity] = useState(window.localStorage.getItem('city')
  );

  if (isLoading) return <div>Fetching images...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (

    <>    <div style={{ maxWidth: `${screen.width - 3 / 100 * screen.width}px`, width: "100%", aspectRatio: "10 / 5.05", margin: "0 auto" }}><ImageSlider images={images} city={city} /></div>
    </>
  )
}

export default App