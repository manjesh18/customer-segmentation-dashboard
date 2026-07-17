let customerChart = null;
let rawCustomerData = []; // Store base dataset globally to filter instantly

window.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('kSlider');
    const kValText = document.getElementById('kVal');
    const updateBtn = document.getElementById('updateBtn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const printBtn = document.getElementById('printBtn');
    
    // Filter Inputs
    const genderFilter = document.getElementById('genderFilter');
    const ageSlider = document.getElementById('ageSlider');
    const ageValText = document.getElementById('ageVal');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-theme');
            document.body.classList.toggle('light-theme', !isDark);
            themeToggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
            if (rawCustomerData.length > 0) processAndDisplay();
        });
    }

    if (printBtn) { printBtn.addEventListener('click', () => window.print()); }

    if (slider && kValText) {
        slider.addEventListener('input', (e) => kValText.textContent = e.target.value);
    }
    
    if (ageSlider && ageValText) {
        ageSlider.addEventListener('input', (e) => {
            ageValText.textContent = e.target.value;
            processAndDisplay(); // Instant dynamic update on slide
        });
    }

    if (genderFilter) {
        genderFilter.addEventListener('change', processAndDisplay); // Instant dynamic update on dropdown select
    }

    // Pull Fresh Clusters from Server
    async function fetchClusterData() {
        const k = slider ? slider.value : 6;
        try {
            const response = await fetch(`/api/cluster?k=${k}`);
            const result = await response.json();
            rawCustomerData = result.data;
            processAndDisplay();
        } catch (err) {
            console.error("Error fetching cluster metadata pipeline:", err);
        }
    }

    // Filter and display logic loop
    function processAndDisplay() {
        const selectedGender = genderFilter.value;
        const maxAge = parseInt(ageSlider.value);

        // Apply Client-Side Filtering
        const filteredCustomers = rawCustomerData.filter(c => {
            const matchGender = (selectedGender === 'All' || c.gender === selectedGender);
            const matchAge = (c.age <= maxAge);
            return matchGender && matchAge;
        });

        // 1. Calculate and Update Filtered Metrics Summary
        let totalIncome = 0, totalSpend = 0;
        filteredCustomers.forEach(c => {
            totalIncome += c.income;
            totalSpend += c.spendingScore;
        });
        
        document.getElementById('metricTotal').textContent = filteredCustomers.length;
        document.getElementById('metricIncome').textContent = filteredCustomers.length ? `$${(totalIncome / filteredCustomers.length).toFixed(1)}k` : '$0k';
        document.getElementById('metricSpend').textContent = filteredCustomers.length ? (totalSpend / filteredCustomers.length).toFixed(1) : '0';

        // 2. Populate and Refresh Roster Data Table Data
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = '';
        filteredCustomers.forEach(c => {
            const row = `<tr>
                <td>${c.customerId}</td>
                <td>${c.gender}</td>
                <td>${c.age}</td>
                <td>$${c.income}k</td>
                <td>${c.spendingScore}</td>
                <td><span style="font-weight:bold; color:var(--accent-color)">Cluster ${c.cluster + 1}</span></td>
            </tr>`;
            tbody.innerHTML += row;
        });

        // 3. Re-Group and Re-Render Chart.js Scatter Points
        const clustersData = {};
        filteredCustomers.forEach(item => {
            if (clustersData[item.cluster] === undefined) clustersData[item.cluster] = [];
            clustersData[item.cluster].push({
                x: item.income, y: item.spendingScore,
                age: item.age, gender: item.gender, id: item.customerId
            });
        });

        const isDark = document.body.classList.contains('dark-theme');
        const gridColor = isDark ? '#334155' : '#cbd5e1';
        const textColor = isDark ? '#94a3b8' : '#64748b';
        const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1', '#a855f7', '#64748b'];

        const datasets = Object.keys(clustersData).map((clusterNum, idx) => {
            return {
                label: `Cluster ${Number(clusterNum) + 1}`,
                data: clustersData[clusterNum],
                backgroundColor: colors[clusterNum % colors.length], // Map static colors index to cluster value
                pointRadius: 7,
                pointHoverRadius: 10
            };
        });

        const canvas = document.getElementById('customerChart');
        if (customerChart) customerChart.destroy();

        const ctx = canvas.getContext('2d');
        customerChart = new Chart(ctx, {
            type: 'scatter',
            data: { datasets: datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Annual Income (k$)', color: textColor },
                        grid: { color: gridColor }, ticks: { color: textColor }
                    },
                    y: {
                        title: { display: true, text: 'Spending Score (1-100)', color: textColor },
                        grid: { color: gridColor }, ticks: { color: textColor }
                    }
                },
                plugins: {
                    legend: { labels: { color: isDark ? '#f8fafc' : '#0f172a' } },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const p = context.raw;
                                return `ID: ${p.id} | Age: ${p.age} | Gender: ${p.gender} | Income: ${p.x}k | Score: ${p.y}`;
                            }
                        }
                    }
                }
            }
        });
    }

    if (updateBtn) updateBtn.addEventListener('click', fetchClusterData);
    fetchClusterData();
});