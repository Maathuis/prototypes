document.addEventListener('DOMContentLoaded', function () {
  const sliders = document.querySelectorAll('.filter-menu input[type="range"]');
  const explanationDropdown = document.getElementById('explanation-dropdown');
  const modal = document.getElementById('image-modal');
  const modalImage = document.getElementById('modal-image');
  const closeModal = document.getElementById('close-modal');
  const images = document.querySelectorAll('.gallery .image img');

  // Update displayed slider value and trigger filtering
  sliders.forEach(slider => {
    const label = slider.previousElementSibling;
    const valueDisplay = document.getElementById(label.getAttribute('for') + '-value');
    
    slider.addEventListener('input', function () {
      valueDisplay.textContent = slider.value;
      filterImages();
    });
  });

  // Event listeners for image click (to open modal)
  images.forEach(image => {
    image.addEventListener('click', function () {
      modalImage.src = this.src;
      modal.classList.add('show'); // Add 'show' to display modal
    });
  });

  // Event listener for closing the modal
  closeModal.addEventListener('click', function () {
    modal.classList.remove('show'); // Remove 'show' to hide modal
  });

  // Event listener for explanation dropdown to trigger filtering
  explanationDropdown.addEventListener('change', function () {
    filterImages();
  });
});

function filterImages() {
  const minRatings = {
    understandability: document.getElementById('understandability-slider').value,
    ease_of_understanding: document.getElementById('ease_of_understanding-slider').value,
    ease_of_use: document.getElementById('ease_of_use-slider').value,
    satisfaction: document.getElementById('satisfaction-slider').value,
    usefulness: document.getElementById('usefulness-slider').value
  };

  const selectedExplanation = document.getElementById('explanation-dropdown').value;

  // Get all images
  const images = document.querySelectorAll('.gallery .image');

  images.forEach(image => {
    // Get the ratings for the current image
    const imageRatings = {
      understandability: image.getAttribute('data-understandability'),
      ease_of_understanding: image.getAttribute('data-ease_of_understanding'),
      ease_of_use: image.getAttribute('data-ease_of_use'),
      satisfaction: image.getAttribute('data-satisfaction'),
      usefulness: image.getAttribute('data-usefulness')
    };

    // Check if the image meets the minimum rating criteria
    const hasValidRatings = Object.keys(minRatings).every(criterion => {
      return parseInt(imageRatings[criterion]) >= minRatings[criterion];
    });

    // Get the tags for the current image (which could include the explanation type)
    const imageTags = image.getAttribute('data-tags').split(',');

    // Check if the image matches the selected explanation type
    const hasMatchingExplanation = !selectedExplanation || imageTags.includes(selectedExplanation);

    // Apply the filter logic
    if (hasValidRatings && hasMatchingExplanation) {
      image.classList.remove('hidden');
    } else {
      image.classList.add('hidden');
    }
  });
}

document.getElementById("toggle-filter-btn").addEventListener("click", function() {
  const filterCriteria = document.getElementById("filter-criteria");
  filterCriteria.classList.toggle("collapsed");
});



