const router = require('express').Router();
const axios = require('axios');

router.get('/:city', async (req, res) => {
  try {
    const city = req.params.city;
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`
    );

    // ✅ Validation
    if (
      response.status === 200 &&
      response.data &&
      response.data.main &&
      response.data.weather &&
      response.data.wind
    ) {
      const data = response.data;
      console.log(data);
      
      const formattedData = {
        city: data.name,
        temperature: (data.main.temp - 273.15).toFixed(1),
        humidity: data.main.humidity,
        condition: data.weather[0].description,
        windSpeed: data.wind.speed
      };

      return res.status(200).json({
        success: true,
        weather: formattedData
      });
    }

    res.status(500).json({ success: false, message: "Invalid weather data received" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Weather service failed" });
  }
});

module.exports = router;
