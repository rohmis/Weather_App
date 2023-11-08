import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import { Oval } from "react-loader-spinner";
import {
  Card,
  CardGroup,
  Navbar,
  Row,
  Form,
  FormControl,
  Button,
  Stack,
  Container,
} from "react-bootstrap";

function WeatherApp() {
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
    forecast: [],
  });

  const toDateFunction = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { weekday: "short", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const search = async () => {
    setWeather({ ...weather, loading: true });
    const url = "https://api.openweathermap.org/data/2.5/weather";
    const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
    const api_key = "f00c38e0279b7bc85480c3fe775d518c"; // Replace with your OpenWeatherMap API key

    try {
      const [current, forecast] = await Promise.all([
        axios.get(url, {
          params: {
            q: input,
            units: "metric",
            appid: api_key,
          },
        }),
        axios.get(forecastUrl, {
          params: {
            q: input,
            units: "metric",
            appid: api_key,
          },
        }),
      ]);
      setWeather({
        data: current.data,
        loading: false,
        error: false,
        forecast: forecast.data.list.filter((reading) =>
          reading.dt_txt.includes("12:00:00")
        ),
      });
      setInput("");
    } catch (error) {
      setWeather({ ...weather, data: {}, error: true });
      setInput("");
      console.log("error", error);
    }
  };


  return (
    <div className="App">
      <h1 className="heading">World Weather App</h1>
      <Card  className="search-bar" >
        {" "}
        <Row>
          {" "}
          <Form inline style={{width:'80%',margin:'auto',marginTop:'25px'}}>
            <Stack direction="horizontal" gap={1}>
              <FormControl
                type="text"
                placeholder="Enter City Name.."
                name="query"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <Button variant="link" onClick={search} style={{marginLeft:'-60px'}}><i class="fa-solid fa-crosshairs"></i></Button>
            </Stack>
          </Form>
        </Row>
      </Card>


	  <div className="loader" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',marginTop:'10px' }}>
           
	  {weather.loading && (
        <div className="text-center mt-3">
          <Oval type="Oval"  color="black" height={100} width={100} />
        </div>
      )}
	
	{weather.error && (
        <div className="text-center mt-3">
          <FontAwesomeIcon icon={faFrown} style={{ fontSize: "20px" }} />
          <span className="ml-2">City not found</span>
        </div>
      )}
        </div>
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {weather.data && weather.data.main && (
                    <Card className="weather">
                        <Card.Body >
                            <Card.Title>
                                {weather.data.name}, <span>{weather.data.sys.country}</span>
                            </Card.Title>
                            <Card.Text>{toDateFunction(weather.data.dt)}</Card.Text>
                            <Card.Img style={{ width: '60%' }} src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}.png`} alt={weather.data.weather[0].description} />
                            <Card.Text>
                                {Math.round(weather.data.main.temp)}
                                <sup>°C</sup>
                            </Card.Text>
                            <Card.Text>{weather.data.weather[0].description.toUpperCase()}</Card.Text>
                            <Card.Text>Wind Speed: {weather.data.wind.speed}m/s</Card.Text>
                        </Card.Body>
                    </Card>
                )}
            </div>
    
 
      {weather.forecast.length > 0 && (
        <div className="text-center mt-4">
          <h2 className="heading">5-Day Forecast</h2>
          <CardGroup>
            {weather.forecast.map((forecastData, index) => (
              <Card
                key={index}
               
				className="weather1"
				style={{borderRadius:'20px'}}
              >
                <Card.Body>
                  <Card.Title>{toDateFunction(forecastData.dt)}</Card.Title>
                  <Card.Img
                    variant="top"
                    src={`https://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png`}
                    alt={forecastData.weather[0].description}
                  />
                  <Card.Text>{Math.round(forecastData.main.temp)}°C</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </CardGroup>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
