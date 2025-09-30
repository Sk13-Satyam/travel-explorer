// API Keys - Replace with your own keys
const UNSPLASH_ACCESS_KEY = 'WMqsEvQnJNAZiya7VlWEWrXk-x895XEEiXzW2fNgxgE';
const OPENWEATHER_API_KEY = '165cb77501b7517abd75bf263f176f0c';

// Destinations data is now enriched with more details
const destinations = [
    {
        name: "Paris",
        country: "France",
        description: "The City of Light enchants visitors with its iconic Eiffel Tower, world-class museums, charming cafes, and romantic atmosphere. Experience art, culture, and exquisite cuisine in one of the world's most beautiful cities.",
        tags: ["Culture", "Romance", "Art"],
        lat: 48.8566,
        lon: 2.3522,
        currency: "Euro (€)",
        language: "French",
        best_time: "Apr-Jun, Sep-Oct"
    },
    {
        name: "Tokyo",
        country: "Japan",
        description: "A mesmerizing blend of ancient tradition and cutting-edge modernity. Discover serene temples, bustling markets, innovative technology, and incredible food scenes that make Tokyo truly unique.",
        tags: ["Culture", "Food", "Technology"],
        lat: 35.6762,
        lon: 139.6503,
        currency: "Japanese Yen (¥)",
        language: "Japanese",
        best_time: "Mar-May, Sep-Nov"
    },
    {
        name: "New York",
        country: "USA",
        description: "The city that never sleeps offers endless excitement with iconic landmarks, Broadway shows, diverse neighborhoods, and a vibrant cultural scene that attracts dreamers from around the world.",
        tags: ["Urban", "Culture", "Entertainment"],
        lat: 40.7128,
        lon: -74.0060,
        currency: "US Dollar ($)",
        language: "English",
        best_time: "Apr-Jun, Sep-Nov"
    },
    {
        name: "Bali",
        country: "Indonesia",
        description: "A tropical paradise featuring stunning beaches, lush rice terraces, ancient temples, and a rich spiritual culture. Perfect for relaxation, adventure, and cultural immersion.",
        tags: ["Beach", "Nature", "Spiritual"],
        lat: -8.3405,
        lon: 115.0920,
        currency: "Rupiah (IDR)",
        language: "Indonesian",
        best_time: "Apr-Oct"
    },
    {
        name: "Barcelona",
        country: "Spain",
        description: "Gaudi's architectural masterpieces, Mediterranean beaches, vibrant nightlife, and rich Catalan culture make Barcelona one of Europe's most captivating cities.",
        tags: ["Architecture", "Beach", "Culture"],
        lat: 41.3851,
        lon: 2.1734,
        currency: "Euro (€)",
        language: "Spanish, Catalan",
        best_time: "May-Jun, Sep"
    },
    {
        name: "Dubai",
        country: "UAE",
        description: "A futuristic desert oasis with record-breaking architecture, luxury shopping, pristine beaches, and a unique blend of traditional Arabian culture and modern innovation.",
        tags: ["Luxury", "Shopping", "Modern"],
        lat: 25.2048,
        lon: 55.2708,
        currency: "Dirham (AED)",
        language: "Arabic",
        best_time: "Nov-Mar"
    },
    {
        name: "Santorini",
        country: "Greece",
        description: "Famous for its stunning sunsets, white-washed buildings with blue domes, and dramatic volcanic landscapes overlooking the Aegean Sea. A picture-perfect island paradise.",
        tags: ["Romance", "Beach", "Photography"],
        lat: 36.3932,
        lon: 25.4615,
        currency: "Euro (€)",
        language: "Greek",
        best_time: "Apr-Jun, Sep"
    },
    {
        name: "Iceland",
        country: "Iceland",
        description: "Land of fire and ice offering otherworldly landscapes including geysers, waterfalls, glaciers, and the magical Northern Lights. Perfect for nature lovers and adventure seekers.",
        tags: ["Nature", "Adventure", "Northern Lights"],
        lat: 64.9631,
        lon: -19.0208,
        currency: "Króna (ISK)",
        language: "Icelandic",
        best_time: "Jun-Aug, Oct-Mar (Lights)"
    },
    {
        name: "Machu Picchu",
        country: "Peru",
        description: "Ancient Incan citadel nestled high in the Andes Mountains. This archaeological wonder offers breathtaking views and a glimpse into one of history's greatest civilizations.",
        tags: ["History", "Adventure", "Mountains"],
        lat: -13.1631,
        lon: -72.5450,
        currency: "Sol (PEN)",
        language: "Spanish",
        best_time: "Apr-Oct"
    }
];

let allDestinations = [...destinations];

function init() {
    loadDestinations();
    setupEventListeners();
}
// Add this new function to script.js
function goToHome() {
    // Clear the search input field
    document.getElementById('searchInput').value = '';

    // Reset the destinations to the original list
    allDestinations = [...destinations];

    // Reload the grid with the original destinations
    loadDestinations();
}
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchDestinations();
        }
    });
      document.getElementById('homeButton').addEventListener('click', goToHome);
    window.onclick = (event) => {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            closeModal();
        }
    };
}

async function loadDestinations() {
    const grid = document.getElementById('destinationGrid');
    grid.innerHTML = '';
    if (allDestinations.length === 0) {
        grid.innerHTML = '<p class="section-title" style="color: #666;">No destinations found. Try another search!</p>';
        return;
    }
    for (const dest of allDestinations) {
        const card = createDestinationCard(dest);
        grid.appendChild(card);
        loadDestinationImage(dest, card);
    }
}

