import { ImageSlider } from "./imageSlider";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import './App.css'

import { httpProtocol, host, port, weatherApiKey, googleMapsApiKey } from './env.variables';

const API_URL = `${httpProtocol}://${host}:${port}`;

const retrieveImages = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const retrieveWeather = async () => {
  const city = window.localStorage.getItem('city');
  const response = await axios.get(`https://api.weatherapi.com/v1/current.json?q=${city}&key=${weatherApiKey}`);
  return response.data;
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showCity);
} else {
  console.log("Geolocation is not supported by this browser.");
}

async function showCity(position: { coords: { latitude: any; longitude: any; }; }) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const urlGeo = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`;

  const geoResponse = await fetch(urlGeo);

  const geoResult = await geoResponse.json();
  const city = geoResult.results[0].address_components.find((component: { types: string | string[]; }) =>
    component.types.includes("locality")
  ).long_name;

  window.localStorage.setItem('city', city)
}
function App() {
  const { data: images, error: errorImages, isLoading: isLoadingImages } = useQuery("imagesData", retrieveImages);
  const { data: weather, error: errorWeather, error: isLoadingWeather } = useQuery("weatherData", retrieveWeather);

  const queryClient = useQueryClient()

  useEffect(() => {
    const weathrTimer = setInterval(() => {
      queryClient.invalidateQueries('weatherData')
    }, 1000 * 60 * 60);
    return () => clearInterval(weathrTimer);
  }, []);

  if (isLoadingImages || isLoadingWeather) return <div>Fetching data...</div>;
  if (errorImages || errorWeather) return <div>An error occurred.</div>;
  const city = window.localStorage.getItem('city');
  const { current, } = weather
  const { condition: { icon } } = current
  const temperature = current.temp_c

  const data = { city, icon, temperature }

  return (
    <section className="container-section">    <div style={{ maxWidth: `${screen.width - 3 / 100 * screen.width}px`, width: "100%", aspectRatio: "10 / 5.05", margin: "0 auto" }}><ImageSlider images={images} data={data} /></div>
    </section>
  )
}

export default App