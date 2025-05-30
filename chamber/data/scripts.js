// Function to handle the hamburger menu toggle (if you plan to use JS for this)
// For now, we're relying on pure CSS for the toggle, as implemented.
// If you add other JS interactive elements, you'd add them here.

// --- Member Directory Logic ---
const gridButton = document.getElementById('grid-view');
const listButton = document.getElementById('list-view');
const membersDisplay = document.getElementById('members-display'); // This is for the full directory page

// Adjusted path: assumes 'data' folder is sibling to 'index.html'
const membersJSON = 'data/members.json'; // Path to your JSON data - Changed from data/members.json to members.json as per current setup implies it's in the root. If it's in 'data' folder, change this back.

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
        // Always display spotlight members on the homepage
        displaySpotlightMembers(data);
    } catch (error) {
        console.error('Error fetching member data:', error);
        if (membersDisplay) { // Check if membersDisplay exists before trying to set innerHTML
            membersDisplay.innerHTML = '<p>Error loading member data. Please try again later.</p>';
        }
        // No specific error message for spotlight, as it's optional content.
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
        }

        // Adjusted path: assumes 'images' folder is sibling to 'index.html'
        const imgPath = `images/members/${member.image}`; // Construct image path

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

    // Filter for Gold and Silver members first
    const eligibleMembers = members.filter(member => member.membershipLevel === 2 || member.membershipLevel === 3);

    // If there aren't enough Gold/Silver, fill with other members
    const allMembersExceptEligible = members.filter(member => member.membershipLevel !== 2 && member.membershipLevel !== 3);
    const membersToChooseFrom = eligibleMembers.concat(allMembersExceptEligible);

    // Shuffle array to get random members
    for (let i = membersToChooseFrom.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [membersToChooseFrom[i], membersToChooseFrom[j]] = [membersToChooseFrom[j], membersToChooseFrom[i]];
    }

    // Select up to 3 members (or fewer if not enough are available)
    const membersToShow = membersToChooseFrom.slice(0, 3);

    membersToShow.forEach(member => {
        const memberCard = document.createElement('div'); // Using div as per your existing HTML structure
        memberCard.classList.add('business-card-preview');

        const imgPath = `images/members/${member.image}`; // Construct image path

        memberCard.innerHTML = `
            <div class="card-header">
                <h3>${member.name}</h3>
                <p class="tag-line">${member.slogan || ''}</p>
            </div>
            <div class="divider"></div>
            <div class="card-content">
                <img src="${imgPath}" alt="${member.name} logo" class="business-image-placeholder">
                <div class="contact-info">
                    <p>EMAIL: info@${member.name.toLowerCase().replace(/\s/g, '')}.com</p> <p>PHONE: ${member.phone}</p>
                    <p>URL: <a href="${member.website}" target="_blank">${member.website.replace(/(^\w+:|^)\/\//, '')}</a></p>
                </div>
            </div>
        `;
        spotlightContainer.appendChild(memberCard);
    });
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
    // This check ensures a valid key is present, remove "YOUR_OPENWEATHERMAP_API_KEY" if you already put your key
    if (!WEATHER_API_KEY || WEATHER_API_KEY === "") {
        console.error("OpenWeatherMap API Key is missing or not replaced. Please get one from openweathermap.org");
        if (weatherConditionElem) weatherConditionElem.textContent = "API Key Missing!";
        return;
    }

    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CITY},${WEATHER_COUNTRY_CODE}&units=imperial&appid=${WEATHER_API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${WEATHER_CITY},${WEATHER_COUNTRY_CODE}&units=imperial&appid=${WEATHER_API_KEY}`;

    try {
        // Fetch Current Weather
        const currentWeatherResponse = await fetch(currentUrl);
        if (!currentWeatherResponse.ok) {
            throw new Error(`HTTP error! status: ${currentWeatherResponse.status} from current weather API`);
        }
        const currentWeatherData = await currentWeatherResponse.json();
        displayCurrentWeather(currentWeatherData);

        // Fetch Weather Forecast
        const forecastWeatherResponse = await fetch(forecastUrl);
        if (!forecastWeatherResponse.ok) {
            throw new Error(`HTTP error! status: ${forecastWeatherResponse.status} from forecast weather API`);
        }
        const forecastWeatherData = await forecastWeatherResponse.json();
        displayWeatherForecast(forecastWeatherData);

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
    if (weatherConditionElem) weatherConditionElem.textContent = data.weather[0].description.replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
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
        // Optionally, update the weather icon src based on the API response
        weatherIconElem.src = `https://openweathermap.org/img/w/${iconCode}.png`;
    }
}

function displayWeatherForecast(data) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let forecastTemps = [];
    let forecastDates = [];
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
                forecastTemps.push(Math.round(Math.max(...dailyTemps)));
                forecastDates.push(forecastDate); // Store the date to get the day name
                processedDays.add(dayKey);
            }
        }
        if (processedDays.size >= 3) break; // We only need 3 days
    }

    // Assign forecast temps and update day names dynamically
    const forecastElements = [forecastDay1Elem, forecastDay2Elem, forecastDay3Elem];

    forecastElements.forEach((element, index) => {
        if (element && forecastTemps[index] !== undefined) {
            const dayName = daysOfWeek[forecastDates[index].getDay()];
            element.closest('p').innerHTML = `${dayName}: <strong>${forecastTemps[index]}</strong>°F`;
        } else if (element) {
            // Fallback for missing forecast data
            element.closest('p').innerHTML = `Day ${index + 1}: <strong>--</strong>°F`;
        }
    });
}


// --- Footer Date Logic ---
function updateFooter() {
    const currentYear = new Date().getFullYear();
    const lastModified = document.lastModified;

    const copyrightElem = document.querySelector('footer .footer-meta p:nth-of-type(3)');
    const lastModifiedElem = document.querySelector('footer .footer-meta p:nth-of-type(4)');

    if (copyrightElem) {
        copyrightElem.textContent = `© ${currentYear} Timbuktu Chamber of Commerce`;
    }
    if (lastModifiedElem) {
        lastModifiedElem.textContent = `Last Modification: ${lastModified}`;
    }
}


// Initial data fetch when the page loads
document.addEventListener('DOMContentLoaded', () => {
    getMemberData(); // This will fetch members and populate both directory (if on page) and spotlight
    getWeatherData(); // This will populate the weather section on the home page
    updateFooter(); // Call the footer update function
});