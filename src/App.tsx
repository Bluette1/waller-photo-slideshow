import { ImageSlider } from "./imageSlider";
import { useQuery } from "react-query";
import axios from "axios";
import { useState } from "react";
import './App.css'


const retrieveImages = async () => {
  const response = await axios.get("http://localhost:3000/");
  return response.data;
};

if (navigator.geolocation) {
  !navigator.geolocation.getCurrentPosition(showCity);
} else {
  console.log("Geolocation is not supported by this browser.");
}

async function showCity(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const urlGeo = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBhIekNKQB-blGKBY2csHf5dUcm9mgtH50`;

  const urlWeather = `http://api.weatherapi.com/v1/current.json?q=${latitude},${longitude}&key=a72bb3cc1abb41ec910124811231812`

  const [geoResponse, weatherResponse] = await Promise.all([
    fetch(urlGeo),
    fetch(urlWeather),
  ]);

  const geoResult = await geoResponse.json();
  const weatherResult = await weatherResponse.json();
  const city = geoResult.results[0].address_components.find((component) =>
    component.types.includes("locality")
  ).long_name;

  const { current, location } = weatherResult
  const time = location.localtime.split(' ')[1];
  const { condition: { icon } } = current
  const temperature = current.temp_c

  const data = { city, time, icon, temperature }
  window.localStorage.setItem('data', JSON.stringify(data))


}

function App() {
  const { data: images, error, isLoading } = useQuery("imagesData", retrieveImages);
  const dataObj = JSON.parse(window.localStorage.getItem('data'));

  const [data, setData] = useState(dataObj);

  if (isLoading) return <div>Fetching images...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (

    <>    <div style={{ maxWidth: `${screen.width - 3 / 100 * screen.width}px`, width: "100%", aspectRatio: "10 / 5.05", margin: "0 auto" }}><ImageSlider images={images} data={data} /></div>
    </>
  )
}

export default App