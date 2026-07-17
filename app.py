import os
from flask import Flask, render_template, jsonify, request
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# 1. Get the absolute directory path where app.py lives
base_dir = os.path.dirname(os.path.abspath(__file__))

# 2. Initialize Flask with explicit folder mappings
app = Flask(
    __name__,
    template_folder=os.path.join(base_dir, 'templates'),
    static_folder=os.path.join(base_dir, 'static')
)

# 3. Secure the CSV dataset absolute path
csv_path = os.path.join(base_dir, 'Mall_Customers.csv')

try:
    df = pd.read_csv(csv_path)
    print("✅ Dataset loaded successfully!")
    income_col = [col for col in df.columns if 'income' in col.lower()][0]
    spend_col = [col for col in df.columns if 'spend' in col.lower() or 'score' in col.lower()][0]
except Exception as e:
    print(f"\n❌ ERROR LOADING CSV: {e}\n")
    raise e

@app.route('/')
def index():
    # Renders the HTML frontend
    return render_template('index.html')

@app.route('/api/cluster', methods=['GET'])
def get_clusters():
    # Get the value of K from the user's frontend slider (default to 5)
    k_value = int(request.args.get('k', 5))
    
    X = df[[income_col, spend_col]]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train K-Means
    kmeans = KMeans(n_clusters=k_value, init='k-means++', random_state=42)
    df['Cluster'] = kmeans.fit_predict(X_scaled)
    
    # Structure data cleanly for JavaScript consumption
    customers_json = []
    for _, row in df.iterrows():
        customers_json.append({
            'customerId': int(row['CustomerID']),
            'age': int(row['Age']),
            'gender': row['Gender'],
            'income': int(row[income_col]),
            'spendingScore': int(row[spend_col]),
            'cluster': int(row['Cluster'])
        })
        
    return jsonify({
        'k': k_value,
        'data': customers_json
    })

if __name__ == '__main__':
    # Bind to 0.0.0.0 and pull the dynamic port assigned by the cloud host
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)