// --- Member Directory Logic ---
const gridButton = document.getElementById('grid-view');
const listButton = document.getElementById('list-view');
const membersDisplay = document.getElementById('members-display'); // This is for the full directory page

// Path to your JSON data - now relative to this scripts.js file
// IMPORTANT: Adjust this path if 'data' folder is not inside 'scripts' folder.
// E.g., if 'data' is at the root level, use 'data/members.json'.
const membersJSON = 'scripts/data/members.json';

async function getMemberData() {
    try {
        const response = await fetch(membersJSON);
        if (!response.ok) {
            // Log a more specific error for debugging network issues
            console.error(`Network response was not ok for ${membersJSON}: ${response.status} ${response.statusText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Member data fetched successfully:', data);

        // Only display members on the directory page if the element exists
        if (membersDisplay) {
            displayMembers(data); // Display members in default (grid) view on the directory page
            console.log('Displayed members on directory page.');
        }

        // Always attempt to display spotlight members on the homepage
        displaySpotlightMembers(data);
        console.log('Attempted to display spotlight members.');

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
    if (!membersDisplay) {
        console.warn('displayMembers: membersDisplay element not found.');
        return; // Exit if directory display element not found
    }

    membersDisplay.innerHTML = ''; // Clear existing content

    if (!Array.isArray(members) || members.length === 0) {
        membersDisplay.innerHTML = '<p>No members to display.</p>';
        console.warn('displayMembers: No members array or it is empty.');
        return;
    }

    members.forEach(member => {
        const memberCard = document.createElement('section');
        memberCard.classList.add('member-card'); // Common class for styling

        // Add membership level class for specific styling if needed
        if (member.membershipLevel === 2) {
            memberCard.classList.add('silver-member');
        } else if (member.membershipLevel === 3) {
            memberCard.classList.add('gold-member');
        } else if (member.membershipLevel === 1) { // Assuming 1 is Bronze
             memberCard.classList.add('bronze-member');
        } else if (member.membershipLevel === 4) { // Assuming 4 is Non-Profit
            memberCard.classList.add('non-profit-member');
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
                <p><strong>Address:</strong> ${member.address || 'N/A'}</p>
                <p><strong>Phone:</strong> ${member.phone || 'N/A'}</p>
                <p><strong>URL:</strong> <a href="${member.website}" target="_blank">${(member.website || 'N/A').replace(/(^\w+:|^)\/\//, '')}</a></p>
                <p><strong>Membership:</strong> ${getMembershipLevelText(member.membershipLevel)}</p>
            </div>
        `;
        membersDisplay.appendChild(memberCard);
    });
    // Set default view to grid after displaying
    toggleView('grid');
    console.log('All members displayed and default view set to grid.');
}

// Function to display spotlight members on the homepage
function displaySpotlightMembers(members) {
    const spotlightContainer = document.querySelector('.business-preview-grid');
    if (!spotlightContainer) {
        console.info('displaySpotlightMembers: Spotlight container not found on this page.');
        return; // Exit if the container isn't on this page
    }

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
        console.warn('displaySpotlightMembers: No eligible members for spotlight.');
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
                    <p><strong>Phone:</strong> ${member.phone || 'N/A'}</p>
                    <p><strong>Address:</strong> ${member.address || 'N/A'}</p>
                    <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${(member.website || 'N/A').replace(/(^\w+:|^)\/\//, '')}</a></p>
                    <p><strong>Level:</strong> ${getMembershipLevelText(member.membershipLevel)}</p>
                </div>
            </div>
        `;
        spotlightContainer.appendChild(memberCard);
    });
    console.log(`Displayed ${membersToShow.length} spotlight members.`);
}

// Helper function to get readable membership level text
function getMembershipLevelText(level) {
    switch (level) {
        case 1: return 'Bronze Membership';
        case 2: return 'Silver Membership';
        case 3: return 'Gold Membership';
        case 4: return 'Non-Profit Membership';
        default: return 'Standard Membership'; // Fallback for undefined levels
    }
}


// Toggle View Functionality
function toggleView(viewType) {
    if (!membersDisplay || !gridButton || !listButton) {
        console.warn('toggleView: Missing necessary elements for view toggling.');
        return; // Exit if elements not found
    }

    if (viewType === 'grid') {
        membersDisplay.classList.add('grid-view-active');
        membersDisplay.classList.remove('list-view-active');
        gridButton.classList.add('active');
        listButton.classList.remove('active');
        console.log('Switched to Grid View.');
    } else { // list
        membersDisplay.classList.add('list-view-active');
        membersDisplay.classList.remove('grid-view-active');
        listButton.classList.add('active');
        gridButton.classList.remove('active');
        console.log('Switched to List View.');
    }
}

// Event Listeners for buttons
// Only add listeners if the buttons exist (i.e., on the directory page)
if (gridButton && listButton) {
    gridButton.addEventListener('click', () => toggleView('grid'));
    listButton.addEventListener('click', () => toggleView('list'));
    console.log('Directory view toggle listeners set.');
} else {
    console.info('Directory view toggle buttons not found (not on directory page?).');
}


// --- Weather API Logic ---

// Your OpenWeatherMap API Key
const WEATHER_API_KEY = "cee575af92a7660dcb65f2aefc3295ee"; // <<< REMEMBER TO REPLACE THIS WITH YOUR ACTUAL KEY
const WEATHER_CITY = "Timbuktu";
const WEATHER_COUNTRY_CODE = "ML"; // Mali

// Elements for current weather (make sure these IDs exist in your HTML)
const currentTempElem = document.getElementById('current-temp');
const weatherConditionElem = document.getElementById('weather-condition');
const tempHighElem = document.getElementById('temp-high');
const tempLowElem = document.getElementById('temp-low');
const humidityElem = document.getElementById('humidity');
const sunriseTimeElem = document.getElementById('sunrise-time');
const sunsetTimeElem = document.getElementById('sunset-time');
const weatherIconElem = document.getElementById('weather-icon');

// Elements for 3-day forecast (make sure these IDs exist in your HTML)
const forecastDay1Elem = document.getElementById('forecast-day1');
const forecastDay2Elem = document.getElementById('forecast-day2');
const forecastDay3Elem = document.getElementById('forecast-day3');


async function getWeatherData() {
    // This check ensures a valid key is present
    if (!WEATHER_API_KEY || WEATHER_API_KEY === "" || WEATHER_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
        console.error("OpenWeatherMap API Key is missing or invalid! Please update WEATHER_API_KEY in scripts.js.");
        if (weatherConditionElem) weatherConditionElem.textContent = "API Key Missing!";
        return;
    }

    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CITY},${WEATHER_COUNTRY_CODE}&units=imperial&appid=${WEATHER_API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${WEATHER_CITY},${WEATHER_COUNTRY_CODE}&units=imperial&appid=${WEATHER_API_KEY}`;

    try {
        // Fetch Current Weather (only if elements exist on the page)
        const hasCurrentWeatherElements = currentTempElem || weatherConditionElem || tempHighElem || tempLowElem || humidityElem || sunriseTimeElem || sunsetTimeElem || weatherIconElem;
        if (hasCurrentWeatherElements) {
            console.log('Fetching current weather...');
            const currentWeatherResponse = await fetch(currentUrl);
            if (!currentWeatherResponse.ok) {
                const errorText = await currentWeatherResponse.text();
                throw new Error(`HTTP error! status: ${currentWeatherResponse.status} from current weather API. Response: ${errorText}`);
            }
            const currentWeatherData = await currentWeatherResponse.json();
            displayCurrentWeather(currentWeatherData);
            console.log('Current weather displayed.');
        } else {
            console.info('No current weather elements found on page. Skipping current weather fetch.');
        }


        // Fetch Weather Forecast (only if elements exist on the page)
        const hasForecastElements = forecastDay1Elem || forecastDay2Elem || forecastDay3Elem;
        if (hasForecastElements) {
            console.log('Fetching forecast weather...');
            const forecastWeatherResponse = await fetch(forecastUrl);
            if (!forecastWeatherResponse.ok) {
                const errorText = await forecastWeatherResponse.text();
                throw new Error(`HTTP error! status: ${forecastWeatherResponse.status} from forecast weather API. Response: ${errorText}`);
            }
            const forecastWeatherData = await forecastWeatherResponse.json();
            displayWeatherForecast(forecastWeatherData);
            console.log('Forecast weather displayed.');
        } else {
            console.info('No forecast weather elements found on page. Skipping forecast weather fetch.');
        }

    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Update display with error messages
        if (currentTempElem) currentTempElem.textContent = "--";
        if (weatherConditionElem) weatherConditionElem.textContent = "Weather unavailable.";
        if (tempHighElem) tempHighElem.textContent = "--";
        if (tempLowElem) tempLowElem.textContent = "--";
        if (humidityElem) humidityElem.textContent = "--";
        if (sunriseTimeElem) sunriseTimeElem.textContent = "--";
        if (sunsetTimeElem) sunsetTimeElem.textContent = "--";
        if (weatherIconElem) weatherIconElem.src = ""; // Clear icon
        if (weatherIconElem) weatherIconElem.alt = "Weather unavailable";

        if (forecastDay1Elem) forecastDay1Elem.textContent = "Forecast --";
        if (forecastDay2Elem) forecastDay2Elem.textContent = "Forecast --";
        if (forecastDay3Elem) forecastDay3Elem.textContent = "Forecast --";
    }
}

function displayCurrentWeather(data) {
    if (!data || !data.main || !data.weather || data.weather.length === 0 || !data.sys) {
        console.error('Invalid current weather data received:', data);
        if (weatherConditionElem) weatherConditionElem.textContent = "Invalid data.";
        return;
    }

    if (currentTempElem) currentTempElem.textContent = Math.round(data.main.temp);
    if (weatherConditionElem) weatherConditionElem.textContent = data.weather[0].description.replace(/\b\w/g, char => char.toUpperCase());
    if (tempHighElem) tempHighElem.textContent = Math.round(data.main.temp_max);
    if (tempLowElem) tempLowElem.textContent = Math.round(data.main.temp_min);
    if (humidityElem) humidityElem.textContent = data.main.humidity;

    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);

    // Using en-US for consistent time format, adjust if needed for your region
    if (sunriseTimeElem) sunriseTimeElem.textContent = sunrise.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    if (sunsetTimeElem) sunsetTimeElem.textContent = sunset.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    if (weatherIconElem) {
        const iconCode = data.weather[0].icon;
        weatherIconElem.alt = data.weather[0].description;
        weatherIconElem.src = `https://openweathermap.org/img/w/${iconCode}.png`;
    }
}

function displayWeatherForecast(data) {
    if (!data || !data.list || data.list.length === 0) {
        console.error('Invalid forecast weather data received:', data);
        if (forecastDay1Elem) forecastDay1Elem.textContent = "Invalid data.";
        if (forecastDay2Elem) forecastDay2Elem.textContent = "";
        if (forecastDay3Elem) forecastDay3Elem.textContent = "";
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day

    let forecastDataForDisplay = []; // To store {dayName: "...", temp: "..."}
    let processedDays = new Set();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Find the next three days' forecast
    for (let i = 0; i < data.list.length; i++) {
        const forecastDate = new Date(data.list[i].dt * 1000);
        const dayKey = forecastDate.toISOString().slice(0, 10); // Format YYYY-MM-DD

        // Only consider entries for future days and ensure one entry per day
        if (forecastDate.getTime() > today.getTime() && !processedDays.has(dayKey)) {
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
        console.log('Copyright year updated.');
    }
    if (lastModifiedElem) {
        lastModifiedElem.textContent = lastModified;
        console.log('Last modified date updated.');
    }
}

// --- Join Page Logic (includes Timestamp and Modals) ---
function initializeJoinPage() {
    console.log('Initializing Join Page logic...');
    const timestampField = document.getElementById('submissionTimestamp');
    if (timestampField) {
        timestampField.value = new Date().toISOString();
        console.log('Submission timestamp set:', timestampField.value);
    } else {
        console.warn('Timestamp field "submissionTimestamp" not found.');
    }

    // --- Modal Logic for Join Page ---
    const membershipCards = document.querySelectorAll('.membership-card');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal .close');

    if (membershipCards.length > 0 && modals.length > 0) {
        console.log(`Found ${membershipCards.length} membership cards and ${modals.length} modals.`);
        // Open Modal
        membershipCards.forEach(card => {
            card.addEventListener('click', function(event) {
                console.log('Membership card clicked.');
                // IMPORTANT: Removed the 'return;' statement here so that clicking 'View Details'
                // will also trigger the modal opening via the parent card's listener.
                if (event.target.classList.contains('view-details') || event.target.closest('.view-details')) {
                    event.preventDefault(); // This stops the browser from trying to navigate to '#'
                    console.log('Clicked "View Details" button, allowing modal to open.');
                }

                const level = this.dataset.level;
                if (!level) {
                    console.warn('Membership card missing data-level attribute. Cannot open modal for this card:', this);
                    return;
                }
                const modalId = `${level}Modal`; // Assuming your modals are named like "GoldModal", "SilverModal", etc.
                const targetModal = document.getElementById(modalId);
                if (targetModal) {
                    targetModal.style.display = 'block';
                    document.body.style.overflow = 'hidden'; // Prevent scrolling background
                    console.log(`Modal opened: ${modalId}`);
                } else {
                    console.warn(`Target modal element with ID "${modalId}" not found for card with data-level="${level}".`);
                }
            });
        });

        // Close Modal via close button
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal'); // Find the parent modal
                if (modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = ''; // Restore scrolling
                    console.log('Closed modal via close button.');
                } else {
                    console.warn('Close button clicked but no parent modal found to close.');
                }
            });
        });

        // Close Modal when clicking outside the content
        modals.forEach(modal => {
            modal.addEventListener('click', function(event) {
                if (event.target === this) { // Only close if clicking on the modal overlay itself
                    this.style.display = 'none';
                    document.body.style.overflow = ''; // Restore scrolling
                    console.log('Closed modal by clicking outside.');
                }
            });
        });
        console.log('Modal listeners configured for Join Page.');
    } else {
        console.info('No membership cards or modals found on this page to configure modal listeners.');
    }
}

