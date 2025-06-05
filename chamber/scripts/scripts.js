// --- Member Directory Logic ---
const gridButton = document.getElementById('grid-view');
const listButton = document.getElementById('list-view');
const membersDisplay = document.getElementById('members-display'); // This is for the full directory page

// Path to your JSON data - now relative to this scripts.js file
const membersJSON = 'scripts/data/members.json'; // members.json is inside the 'data' folder, which is inside 'scripts'

async function getMemberData() {
    try {
        const response = await fetch(membersJSON);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Only display members on the directory page if the element exists
        if (membersDisplay) {
            displayMembers(data); // Display members in default (grid) view on the directory page
        }

        // Always attempt to display spotlight members on the homepage
        displaySpotlightMembers(data);

    } catch (error) {
        console.error('Error fetching member data:', error);
        if (membersDisplay) {
            membersDisplay.innerHTML = '<p>Error loading member data. Please try again later.</p>';
        }
        const spotlightContainer = document.querySelector('.business-preview-grid');
        if (spotlightContainer) {
            spotlightContainer.innerHTML = '<p>Error loading spotlight members.</p>';
        }
    }
}

function displayMembers(members) {
    if (!membersDisplay) return; // Exit if directory display element not found

    membersDisplay.innerHTML = ''; // Clear existing content

    members.forEach(member => {
        const memberCard = document.createElement('section');
        memberCard.classList.add('member-card'); // Common class for styling

        // Add membership level class for specific styling if needed
        if (member.membershipLevel === 2) {
            memberCard.classList.add('silver-member');
        } else if (member.membershipLevel === 3) {
            memberCard.classList.add('gold-member');
        } else {
            memberCard.classList.add('basic-member'); // Or another default
        }

        const imgPath = `images/members/${member.image}`; // Construct image path, relative to HTML file

        memberCard.innerHTML = `
            <img src="${imgPath}" alt="${member.name} logo" loading="lazy">
            <div class="member-header-info">
                <h3>${member.name}</h3>
                <p class="member-slogan">${member.slogan || ''}</p>
            </div>
            <div class="member-contact-details">
                <p><strong>Address:</strong> ${member.address}</p>
                <p><strong>Phone:</strong> ${member.phone}</p>
                <p><strong>URL:</strong> <a href="${member.website}" target="_blank">${member.website.replace(/(^\w+:|^)\/\//, '')}</a></p>
                <p><strong>Membership:</strong> ${getMembershipLevelText(member.membershipLevel)}</p>
            </div>
        `;
        membersDisplay.appendChild(memberCard);
    });
    // Set default view to grid after displaying
    toggleView('grid');
}

// Function to display spotlight members on the homepage
function displaySpotlightMembers(members) {
    const spotlightContainer = document.querySelector('.business-preview-grid');
    if (!spotlightContainer) return; // Exit if the container isn't on this page

    spotlightContainer.innerHTML = ''; // Clear existing placeholder content

    // Filter for Gold and Silver members only
    const eligibleMembers = members.filter(member => member.membershipLevel === 2 || member.membershipLevel === 3);

    // Shuffle the eligible members to get random ones
    for (let i = eligibleMembers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [eligibleMembers[i], eligibleMembers[j]] = [eligibleMembers[j], eligibleMembers[i]];
    }

    // Select up to 3 members from the shuffled eligible list
    const membersToShow = eligibleMembers.slice(0, 3);

    if (membersToShow.length === 0) {
        spotlightContainer.innerHTML = '<p>No Gold or Silver members currently in the spotlight.</p>';
        return;
    }

    membersToShow.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.classList.add('business-card-preview');

        const imgPath = `images/members/${member.image}`; // Construct image path, relative to HTML file

        memberCard.innerHTML = `
            <div class="card-header">
                <h3>${member.name}</h3>
                <p class="tag-line">${member.slogan || ''}</p>
            </div>
            <div class="divider"></div>
            <div class="card-content">
                <img src="${imgPath}" alt="${member.name} logo" class="business-image-placeholder">
                <div class="contact-info">
                    <p><strong>Email:</strong> ${member.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${member.phone}</p>
                    <p><strong>Address:</strong> ${member.address}</p>
                    <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website.replace(/(^\w+:|^)\/\//, '')}</a></p>
                    <p><strong>Level:</strong> ${getMembershipLevelText(member.membershipLevel)}</p>
                </div>
            </div>
        `;
        spotlightContainer.appendChild(memberCard);
    });
}

