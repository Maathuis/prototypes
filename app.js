const categories = [
  "Understand", "Easy to Understand", "Easy to Use", "Satisfying",
  "Useful", "Trustworthy", "Typical", "Sufficient",
  "Correct", "Concise", "Act"
];

const dataSets = {
  data1: {
    "Prototype 1": [5, 5, 5, 3, 3, 5, 4, 2, 5, 4, 3],
    "Prototype 2": [4, 3, 2, 3, 2, 4, 4, 3, 4, 2, 2],
    "Prototype 3": [4, 4, 4, 3, 3, 5, 4, 4, 4, 2, 3],
    "Prototype 4": [5, 5, 5, 4, 3, 4, 4, 5, 5, 5, 3],
    "Prototype 5": [2, 2, 2, 2, 2, 4, 3, 1, 4, 2, 2]
  },
  data2: {
    "Prototype 1": [4, 4, 4, 4, 5, 4, 3, 4, 4, 4, 4],
    "Prototype 2": [4, 4, 2, 2, 1, 3, 2, 1, 4, 2, 1],
    "Prototype 3": [4, 3, 2, 3, 2, 4, 4, 4, 4, 2, 3],
    "Prototype 4": [4, 4, 4, 2, 4, 4, 3, 3, 4, 4, 3],
    "Prototype 5": [4, 2, 3, 4, 4, 5, 3, 4, 4, 4, 4]
  },
  data3: {
    "Prototype 1": [4, 5, 4, 4, 3, 3, 4, 3, 4, 5, 3],
    "Prototype 2": [4, 4, 3, 4, 4, 3, 3, 3, 3, 4, 3],
    "Prototype 3": [2, 4, 4, 4, 4, 3, 3, 4, 4, 3, 3],
    "Prototype 4": [4, 4, 3, 4, 4, 3, 3, 4, 3, 5, 3],
    "Prototype 5": [3, 4, 2, 4, 3, 3, 2, 3, 4, 3, 3]
  }
};

const ctx = document.getElementById('radar-chart').getContext('2d');
let chart;
let userDefinedGroups = [];

function calculateMean(values) {
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

function detectOutliers(values) {
  const mean = calculateMean(values);
  const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
  const threshold = 2; // Number of standard deviations to define outliers
  return values.map(value => Math.abs(value - mean) > threshold * stdDev ? 'outlier' : 'normal');
}

function getAggregatedDataByCategories(selectedDatasets, selectedPrototypes, selectedCategories) {
  return selectedPrototypes.map(prototype => {
    const aggregatedValues = selectedCategories.map(category => {
      const values = selectedDatasets.map(dataset => {
        return dataSets[dataset][prototype][categories.indexOf(category)];
      });

      const outlierStatus = detectOutliers(values);
      const meanValue = calculateMean(values);

      return {
        meanValue,
        outliers: outlierStatus
      };
    });

    return {
      label: prototype,
      data: aggregatedValues.map(val => val.meanValue),
      fill: true,
      backgroundColor: aggregatedValues.map(val =>
        val.outliers.includes('outlier') ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 0, 255, 0.2)'
      ),
      borderColor: aggregatedValues.map(val =>
        val.outliers.includes('outlier') ? 'rgba(255, 0, 0, 1)' : 'rgba(0, 0, 255, 1)'
      ),
      borderWidth: 2
    };
  });
}

function getAggregatedDataByGroups(selectedDatasets, selectedPrototypes) {
  const groupsToUse = userDefinedGroups.length > 0 ? userDefinedGroups : [{
    name: 'All Categories',
    categories: categories.map((_, index) => index)
  }];

  return selectedPrototypes.map(prototype => {
    const aggregatedValues = groupsToUse.map(group => {
      const values = selectedDatasets.map(dataset => {
        const groupValues = group.categories.map(categoryIndex => {
          return dataSets[dataset][prototype][categoryIndex];
        });
        return calculateMean(groupValues);
      });
      return calculateMean(values);
    });

    return {
      label: prototype,
      data: aggregatedValues,
      fill: true,
      backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
      borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
      borderWidth: 2
    };
  });
}

function updateChart() {
  const chartType = document.getElementById('chart-type').value;

  const selectedDatasets = Array.from(document.getElementById('datasets').selectedOptions).map(opt => opt.value);
  const selectedPrototypes = Array.from(document.getElementById('prototypes').selectedOptions).map(opt => opt.value);

  const aggregatedData = getAggregatedDataByGroups(selectedDatasets, selectedPrototypes);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: chartType,
    data: {
      labels: userDefinedGroups.map(group => group.name),
      datasets: aggregatedData
    },
    options: {
      responsive: true,
      scales: {
        r: {
          angleLines: { display: true },
          suggestedMin: 0,
          suggestedMax: 5,
          ticks: { display: true }
        }
      }
    }
  });
}

function updateGroupList() {
  const groupList = document.getElementById('group-list');
  groupList.innerHTML = '';
  
  userDefinedGroups.forEach(group => {
    const li = document.createElement('li');
    li.innerHTML = `${group.name} <button class="remove-group">x</button>`;
    groupList.appendChild(li);

    // Remove group functionality
    li.querySelector('.remove-group').addEventListener('click', (event) => {
      event.stopPropagation();  // Prevent click from bubbling to the parent li element
      userDefinedGroups = userDefinedGroups.filter(g => g !== group);
      updateGroupList();
      updateChart();
    });

    // Rename group functionality (only triggered when the li itself is clicked, not the remove button)
    li.addEventListener('click', () => {
      const newGroupName = prompt("Enter new group name", group.name);
      if (newGroupName) {
        group.name = newGroupName;
        li.innerHTML = `${newGroupName} <button class="remove-group">x</button>`;
      }
      updateChart();
    });
  });
}
document.getElementById('add-group').addEventListener('click', function() {
  const selectedCategories = Array.from(document.getElementById('group-categories').selectedOptions).map(opt => parseInt(opt.value));
  
  // Set the group name to the concatenated names of the selected categories
  const groupName = selectedCategories.map(index => categories[index]).join(", ");
  const newGroup = { name: groupName, categories: selectedCategories };

  userDefinedGroups.push(newGroup);
  updateGroupList();
  updateChart();
});


document.querySelectorAll('#datasets, #prototypes, #group-categories').forEach(element => {
  element.addEventListener('change', updateChart);
});

document.getElementById('chart-type').addEventListener('change', updateChart);

updateChart();
