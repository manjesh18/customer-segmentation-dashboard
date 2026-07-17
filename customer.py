import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# 1. Load the Kaggle Dataset
try:
    df = pd.read_csv('Mall_Customers.csv')
    print("✅ Dataset loaded successfully!")
except FileNotFoundError:
    print("❌ Error: 'Mall_Customers.csv' not found. Ensure it is in the same folder.")
    exit()

# 2. Extract Features
X = df[['Annual Income (k$)', 'Spending Score (1-100)']]

# 3. Scale Features (Crucial for distance-based algorithms like K-Means)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 4. Determine Optimal Clusters using Elbow Method
wcss = []
for i in range(1, 11):
    kmeans = KMeans(n_clusters=i, init='k-means++', random_state=42)
    kmeans.fit(X_scaled)
    wcss.append(kmeans.inertia_)

# Plot the Elbow Method to verify visually
plt.figure(figsize=(8, 4))
plt.plot(range(1, 11), wcss, marker='o', linestyle='--', color='b')
plt.title('The Elbow Method for Optimal K')
plt.xlabel('Number of Clusters (K)')
plt.ylabel('WCSS')
plt.grid(True)
plt.show() # Close this window to let the script finish running

# 5. Apply K-Means with K=5 (Standard choice for this dataset)
optimal_k = 5
kmeans = KMeans(n_clusters=optimal_k, init='k-means++', random_state=42)
df['Cluster'] = kmeans.fit_predict(X_scaled)

# 6. Map Numeric Clusters to Business Segments
# Note: K-Means cluster assignment numbers are random on initialization. 
# We map them cleanly so your final plot looks descriptive.
cluster_names = {
    0: 'Standard (Mid Income, Mid Spend)',
    1: 'Careless (Low Income, High Spend)',
    2: 'Target/Stars (High Income, High Spend)',
    3: 'Sensible (Low Income, Low Spend)',
    4: 'Careful (High Income, Low Spend)'
}
df['Customer_Segment'] = df['Cluster'].map(cluster_names)

# 7. Final Scatter Plot Visualization
plt.figure(figsize=(11, 7))
sns.scatterplot(
    x='Annual Income (k$)', 
    y='Spending Score (1-100)', 
    hue='Customer_Segment', 
    palette='Set1', 
    data=df, 
    s=120, 
    edgecolor='black',
    alpha=0.8
)

plt.title('Customer Segmentation Analysis (K-Means Clustering)', fontsize=16, fontweight='bold')
plt.xlabel('Annual Income (k$)', fontsize=12)
plt.ylabel('Spending Score (1-100)', fontsize=12)
plt.legend(title='Customer Groups', bbox_to_anchor=(1.05, 1), loc='upper left')
plt.grid(True, linestyle='--', alpha=0.5)
plt.tight_layout()

print("\n🎉 Analysis complete! Showing final plot...")
plt.show()