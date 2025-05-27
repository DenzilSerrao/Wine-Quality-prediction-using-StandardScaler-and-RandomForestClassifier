document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const wineForm = document.getElementById('wine-form');
    const predictBtn = document.getElementById('predict-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const resultsSection = document.getElementById('results-section');
    const loadingSection = document.getElementById('loading');
    const resultsContent = document.getElementById('results');
    const errorMessage = document.getElementById('error-message');
    const qualityValue = document.getElementById('quality-value');
    const qualityDescription = document.getElementById('quality-description');
    const factorsList = document.getElementById('factors-list');
    const probabilityChart = document.getElementById('probability-chart');

    // Base URL for API calls - adjust based on your deployment
    const API_URL = 'http://localhost:5000/api/predict';

    // Sample data for demonstration
    const sampleData = {
        'fixed acidity': 7.4,
        'volatile acidity': 0.7,
        'citric acid': 0.0,
        'residual sugar': 1.9,
        'chlorides': 0.076,
        'free sulfur dioxide': 11.0,
        'total sulfur dioxide': 34.0,
        'density': 0.9978,
        'pH': 3.51,
        'sulphates': 0.56,
        'alcohol': 9.4
    };

    // Fill the form with sample data
    sampleBtn.addEventListener('click', function() {
        Object.keys(sampleData).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = sampleData[key];
            }
        });
    });

    // Handle form submission
    wineForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading and hide other sections
        loadingSection.classList.remove('hidden');
        resultsContent.classList.add('hidden');
        errorMessage.classList.add('hidden');
        resultsSection.classList.add('results-visible');
        
        // Collect form data
        const formData = {};
        const inputs = wineForm.querySelectorAll('input');
        inputs.forEach(input => {
            formData[input.name] = parseFloat(input.value);
        });
        
        // Send prediction request
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayResults(data);
        })
        .catch(error => {
            console.error('Error:', error);
            loadingSection.classList.add('hidden');
            errorMessage.classList.remove('hidden');
        });
    });

    // Display prediction results
    function displayResults(data) {
        // Hide loading and show results
        loadingSection.classList.add('hidden');
        resultsContent.classList.remove('hidden');
        
        // Set quality value and position
        const quality = data.prediction;
        qualityValue.textContent = quality;
        
        // Determine the color and position based on quality
        const percentage = ((quality - 3) / 6) * 100;
        qualityValue.style.left = `${percentage}%`;
        
        // Set quality description
        qualityDescription.innerHTML = getQualityDescription(quality);
        
        // Display top features
        factorsList.innerHTML = '';
        Object.entries(data.top_features).forEach(([feature, importance]) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${formatFeatureName(feature)}</span> <span>${(importance * 100).toFixed(1)}%</span>`;
            factorsList.appendChild(li);
        });
        
        // Create probability chart
        createProbabilityChart(data.probabilities);
        
        // Add animation class
        Array.from(resultsContent.children).forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate-in');
            }, index * 150);
        });
    }

    // Format feature names for display
    function formatFeatureName(name) {
        return name
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Get description based on wine quality
    function getQualityDescription(quality) {
        let description = '';
        
        if (quality <= 4) {
            description = `<p><strong>Low Quality (${quality}/10):</strong> This wine would benefit from improvement. It may have noticeable flaws in taste, aroma, or balance.</p>`;
        } else if (quality <= 6) {
            description = `<p><strong>Average Quality (${quality}/10):</strong> This is a decent, drinkable wine with balanced properties. It's suitable for everyday consumption.</p>`;
        } else if (quality <= 8) {
            description = `<p><strong>Good Quality (${quality}/10):</strong> This is a very good wine with distinctive character and few flaws. It shows good balance and complexity.</p>`;
        } else {
            description = `<p><strong>Excellent Quality (${quality}/10):</strong> This is an outstanding wine of exceptional quality. It demonstrates excellent balance, complexity, and character.</p>`;
        }
        
        return description;
    }

    // Create probability chart
    function createProbabilityChart(probabilities) {
        probabilityChart.innerHTML = '';
        
        // Find max probability for scaling
        const maxProb = Math.max(...Object.values(probabilities));
        
        // Create bars for each quality level
        Object.entries(probabilities).forEach(([quality, probability]) => {
            const barHeight = (probability / maxProb) * 100;
            const percentage = (probability * 100).toFixed(1);
            
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = `${Math.max(5, barHeight)}%`;
            
            // Add label
            const label = document.createElement('div');
            label.className = 'chart-bar-label';
            label.textContent = quality;
            bar.appendChild(label);
            
            // Add value
            if (percentage > 1) {
                const value = document.createElement('div');
                value.className = 'chart-bar-value';
                value.textContent = `${percentage}%`;
                bar.appendChild(value);
            }
            
            probabilityChart.appendChild(bar);
        });
    }

    // Add tooltip hover effects
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input');
        const tooltip = group.querySelector('.tooltip');
        
        input.addEventListener('focus', () => {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        });
        
        input.addEventListener('blur', () => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        });
    });
});