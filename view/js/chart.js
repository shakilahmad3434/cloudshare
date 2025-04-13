// Storage Usage Chart
const storageCtx = document.getElementById('storageChart').getContext('2d');
const storageChart = new Chart(storageCtx, {
    type: 'doughnut',
    data: {
        labels: ['Used', 'Free'],
        datasets: [{
            data: [73, 27],
            backgroundColor: ['#10b981', '#e5e7eb'],
            borderWidth: 0
        }]
    },
    options: {
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        }
    }
});

// File Type Distribution Chart
const fileTypeCtx = document.getElementById('fileTypeChart').getContext('2d');
const fileTypeChart = new Chart(fileTypeCtx, {
    type: 'doughnut',
    data: {
        labels: ['Images', 'Documents', 'Videos', 'Audio'],
        datasets: [{
            data: [243, 153, 45, 67],
            backgroundColor: ['#60a5fa', '#fbbf24', '#f87171', '#c084fc'],
            borderWidth: 0
        }]
    },
    options: {
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// Activity Chart
const activityCtx = document.getElementById('activityChart').getContext('2d');
const activityChart = new Chart(activityCtx, {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Uploads',
            data: [5, 3, 7, 4, 8, 2, 5],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
        }, {
            label: 'Downloads',
            data: [3, 6, 2, 5, 4, 7, 3],
            borderColor: '#60a5fa',
            backgroundColor: 'rgba(96, 165, 250, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                display: false
            },
            y: {
                display: false,
                min: 0
            }
        },
        elements: {
            point: {
                radius: 0
            }
        }
    }
});