// --- Thank You Page Logic ---
function initializeThankYouPage() {
    console.log('Initializing Thank You Page logic...');
    const params = new URLSearchParams(window.location.search);

    document.getElementById('displayFirstName').textContent = params.get('firstName') || 'N/A';
    document.getElementById('displayLastName').textContent = params.get('lastName') || 'N/A';
    document.getElementById('displayEmail').textContent = params.get('email') || 'N/A';
    document.getElementById('displayMobileNumber').textContent = params.get('mobileNumber') || 'N/A';
    document.getElementById('displayBusinessName').textContent = params.get('businessName') || 'N/A';

    const timestamp = params.get('submissionTimestamp');
    if (timestamp) {
        try {
            const date = new Date(timestamp);
            document.getElementById('displayTimestamp').textContent = date.toLocaleString();
        } catch (e) {
            document.getElementById('displayTimestamp').textContent = timestamp;
            console.error("Error formatting timestamp:", e);
        }
    } else {
        document.getElementById('displayTimestamp').textContent = 'N/A';
    }
    console.log('Thank You Page information displayed.');
}


// --- Main DOM Content Loaded Event Listener ---
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded: Initializing global scripts...');

    // --- Hamburger Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('change', function() {
            if (this.checked) {
                mainNav.classList.add('active');
                console.log('Hamburger menu: Main nav active.');
            } else {
                mainNav.classList.remove('active');
                console.log('Hamburger menu: Main nav inactive.');
            }
        });
        console.log('Hamburger menu toggle listener set.');
    } else {
        console.info('Hamburger menu elements (menu-toggle or main-nav) not found. Skipping menu setup.');
    }

    // Call member data fetch only if elements related to members are on the page
    // (either the full directory display or the homepage spotlight grid)
    if (membersDisplay || document.querySelector('.business-preview-grid')) {
        console.log('Relevant member display elements found. Calling getMemberData().');
        getMemberData();
    } else {
        console.info('No member directory or spotlight elements found. Skipping member data fetch.');
    }

    // Call weather data fetch only if weather elements are present on the page
    // (any of the main current weather elements or a forecast element)
    const anyWeatherElementExists = currentTempElem || weatherConditionElem || tempHighElem || forecastDay1Elem;
    if (anyWeatherElementExists) {
        console.log('Relevant weather elements found. Calling getWeatherData().');
        getWeatherData();
    } else {
        console.info('No weather display elements found. Skipping weather data fetch.');
    }

    // Always update footer, as it's typically global
    updateFooter();

    // Initialize Join Page specific logic if on the join.html page
    if (document.body.id === 'join-page' || document.querySelector('#join-membership')) {
        console.log('Detected Join Page. Calling initializeJoinPage().');
        initializeJoinPage();
    } else {
        console.info('Not on Join Page. Skipping join page specific initialization.');
    }

    // Initialize Thank You Page specific logic if on the thankyou.html page
    // We can check the URL pathname or a specific body ID for this page.
    if (window.location.pathname.includes('thankyou.html')) {
        console.log('Detected Thank You Page. Calling initializeThankYouPage().');
        initializeThankYouPage();
    } else {
        console.info('Not on Thank You Page. Skipping thank you page specific initialization.');
    }

    console.log('DOMContentLoaded: All scripts initialized.');
});