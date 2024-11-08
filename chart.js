let cityPopulationChart;

window.onload = function() {
    initializeChart();
};

function initializeChart() {
    const ctx = document.getElementById('cityPopulationChart').getContext('2d');
    cityPopulationChart = new Chart(ctx, {
        type: 'bar', // Standard vertical bar chart
        data: {
            labels: [], // Placeholder for city names (on the x-axis)
            datasets: [{
                label: 'Population',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                maxBarThickness: 20 // Controls max bar thickness for consistent size
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allows chart to fill container's height
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw.toLocaleString()} people`;
                        }
                    }
                }
            },
            scales: {
                x: { 
                    title: { display: true, text: 'Cities' } // Cities are on the x-axis
                },
                y: { 
                    title: { display: true, text: 'Population' } // Population is on the y-axis
                }
            }
        }
    });
}

// Function to update chart data when a country is selected
function updateChart(countryName, cityNames, populations) {
    if (!cityPopulationChart) {
        console.error("Chart not initialized");
        return;
    }

    // Update chart data and labels
    cityPopulationChart.data.labels = cityNames; // Set city names on the x-axis
    cityPopulationChart.data.datasets[0].data = populations; // Set population values on the y-axis
    cityPopulationChart.options.plugins.title = { display: true, text: `Population of Cities in ${countryName}` };
    cityPopulationChart.update();

    // Show the chart container
    document.getElementById('chartContainer').style.display = 'block';
}
