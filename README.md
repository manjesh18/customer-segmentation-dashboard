# 📊 Customer Segmentation Analysis Dashboard

An interactive, full-stack Machine Learning web application that segments retail customers using **K-Means Clustering**. Built with a **Flask (Python)** REST API backend and a responsive **HTML5 / CSS3 / JavaScript (Chart.js)** frontend dashboard.

---

## ✨ Features

* **Dynamic Machine Learning Pipeline:** Real-time K-Means clustering powered by `scikit-learn` and `pandas`.
* **Interactive Visualization:** Custom scatter plots using `Chart.js` with theme-aware gridlines and rich tooltips.
* **Demographic Filters:** Client-side filtering by **Gender** and **Age** with instant dynamic UI re-rendering.
* **KPI Metric Cards:** Live tracking of filtered customer counts, average annual income, and average spending scores.
* **Filterable Customer Roster Table:** Interactive data table mapping individual customer IDs to their assigned cluster segment.
* **Customization & Reporting:** Integrated **Dark/Light Mode** toggle and a **Print/PDF Export** view for presentation reports.

---

## 🛠️ Tech Stack

* **Backend:** Python 3, Flask, Scikit-learn, Pandas, Gunicorn
* **Frontend:** HTML5, Modern CSS Variables, Vanilla JavaScript (ES6+), Chart.js
* **Dataset:** Mall Customers Dataset (`Mall_Customers.csv`)

---

## 📁 Repository Structure

```text
customer-segmentation-dashboard/
│
├── static/
│   ├── chart.js        # Local Chart.js library
│   ├── script.js       # Dynamic UI logic & API handling
│   └── style.css       # Custom dark/light theme stylesheet
│
├── templates/
│   └── index.html      # Main dashboard interface layout
│
├── Mall_Customers.csv  # Customer dataset
├── app.py              # Flask application & API routes
├── requirements.txt    # Python package dependencies
└── README.md           # Project documentation
