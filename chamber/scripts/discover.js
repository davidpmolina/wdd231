// scripts/discover.js

document.addEventListener('DOMContentLoaded', () => {
    // Function to load places of interest (no changes needed here from previous version)
    const loadPlaces = async () => {
        const placesGrid = document.getElementById('places-of-interest');
        try {
            const response = await fetch('data/places.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const places = await response.json();
            places.forEach(place => {
                const card = document.createElement('div');
                card.classList.add('place-card');

                const h2 = document.createElement('h2');
                h2.textContent = place.name;

                const figure = document.createElement('figure');
                const img = document.createElement('img');
                img.src = place.image;
                img.alt = place.alt;
                img.loading = 'lazy'; // Add lazy loading
                figure.appendChild(img);

                const address = document.createElement('address');
                address.textContent = place.address;

                const description = document.createElement('p');
                description.textContent = place.description;

                const button = document.createElement('button');
                button.classList.add('btn', 'primary-btn');
                button.textContent = 'Learn More';
                button.addEventListener('click', () => {
                    alert(`More info coming soon for ${place.name}!`);
                });

                card.appendChild(h2);
                card.appendChild(figure);
                card.appendChild(address);
                card.appendChild(description);
                card.appendChild(button);

                placesGrid.appendChild(card);
            });
        } catch (error) {
            console.error('Error loading places:', error);
            placesGrid.innerHTML = '<p>Failed to load places of interest. Please try again later.</p>';
        }
    };

    // Function to handle last visit message as an overlay
    const displayLastVisitMessage = () => {
        const welcomeOverlay = document.getElementById('welcome-overlay');
        const welcomeMessageContent = document.getElementById('welcome-message'); // This is the inner div now
        const lastVisit = localStorage.getItem('lastVisit');
        const currentTime = Date.now(); // Current time in milliseconds

        let messageText = "";

        if (!lastVisit) {
            // First visit
            messageText = "Welcome! Let us know if you have any questions.";
        } else {
            const lastVisitTime = parseFloat(lastVisit); // Convert stored string back to number
            const msToDays = 86400000; // milliseconds in a day
            const daysBetween = Math.round((currentTime - lastVisitTime) / msToDays);

            if (daysBetween < 1) {
                messageText = "Back so soon! Awesome!";
            } else if (daysBetween === 1) {
                messageText = "You last visited 1 day ago.";
            } else {
                messageText = `You last visited ${daysBetween} days ago.`;
            }
        }

        // Set the message text
        welcomeMessageContent.innerHTML = `<p>${messageText}</p>`; // Wrap in paragraph

        // Display the overlay (it's visible by default in CSS)

        // Fade out and remove the overlay after a delay
        const displayDuration = 3000; // 3 seconds before starting to fade
        const fadeDuration = 1000; // 1 second for the fade transition (matches CSS)

        setTimeout(() => {
            welcomeOverlay.classList.add('fade-out'); // Start fade-out animation
            // After fade-out completes, remove the overlay from the DOM
            setTimeout(() => {
                welcomeOverlay.remove();
            }, fadeDuration); // Wait for the fade-out transition to finish
        }, displayDuration);

        // Store the current visit time for the next visit
        localStorage.setItem('lastVisit', currentTime.toString());
    };

    // Call functions on page load
    loadPlaces();
    displayLastVisitMessage();
});

// Also ensure the general scripts.js is loaded and functional for header/footer common elements
// (Assuming scripts.js handles copyright year and last modified date)