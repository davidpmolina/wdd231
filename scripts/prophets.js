// Declare a const variable named "url" that contains the URL string of the JSON resource.
const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

// Declare a const variable name "cards" that selects the HTML div element from the document with an id value of "cards".
const cards = document.querySelector('#cards');

// Define a function expression named "displayProphets" that handles a single parameter named "prophets".
// Use an arrow expression to contain statements that will process the parameter value and build a card for each prophet.
const displayProphets = (prophets) => {
    // Inside the function, use a forEach loop with the array parameter to process each "prophet" record one at a time.
    prophets.forEach((prophet) => {
        // Create elements to add to the div.cards element
        let card = document.createElement('section');
        let fullName = document.createElement('h2'); // h2 element for the full name
        let portrait = document.createElement('img');
        let birthDate = document.createElement('p'); // Paragraph for birth date
        let deathDate = document.createElement('p'); // Paragraph for death date (if applicable)
        let birthplace = document.createElement('p'); // Paragraph for birthplace

        // Build the h2 content out to show the prophet's full name
        // The JSON data has 'name' and 'lastname' properties
        fullName.textContent = `${prophet.name} ${prophet.lastname}`;

        // Build the image portrait by setting all the relevant attributes
        portrait.setAttribute('src', prophet.imageurl);
        // The alt text should be descriptive for accessibility
        portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
        portrait.setAttribute('loading', 'lazy'); // Helps with performance by loading images only when needed
        portrait.setAttribute('width', '340'); // Set a width for consistency and layout
        portrait.setAttribute('height', '440'); // Set a height for consistency and layout

        // Add additional information as shown in the screenshot examples
        birthDate.textContent = `Date of Birth: ${prophet.birthdate}`;
        birthplace.textContent = `Place of Birth: ${prophet.birthplace}`;

        // Append the section(card) with the created elements
        card.appendChild(fullName); // Append the heading
        card.appendChild(birthDate); // Append the birth date
        card.appendChild(birthplace); // Append the birthplace
        // Add death date only if it exists in the data (not all prophets have a death date if they are alive)
        if (prophet.death) {
            deathDate.textContent = `Date of Death: ${prophet.death}`;
            card.appendChild(deathDate);
        }
        card.appendChild(portrait); // Append the portrait

        // Finally, add the section card to the "cards" div
        cards.appendChild(card);
    }); // end of arrow function and forEach loop
};

// Create an async defined function named "getProphetData" to fetch data.
async function getProphetData() {
    // Fetch data from the JSON source url using the await fetch() method.
    const response = await fetch(url);
    // Convert the response to a JSON object using the .json() method and store the results in "data".
    const data = await response.json();
    //console.table(data.prophets); // Temporary testing of data response - uncomment to see in console
    // Call the displayProphets function with the prophets array from the data object.
    // We send data.prophets because the displayProphets() function expects an array parameter,
    // and 'prophets' is the key in the JSON object that holds the array of prophet objects.
    displayProphets(data.prophets);
}

// Call the function getProphetData() in the main line of your .js code to test the fetch and response.
getProphetData();