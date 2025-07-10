let bmiChart;

document.getElementById('bmiForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const age = parseInt(document.getElementById('age').value);
  const gender = document.getElementById('gender').value;
  const height = parseFloat(document.getElementById('height').value);
  const weight = parseFloat(document.getElementById('weight').value);
  const unit = document.querySelector('input[name="units"]:checked').value;

  if (!age || !gender || !height || !weight) {
    alert('Please fill out all fields.');
    return;
  }

  let heightMeters = unit === 'metric' ? height / 100 : height * 0.0254;
  let weightKg = unit === 'metric' ? weight : weight * 0.453592;

  const bmi = weightKg / (heightMeters * heightMeters);
  const bmiRounded = bmi.toFixed(2);

  let message = '';
  if (bmi < 18.5) {
    message = 'Underweight';
  } else if (bmi < 24.9) {
    message = 'Normal weight';
  } else if (bmi < 29.9) {
    message = 'Overweight';
  } else {
    message = 'Obese';
  }

  // Display BMI result
  document.getElementById('bmiResult').innerText = `BMI: ${bmiRounded}`;
  const messageEl = document.getElementById('bmiMessage');
  messageEl.innerText = `${message} (Age: ${age}, Gender: ${gender})`;

  // Color-coded classes
  messageEl.className = '';
  if (message === 'Underweight') messageEl.classList.add('underweight');
  if (message === 'Normal weight') messageEl.classList.add('normal');
  if (message === 'Overweight') messageEl.classList.add('overweight');
  if (message === 'Obese') messageEl.classList.add('obese');

  updateHealthTip(message);
  updateChart(bmiRounded, message);
  updateHistory(age, gender, bmiRounded, message);
});

function updateHealthTip(category) {
  const tips = {
    "Underweight": "Eat more frequently, choose nutrient-rich foods, add healthy snacks, and engage in strength training.",
    "Normal weight": "Maintain your current lifestyle. Keep eating a balanced diet and stay active daily.",
    "Overweight": "Control portion size, reduce sugar intake, exercise regularly, and monitor your weight.",
    "Obese": "Consult a doctor or nutritionist, follow a structured diet, increase activity level, and consider behavioral support."
  };
  document.getElementById('healthTip').innerText = tips[category] || "";
}

function updateChart(bmi, category) {
  const ctx = document.getElementById('bmiChart').getContext('2d');

  if (bmiChart) {
    bmiChart.destroy();
  }

  bmiChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Underweight', 'Normal', 'Overweight', 'Obese'],
      datasets: [{
        label: 'Your BMI',
        data: [
          category === 'Underweight' ? bmi : 0,
          category === 'Normal weight' ? bmi : 0,
          category === 'Overweight' ? bmi : 0,
          category === 'Obese' ? bmi : 0
        ],
        backgroundColor: [
          category === 'Underweight' ? '#e63946' : '#ccc',
          category === 'Normal weight' ? '#38b000' : '#ccc',
          category === 'Overweight' ? '#f4a261' : '#ccc',
          category === 'Obese' ? '#e76f51' : '#ccc'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'BMI Value'
          }
        }
      }
    }
  });
}

function updateHistory(age, gender, bmi, status) {
  const historyItem = document.createElement('li');
  historyItem.innerText = `${new Date().toLocaleString()} - BMI: ${bmi} (${status}) [Age: ${age}, Gender: ${gender}]`;

  const historyList = document.getElementById('bmiHistory');
  historyList.prepend(historyItem);

  let stored = JSON.parse(localStorage.getItem('bmiHistory')) || [];
  stored.unshift({
    timestamp: new Date(),
    age, gender, bmi, status
  });

  localStorage.setItem('bmiHistory', JSON.stringify(stored));
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('bmiHistory')) || [];
  const historyList = document.getElementById('bmiHistory');
  historyList.innerHTML = '';

  history.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${new Date(item.timestamp).toLocaleString()} - BMI: ${item.bmi} (${item.status}) [Age: ${item.age}, Gender: ${item.gender}]`;
    historyList.appendChild(li);
  });
}

document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.getElementById('themeToggle').textContent =
    document.body.classList.contains('dark') ? '☀️' : '🌙';
});

loadHistory();
