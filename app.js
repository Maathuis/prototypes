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

// Calculate the mean of an array of values
function calculateMean(values) {
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

// Aggregates data by categories
function getAggregatedDataByCategories(selectedDatasets, selectedPrototypes, selectedCategories) {
  return selectedPrototypes.map(prototype => {
    const aggregatedValues = selectedCategories.map(category => {
      const values = selectedDatasets.map(dataset => {
        return dataSets[dataset][prototype][categories.indexOf(category)];
      });
      return calculateMean(values);  // Aggregate values by mean
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

// Aggregates data by user-defined groups
function getAggregatedDataByGroups(selectedDatasets, selectedPrototypes) {
  return selectedPrototypes.map(prototype => {
    const aggregatedValues = userDefinedGroups.map(group => {
      const values = selectedDatasets.map(dataset => {
        const groupValues = group.categories.map(categoryIndex => {
          return dataSets[dataset][prototype][categoryIndex];
        });
        return calculateMean(groupValues);  // Aggregate values by mean within the group
      });
      return calculateMean(values);  // Aggregate values by mean across datasets
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

// Update chart based on selected datasets, groups, or categories
function updateChart() {
  const selectedDatasets = Array.from(document.getElementById('datasets').selectedOptions).map(opt => opt.value);
  const selectedPrototypes = Array.from(document.getElementById('prototypes').selectedOptions).map(opt => opt.value);

  // If no groups are created, use only the selected categories
  const aggregatedData = getAggregatedDataByGroups(selectedDatasets, selectedPrototypes);
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'radar',
    data: {
      // If no groups are defined, the labels will be the selected categories
      labels: userDefinedGroups.map(group => group.name),  // If no groups, use selected categories
      datasets: aggregatedData
    },
    options: {
      responsive: true,
      scales: {
        r: {
          angleLines: {
            display: true  // Display angle lines
          },
          suggestedMin: 0,
          suggestedMax: 5,
          ticks: {
            display: true  // Display ticks for range
          }
        }
      }
    }
  });
}

// Add a new user-defined group
document.getElementById('add-group').addEventListener('click', () => {
  const selectedCategories = Array.from(document.getElementById('group-categories').selectedOptions).map(opt => parseInt(opt.value));

  // If no group name is provided, use the selected category names as the group name
  const newGroupName = selectedCategories.map(i => categories[i]).join(', ');

  if (selectedCategories.length > 0) {
    const newGroup = { name: newGroupName, categories: selectedCategories };
    userDefinedGroups.push(newGroup);

    // Update the group list
    const groupList = document.getElementById('group-list');
    const li = document.createElement('li');
    li.innerHTML = `${selectedCategories.map(i => categories[i]).join(', ')} 
                    <button class="remove-group">x</button>`;
    groupList.appendChild(li);

    // Add event listener to remove the group when the "x" is clicked
    li.querySelector('.remove-group').addEventListener('click', () => {
      userDefinedGroups = userDefinedGroups.filter(group => group !== newGroup);
      groupList.removeChild(li);
      updateChart(); // Update the chart after removing the group
    });

    // Reset the form
    document.getElementById('group-categories').selectedIndex = -1;

    // Update the chart with the new group
    updateChart();
  } else {
    alert("Please select categories.");
  }
});

// Trigger chart update when the 'Update Chart' button is clicked
document.getElementById('update-chart').addEventListener('click', updateChart);