function createDestinationCard(dest) {
    const card = document.createElement('div');
    card.className = 'destination-card';
    card.onclick = () => openModal(dest);
    card.innerHTML = `
        <img class="card-image" src="" alt="${dest.name}" data-dest="${dest.name}">
        <div class="card-content">
            <h3 class="card-title">${dest.name}</h3>
            <p class="card-country">${dest.country}</p>
            <p class="card-description">${dest.description.substring(0, 100)}...</p>
            <div class="card-tags">
                ${dest.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;
    return card;
}

async function loadDestinationImage(dest, card) {
    const img = card.querySelector('.card-image');
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${dest.name} ${dest.country}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            img.src = data.results[0].urls.regular;
        }
    } catch (error) {
        console.error('Image loading error:', error);
    }
}

async function searchDestinations() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const grid = document.getElementById('destinationGrid');
    if (searchTerm === '') {
        allDestinations = [...destinations];
        loadDestinations();
        return;
    }
    grid.innerHTML = '<div class="loading">Searching for destinations...</div>';
    try {
        const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${OPENWEATHER_API_KEY}`);
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
             allDestinations = [];
             loadDestinations();
             return;
        }

        // Fetch details for all found locations in parallel
        const destinationPromises = geoData.map(async (item) => {
            try {
                // Fetch Wikipedia and Country data concurrently
                const [wikiRes, countryRes] = await Promise.all([
                    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(item.name)}`),
                    fetch(`https://restcountries.com/v3.1/alpha/${item.country}`)
                ]);

                const wikiData = await wikiRes.json();
                const countryData = await countryRes.json();
                
                // Extract currency info
                const currencyInfo = Object.values(countryData[0].currencies)[0];
                const currency = `${currencyInfo.name} (${currencyInfo.symbol})`;

                // Extract language info
                const language = Object.values(countryData[0].languages)[0];
                
                const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

                return {
                    name: item.name,
                    country: regionNames.of(item.country),
                    description: wikiData.extract || `Explore the wonderful destination of ${item.name}.`,
                    tags: ["Search Result"],
                    lat: item.lat,
                    lon: item.lon,
                    currency: currency,
                    language: language,
                    best_time: "Varies" // This is hard to get dynamically, so we'll use a placeholder
                };
            } catch (e) {
                // If fetching extra details fails, create a fallback object
                console.error(`Could not fetch details for ${item.name}`, e);
                const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
                 return {
                    name: item.name,
                    country: regionNames.of(item.country),
                    description: `Explore the wonderful destination of ${item.name}.`,
                    tags: ["Search Result"],
                    lat: item.lat,
                    lon: item.lon,
                    currency: "N/A",
                    language: "N/A",
                    best_time: "N/A"
                };
            }
        });

        allDestinations = await Promise.all(destinationPromises);
        loadDestinations();

    } catch (error) {
        console.error("Search error:", error);
        grid.innerHTML = '<p class="section-title" style="color: #f5576c;">Could not fetch destinations.</p>';
    }
}

async function openModal(dest) {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Populate basic info
    document.getElementById('modalTitle').textContent = dest.name;
    document.getElementById('modalCountry').textContent = dest.country;
    document.getElementById('modalDescription').textContent = dest.description;

    // Populate NEW details section
    document.getElementById('modalCurrency').textContent = dest.currency;
    document.getElementById('modalLanguage').textContent = dest.language;
    document.getElementById('modalBestTime').textContent = dest.best_time;
    document.getElementById('detailsSection').style.display = 'flex';

    // Load images and weather
    loadModalImage(dest);
    loadWeather(dest);
    loadGallery(dest);
}

async function loadModalImage(dest) {
    const modalImage = document.getElementById('modalImage');
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${dest.name} ${dest.country} landmark&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            modalImage.src = data.results[0].urls.regular;
        }
    } catch (error) {
        console.error('Modal image loading error:', error);
    }
}

async function loadWeather(dest) {
    const weatherSection = document.getElementById('weatherSection');
    weatherSection.style.display = 'none';
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${dest.lat}&lon=${dest.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`);
        const data = await response.json();
        document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById('weatherDescription').textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
        document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
        document.getElementById('windSpeed').textContent = `Wind: ${data.wind.speed} m/s`;
        weatherSection.style.display = 'flex';
    } catch (error) {
        console.error('Weather loading error:', error);
    }
}

async function loadGallery(dest) {
    const gallery = document.getElementById('photoGallery');
    gallery.innerHTML = '<div class="loading">Loading photos...</div>';
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${dest.name} ${dest.country}&per_page=6&client_id=${UNSPLASH_ACCESS_KEY}`);
        const data = await response.json();
        gallery.innerHTML = '';
        if (data.results && data.results.length > 0) {
            data.results.forEach(photo => {
                const img = document.createElement('img');
                img.className = 'gallery-image';
                img.src = photo.urls.small;
                img.alt = dest.name;
                gallery.appendChild(img);
            });
        } else {
            gallery.innerHTML = '<p>No photos available</p>';
        }
    } catch (error) {
        console.error('Gallery loading error:', error);
        gallery.innerHTML = '<p>Unable to load photos</p>';
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

document.addEventListener('DOMContentLoaded', init);