import { ImageSlider } from "./imageSlider";
import { useQuery } from "react-query";
import axios from "axios";
import './App.css'


const retrieveImages = async () => {
  const response = await axios.get("http://localhost:3000/");
  return response.data;
};

const retrieveWeather = async () => {
  const city = window.localStorage.getItem('city');
  const response = await axios.get(`http://api.weatherapi.com/v1/current.json?q=${city}&key=a72bb3cc1abb41ec910124811231812`);
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

  const geoResponse = await fetch(urlGeo);

  const geoResult = await geoResponse.json();
  const city = geoResult.results[0].address_components.find((component) =>
    component.types.includes("locality")
  ).long_name;

  window.localStorage.setItem('city', city)
}

function App() {
  const { data: images, error: errorImages, isLoading: isLoadingImages } = useQuery("imagesData", retrieveImages);
  const { data: weather, error: errorWeather, error: isLoadingWeather } = useQuery("weatherData", retrieveWeather);


  if (isLoadingImages || isLoadingWeather) return <div>Fetching data...</div>;
  if (errorImages || errorWeather) return <div>An error occurred.</div>;

    const city = window.localStorage.getItem('city');

    const { current, location } = weather
    const { condition: { icon } } = current
    const temperature = current.temp_c
  
    const data = { city, icon, temperature }

  return (
    <>    <div style={{ maxWidth: `${screen.width - 3 / 100 * screen.width}px`, width: "100%", aspectRatio: "10 / 5.05", margin: "0 auto" }}><ImageSlider images={images} data={data} /></div>
    </>
  )
}

export default App