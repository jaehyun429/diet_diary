// script.js
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('weightChart').getContext('2d');
    const weightChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: getWeightLabels(),
        datasets: [{
          label: '몸무게',
          data: getWeightData(),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  
    function updateChart() {
      weightChart.data.labels = getWeightLabels();
      weightChart.data.datasets[0].data = getWeightData();
      weightChart.update();
    }
  
    function saveDiet() {
      const diet = document.getElementById('dietInput').value;
      localStorage.setItem('diet', diet);
      alert('식단이 저장되었습니다.');
    }
  
    function saveExercise() {
      const exercise = document.getElementById('exerciseInput').value;
      localStorage.setItem('exercise', exercise);
      alert('운동이 저장되었습니다.');
    }
  
    function saveWeight() {
      const weight = document.getElementById('weightInput').value;
      if (weight) {
        let weights = JSON.parse(localStorage.getItem('weights')) || [];
        weights.push({ date: new Date().toLocaleDateString(), weight: weight });
        localStorage.setItem('weights', JSON.stringify(weights));
        updateChart();
        alert('몸무게가 저장되었습니다.');
      } else {
        alert('몸무게를 입력하세요.');
      }
    }
  
    function getWeightData() {
      const weights = JSON.parse(localStorage.getItem('weights')) || [];
      return weights.map(entry => entry.weight);
    }
  
    function getWeightLabels() {
      const weights = JSON.parse(localStorage.getItem('weights')) || [];
      return weights.map(entry => entry.date);
    }
  });
  