// Helper function to get readable membership level text
function getMembershipLevelText(level) {
    switch (level) {
        case 1: return 'Bronze Membership';
        case 2: return 'Silver Membership';
        case 3: return 'Gold Membership';
        case 4: return 'Non-Profit Membership';
        default: return 'Standard Membership';
    }
}


// Toggle View Functionality
function toggleView(viewType) {
    if (!membersDisplay || !gridButton || !listButton) return; // Exit if elements not found

    if (viewType === 'grid') {
        membersDisplay.classList.add('grid-view-active');
        membersDisplay.classList.remove('list-view-active');
        gridButton.classList.add('active');
        listButton.classList.remove('active');
    } else { // list
        membersDisplay.classList.add('list-view-active');
        membersDisplay.classList.remove('grid-view-active');
        listButton.classList.add('active');
        gridButton.classList.remove('active');
    }
}

// Event Listeners for buttons
// Only add listeners if the buttons exist (i.e., on the directory page)
if (gridButton && listButton) {
    gridButton.addEventListener('click', () => toggleView('grid'));
    listButton.addEventListener('click', () => toggleView('list'));
}


// --- Weather API Logic ---

// Your OpenWeatherMap API Key
const WEATHER_API_KEY = "cee575af92a7660dcb65f2aefc3295ee"; 
const WEATHER_CITY = "Timbuktu";
const WEATHER_COUNTRY_CODE = "ML"; // Mali

const currentTempElem = document.getElementById('current-temp');
const weatherConditionElem = document.getElementById('weather-condition');
const tempHighElem = document.getElementById('temp-high');
const tempLowElem = document.getElementById('temp-low');
const humidityElem = document.getElementById('humidity');
const sunriseTimeElem = document.getElementById('sunrise-time');
const sunsetTimeElem = document.getElementById('sunset-time');
const weatherIconElem = document.getElementById('weather-icon');

const forecastDay1Elem = document.getElementById('forecast-day1');
const forecastDay2Elem = document.getElementById('forecast-day2');
const forecastDay3Elem = document.getElementById('forecast-day3');


