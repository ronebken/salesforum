document.addEventListener("DOMContentLoaded", function () {
  loadTopics(); // Fetch and display available topics

  // Listen for changes on the brand dropdown
  document.getElementById("brand").addEventListener("change", function () {
    updateTopicsBasedOnBrand();
  });

  document
    .getElementById("bookingForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Check if mandatory topic is selected
      if (!enforceMandatoryTopic()) {
        return; // Stop form submission if validation fails
      }

      const name = document.getElementById("name").value;
      const brand = document.getElementById("brand").value;

      const selections = [
        { slot: "Slot 1", topic: document.getElementById("slot1").value },
        { slot: "Slot 2", topic: document.getElementById("slot2").value },
        { slot: "Slot 3", topic: document.getElementById("slot3").value },
        { slot: "Slot 4", topic: document.getElementById("slot4").value },
      ];

      const data = {
        name: name,
        brand: brand,
        selections: selections,
      };

      fetch("https://script.google.com/macros/s/AKfycbz4p4jFmlqcTF_pnYRpGFnR5DzOpPXa989n4HAtx-xeBBYuKDh13p9x37EghhrMN-DG_g/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(() => {
          alert("Booking successful!");
          location.reload();
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred. Please try again.");
        });
    });
});

// Fetch and Display Topics for Each Slot
function loadTopics() {
  fetch(
    "https://script.google.com/macros/s/AKfycbz4p4jFmlqcTF_pnYRpGFnR5DzOpPXa989n4HAtx-xeBBYuKDh13p9x37EghhrMN-DG_g/exec"
  )
    .then((response) => response.json())
    .then((data) => {
      // Clear existing options
      document.querySelectorAll(".topic-select").forEach((select) => {
        select.innerHTML = '<option value="">Select a topic</option>';
      });

      // Populate topics for each slot
      data.forEach((topic) => {
        let option = document.createElement("option");
        option.value = topic.topic;
        option.textContent = `${topic.topic} (${topic.slots} slots left)`;

        // Disable if no slots left
        if (parseInt(topic.slots) <= 0) {
          option.disabled = true;
          option.textContent += " - Fully booked";
        }

        // Add to the corresponding slot
        if (topic.slot === "Slot 1") {
          document.getElementById("slot1").appendChild(option);
        } else if (topic.slot === "Slot 2") {
          document.getElementById("slot2").appendChild(option);
        } else if (topic.slot === "Slot 3") {
          document.getElementById("slot3").appendChild(option);
        } else if (topic.slot === "Slot 4") {
          document.getElementById("slot4").appendChild(option);
        }
      });

      // Update visibility and disable fully booked topics
      updateTopicsBasedOnBrand();
      disableFullyBookedTopics();
    })
    .catch((error) => {
      console.error("Error fetching topics:", error);
    });
}

// Hide and Disable Topics Based on Brand Selection
function updateTopicsBasedOnBrand() {
  const brand = document.getElementById("brand").value;

  document.querySelectorAll(".topic-select").forEach((select) => {
    select.querySelectorAll("option").forEach((option) => {
      // Disable and Hide Topic 1 for Brand 1
      if (brand === "R&E" && option.value === "Financial Deal Management") {
        option.style.display = "none";
        option.disabled = true;
        if (select.value === "Financial Deal Management") {
          select.value = ""; // Reset if Topic 1 was previously selected
        }
      }
      // Disable and Hide Topic 2 for Brand 2
      else if (brand === "S&E" && option.value === "Territory Management") {
        option.style.display = "none";
        option.disabled = true;
        if (select.value === "Territory Management") {
          select.value = ""; // Reset if Topic 2 was previously selected
        }
      } else {
        option.style.display = "block";
        option.disabled = false; // Enable other options
      }
    });
  });
  // Re-check fully booked topics after updating visibility
  disableFullyBookedTopics();
}

// Disable Topics with 0 Slots Left
function disableFullyBookedTopics() {
  document.querySelectorAll(".topic-select").forEach((select) => {
    select.querySelectorAll("option").forEach((option) => {
      const slotsLeft = option.textContent.match(/\((\d+) slots left\)/);
      if (slotsLeft && parseInt(slotsLeft[1]) === 0) {
        option.disabled = true;
        option.style.color = "gray"; // Optional: Gray out fully booked options
        if (select.value === option.value) {
          select.value = ""; // Reset if the fully booked option was selected
        }
      }
    });
  });
}

// Enforce Mandatory Topic 1 Selection for Brand 1
function enforceMandatoryTopic() {
  const brand = document.getElementById("brand").value;
  const slot1 = document.getElementById("slot1");
  const slot2 = document.getElementById("slot2");

  // If Brand 1 is selected, make Topic 1 mandatory
  if (brand === "R&E") {
    // Check if Topic 1 is selected in Slot 1 or Slot 2
    if (slot1.value !== "Territory Management" && slot2.value !== "Territory Management") {
      alert(
        "As R&E user, you must select Territory Management at least once in Breakout Session 1 or Breakout Session 2."
      );
      return false;
    }
  }
  return true;
}
