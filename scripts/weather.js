// select HTML elements in the document
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

// API key and coordinates for Trier, Germany
const apiKey = 'cee575af92a7660dcb65f2aefc3295ee';
const latitude = 49.75;
const longitude = 6.64;

// Construct the URL for the OpenWeatherMap API
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;

// Asynchronous function to fetch weather data
async function apiFetch() {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(data); // For testing: output the full data object to the console
      displayResults(data); // Call the function to display the results
    } else {
      throw Error(await response.text());
    }
  } catch (error) {
    console.log(error);
  }
}

// Function to display the weather results on the HTML page
function displayResults(data) {
  currentTemp.innerHTML = `${data.main.temp.toFixed(0)}&deg;F`; // Temperature rounded to whole number
  const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`; // Icon URL
  let desc = data.weather[0].description; // Weather description
  weatherIcon.setAttribute('src', iconsrc);
  weatherIcon.setAttribute('alt', desc); // Set alt text for accessibility
  captionDesc.textContent = `${desc}`;
}

// Invoke the apiFetch function to start the process
apiFetch();