async function getWeatherData() {
    // This check ensures a valid key is present
    if (!WEATHER_API_KEY || WEATHER_API_KEY === "") {
        console.error("OpenWeatherMap API Key is missing!");
        if (weatherConditionElem) weatherConditionElem.textContent = "API Key Missing!";
        return;
    }

    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CITY},${WEATHER_COUNTRY_CODE}&units=imperial&appid=${WEATHER_API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${WEATHER_CITY},${WEATHER_COUNTRY_CODE}&units=imperial&appid=${WEATHER_API_KEY}`;

    try {
        // Fetch Current Weather (only if elements exist on the page)
        if (currentTempElem || weatherConditionElem) {
            const currentWeatherResponse = await fetch(currentUrl);
            if (!currentWeatherResponse.ok) {
                throw new Error(`HTTP error! status: ${currentWeatherResponse.status} from current weather API`);
            }
            const currentWeatherData = await currentWeatherResponse.json();
            displayCurrentWeather(currentWeatherData);
        }

        // Fetch Weather Forecast (only if elements exist on the page)
        if (forecastDay1Elem || forecastDay2Elem || forecastDay3Elem) {
            const forecastWeatherResponse = await fetch(forecastUrl);
            if (!forecastWeatherResponse.ok) {
                throw new Error(`HTTP error! status: ${forecastWeatherResponse.status} from forecast weather API`);
            }
            const forecastWeatherData = await forecastWeatherResponse.json();
            displayWeatherForecast(forecastWeatherData);
        }

    } catch (error) {
        console.error('Error fetching weather data:', error);
        if (weatherConditionElem) weatherConditionElem.textContent = "Weather unavailable.";
        if (forecastDay1Elem) forecastDay1Elem.textContent = "--";
        if (forecastDay2Elem) forecastDay2Elem.textContent = "--";
        if (forecastDay3Elem) forecastDay3Elem.textContent = "--";
    }
}

function displayCurrentWeather(data) {
    if (currentTempElem) currentTempElem.textContent = Math.round(data.main.temp);
    if (weatherConditionElem) weatherConditionElem.textContent = data.weather[0].description.replace(/\b\w/g, char => char.toUpperCase());
    if (tempHighElem) tempHighElem.textContent = Math.round(data.main.temp_max);
    if (tempLowElem) tempLowElem.textContent = Math.round(data.main.temp_min);
    if (humidityElem) humidityElem.textContent = data.main.humidity;

    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);

    if (sunriseTimeElem) sunriseTimeElem.textContent = sunrise.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    if (sunsetTimeElem) sunsetTimeElem.textContent = sunset.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    if (weatherIconElem) {
        const iconCode = data.weather[0].icon;
        weatherIconElem.alt = data.weather[0].description;
        weatherIconElem.src = `https://openweathermap.org/img/w/${iconCode}.png`;
    }
}

function displayWeatherForecast(data) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let forecastDataForDisplay = []; // To store {dayName: "...", temp: "..."}
    let processedDays = new Set();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Find the next three days' forecast
    for (let i = 0; i < data.list.length; i++) {
        const forecastDate = new Date(data.list[i].dt * 1000);
        const dayKey = forecastDate.toISOString().slice(0, 10); // Format YYYY-MM-DD

        // Only consider entries for future days and ensure one entry per day
        if (forecastDate.getDate() !== today.getDate() && !processedDays.has(dayKey)) {
            // Filter all entries for this specific day to find the max temperature
            let dailyTemps = data.list.filter(item => {
                const itemDate = new Date(item.dt * 1000);
                return itemDate.toISOString().slice(0, 10) === dayKey;
            }).map(item => item.main.temp);

            if (dailyTemps.length > 0) {
                const dayName = daysOfWeek[forecastDate.getDay()];
                forecastDataForDisplay.push({
                    dayName: dayName,
                    temp: Math.round(Math.max(...dailyTemps))
                });
                processedDays.add(dayKey);
            }
        }
        if (processedDays.size >= 3) break; // We only need 3 days
    }

    // Assign forecast temps and update day names dynamically
    const forecastElements = [forecastDay1Elem, forecastDay2Elem, forecastDay3Elem];

    forecastElements.forEach((element, index) => {
        if (element && forecastDataForDisplay[index]) {
            element.textContent = `${forecastDataForDisplay[index].dayName}: ${forecastDataForDisplay[index].temp}°F`; // Added °F
        } else if (element) {
            element.textContent = `--°F`; // Fallback with °F
        }
    });
}


// --- Footer Date Logic ---
function updateFooter() {
    const currentYear = new Date().getFullYear();
    const lastModified = document.lastModified;

    const copyrightElem = document.getElementById('copyright-year');
    const lastModifiedElem = document.getElementById('lastModified');

    if (copyrightElem) {
        copyrightElem.textContent = currentYear;
    }
    if (lastModifiedElem) {
        lastModifiedElem.textContent = lastModified;
    }
}


// Initial data fetch when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Only fetch member data if either display element is present on the page
    if (membersDisplay || document.querySelector('.business-preview-grid')) {
        getMemberData(); // This will fetch members and populate both directory (if on page) and spotlight
    }

    // Only fetch weather data if weather elements are present on the page
    if (currentTempElem || forecastDay1Elem) {
        getWeatherData(); // This will populate the weather section on the home page
    }

    updateFooter(); // Call the footer update function
});