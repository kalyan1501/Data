let table;
let countries = {};
let populationSlider;
let searchInput, searchButton, suggestionBox;
let selectedCountry = null;
let countryList = [];
let hoveredCityInfo = null; // To store information of the hovered city

function preload() {
    table = loadTable('assets/full_worldcities.csv', 'csv', 'header');
}

function setup() {
    createCanvas(1000, 600).parent('mapContainer');
    textAlign(CENTER, CENTER);

    for (let i = 0; i < table.getRowCount(); i++) {
        let cityName = table.getString(i, "city");
        let country = table.getString(i, "country");
        let population = parseInt(table.getString(i, "population"));
        let latitude = parseFloat(table.getString(i, "lat"));
        let longitude = parseFloat(table.getString(i, "lng"));

        if (!countries[country]) {
            countries[country] = { cities: [], avgLat: 0, avgLon: 0 };
            countryList.push(country);
        }

        countries[country].cities.push(new City(cityName, population, latitude, longitude));
    }

    for (let country in countries) {
        let latSum = 0;
        let lonSum = 0;
        let count = countries[country].cities.length;
        
        countries[country].cities.forEach(city => {
            latSum += city.lat;
            lonSum += city.lon;
        });
        
        countries[country].avgLat = latSum / count;
        countries[country].avgLon = lonSum / count;
    }

    populationSlider = createSlider(0, 40000000, 0);
    populationSlider.position(250, height - 490);
    populationSlider.style('width', '200px');

    searchInput = createInput();
    searchInput.position(890, height - 490);
    searchInput.size(200);
    searchInput.input(updateSuggestions);

    searchButton = createButton("Search Country");
    searchButton.position(searchInput.x + searchInput.width + 10, height - 490);
    searchButton.mousePressed(searchCountry);

    suggestionBox = createDiv('');
    suggestionBox.position(searchInput.x, searchInput.y + 20);
    suggestionBox.size(150, 'auto');
    suggestionBox.style('background', '#ffffff');
    suggestionBox.style('border', '1px solid #ccc');
    suggestionBox.hide();
}

function draw() {
    background(173, 216, 230); // Light blue background
    fill(0);
    textSize(28);

    textAlign(LEFT);

    textSize(12);
    text(`Population Filter: ${populationSlider.value()}`, 50, height - 560);

    if (selectedCountry) {
        let countryData = countries[selectedCountry];
        
        if (countryData) {
            for (let city of countryData.cities) {
                if (city.population >= populationSlider.value()) {
                    city.display();
                }
            }
            let avgX = map(countryData.avgLon, -180, 180, 0, width);
            let avgY = map(countryData.avgLat, 90, -90, 0, height);
            fill(0);
            textSize(14);
            textAlign(CENTER);
            text(selectedCountry, avgX, avgY);
        } else {
            fill(255, 0, 0);
            textSize(14);
            text("Country not found", width / 2, height / 2);
        }
    } else {
        for (let country in countries) {
            for (let city of countries[country].cities) {
                if (city.population >= populationSlider.value()) {
                    city.display();
                }
            }
        }
    }

    // Display hovered city info at the top center if available
    if (hoveredCityInfo) {
        fill(0, 102, 204); // Blue background
        stroke(0);
        strokeWeight(1);
        rectMode(CENTER);
        rect(width / 2, 50, 250, 60, 10); // Increased size of rectangle
        
        noStroke();
        fill(255); // White text
        textSize(16);
        textStyle(BOLD); // Bold text
        textAlign(CENTER);
        text(`${hoveredCityInfo.name}\nPopulation: ${hoveredCityInfo.population}`, width / 2, 45);
    }
}

function searchCountry() {
    selectedCountry = searchInput.value().trim();
    suggestionBox.hide();

    if (selectedCountry && countries[selectedCountry]) {
        let countryData = countries[selectedCountry];
        let cityNames = countryData.cities.map(city => city.name);
        let populations = countryData.cities.map(city => city.population);

        updateChart(selectedCountry, cityNames, populations);
        document.getElementById('chartContainer').style.display = 'block';
    } else {
        alert("Country not found");
    }
}

function updateSuggestions() {
    let query = searchInput.value().toLowerCase();
    suggestionBox.html('');
    if (query === '') {
        suggestionBox.hide();
        return;
    }

    let matches = countryList.filter(country => country.toLowerCase().startsWith(query));
    if (matches.length > 0) {
        suggestionBox.show();
        matches.forEach(country => {
            let suggestionItem = createDiv(country);
            suggestionItem.parent(suggestionBox);
            suggestionItem.style('padding', '5px');
            suggestionItem.style('cursor', 'pointer');
            suggestionItem.mousePressed(() => {
                searchInput.value(country);
                searchCountry();
                suggestionBox.hide();
            });
        });
    } else {
        suggestionBox.hide();
    }
}

class City {
    constructor(name, population, lat, lon) {
        this.name = name;
        this.population = population;
        this.lat = lat;
        this.lon = lon;
        this.x = map(this.lon, -180, 180, 0, width);
        this.y = map(this.lat, 90, -90, 0, height);
    }

    display() {
        let radius = map(this.population, 0, 40000000, 2, 20);
        let isHovered = dist(mouseX, mouseY, this.x, this.y) < radius / 2;

        if (isHovered) {
            fill(0, 150, 255, 180);
            radius *= 1.2;
            hoveredCityInfo = { name: this.name, population: this.population }; // Set hovered city info
        } else {
            fill(255, 0, 0, 150);
            if (hoveredCityInfo && hoveredCityInfo.name === this.name) {
                hoveredCityInfo = null; // Clear the hovered city info if not hovering
            }
        }
        
        noStroke();
        ellipse(this.x, this.y, radius, radius);
    }
}
