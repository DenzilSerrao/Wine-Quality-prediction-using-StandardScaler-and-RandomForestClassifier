# Wine Quality Prediction Web Application

An elegant web application that predicts wine quality based on physicochemical properties using machine learning.

## Features

- **Machine Learning Model**: Predicts wine quality on a scale of 3-9 based on chemical properties
- **Interactive Frontend**: Beautiful UI with form inputs and informative tooltips
- **Detailed Results**: Visual quality meter, top influencing factors, and probability distribution
- **Flask Backend API**: Handles prediction requests and returns detailed results
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Screenshots

![Wine Quality Prediction App](https://images.pexels.com/photos/2702805/pexels-photo-2702805.jpeg?auto=compress&cs=tinysrgb&w=800)

## Project Structure

```
wine-quality-prediction/
├── README.md
├── requirements.txt
├── model/
│   ├── train_model.py
│   ├── model.pkl (generated)
│   ├── scaler.pkl (generated)
│   └── feature_names.pkl (generated)
├── backend/
│   └── app.py
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

## Getting Started

### Prerequisites

- Python 3.8+
- Flask
- scikit-learn
- pandas
- numpy
- A web browser

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/wine-quality-prediction.git
   cd wine-quality-prediction
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Train the model:
   ```
   python model/train_model.py
   ```

4. Start the Flask server:
   ```
   python backend/app.py
   ```

5. Run the `index.html` file in the frontend

## Dataset

The model is trained on the Wine Quality Dataset, which includes various chemical properties of wines and their quality ratings.

Features include:
- Fixed acidity
- Volatile acidity
- Citric acid
- Residual sugar
- Chlorides
- Free sulfur dioxide
- Total sulfur dioxide
- Density
- pH
- Sulphates
- Alcohol

## How It Works

1. The user inputs the chemical properties of a wine sample
2. The Flask backend receives the data and preprocesses it using the saved scaler
3. The trained Random Forest model predicts the wine quality
4. The backend returns the prediction along with probabilities and feature importance
5. The frontend displays the results in an intuitive, visually appealing way

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.