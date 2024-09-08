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
          beginAtZero: false
        },
        y: {
          beginAtZero: false
        }
      }
    }
  });

  async function saveDiaryEntry(data) {
    const token = localStorage.getItem('token'); // 클라이언트에서 토큰을 가져옴
    console.log('Stored token: ', token);
    // `token`이 undefined 또는 null이 아닌지 확인
    if (!token) {
    console.error('Token not found');
    throw new Error('Token not found');
  }
    const date = new Date().toLocaleDateString();
    const diaryData = { date, ...data };
    console.log('Sending data:', diaryData);

    try {
      const response = await fetch('/diary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 저장된 토큰을 Authorization 헤더에 포함
        },
        body: JSON.stringify(diaryData)
      });

      const responseData = await response.json();
      if (!response.ok) {
        console.error('Server responded with error:', responseData);
        throw new Error(responseData.error || '데이터 저장에 실패했습니다.');
      }

      return responseData;
    } catch (error) {
      console.error('Save failed:', error);
      throw error;
    }
  }

  function updateChart() {
    weightChart.data.labels = getWeightLabels();
    weightChart.data.datasets[0].data = getWeightData();
    weightChart.update();
  }

  window.saveAll = async function saveAll() {
    const dietMorning = document.getElementById('dietInputMorning').value;
    const dietAfternoon = document.getElementById('dietInputAfternoon').value;
    const dietEvening = document.getElementById('dietInputEvening').value;
    const exercise = document.getElementById('exerciseInput').value;
    const weight = document.getElementById('weightInput').value;

    const diet = {
      morning: dietMorning,
      afternoon: dietAfternoon,
      evening: dietEvening
    };

    const data = { diet, exercise, weight };

    try {
      console.log('Sending data:', data);
      await saveDiaryEntry(data);

      if (weight) {
        const weights = JSON.parse(localStorage.getItem('weights')) || [];
        weights.push({ date: new Date().toLocaleDateString(), weight });
        localStorage.setItem('weights', JSON.stringify(weights));
        updateChart();
      }

      alert('저장되었습니다.');
      window.location.href = '/index';
    } catch (error) {
      console.error('Save failed:', error);
      alert('저장에 실패했습니다.');
    }
  };

  function getWeightData() {
    const weights = JSON.parse(localStorage.getItem('weights')) || [];
    return weights.map(entry => entry.weight);
  }

  function getWeightLabels() {
    const weights = JSON.parse(localStorage.getItem('weights')) || [];
    return weights.map(entry => entry.date);
  }

  updateChart();
});
