document.addEventListener("DOMContentLoaded", function () {
  loadTopics(); // Fetch and display available topics

  // Add Event Listeners to All Dropdowns
  document.querySelectorAll(".topic-select").forEach((select) => {
    select.addEventListener("change", function () {
      preventDuplicateSelections();
    });
  });

  document
    .getElementById("bookingForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value;

      const selections = [
        { slot: "Slot 1", topic: document.getElementById("slot1").value },
        { slot: "Slot 2", topic: document.getElementById("slot2").value },
        { slot: "Slot 3", topic: document.getElementById("slot3").value },
        { slot: "Slot 4", topic: document.getElementById("slot4").value },
      ];

      const data = {
        name: name,
        selections: selections,
      };

      // Optimistic UI: Immediately show success
      document.getElementById("bookingForm").classList.add("hidden");
      document.getElementById("successMessage").classList.remove("hidden");

      // Hide the lingering processing banner if it was somehow active
      const banner = document.getElementById("processingBanner");
      banner.classList.remove("visible");

      fetch(
        "https://script.google.com/macros/s/AKfycbz4p4jFmlqcTF_pnYRpGFnR5DzOpPXa989n4HAtx-xeBBYuKDh13p9x37EghhrMN-DG_g/exec",
        {
          method: "POST",
          mode: "no-cors", // Important: This means we can't see the response status, hence why we assume success
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )
        .then(() => {
          // Request completed (successfully sent)
          // UI is already in success state, so we do nothing here.
          console.log("Booking data sent silently.");
        })
        .catch((error) => {
          console.error("Error:", error);
          // Revert UI only if there's a network error (rare)
          alert("Network error: Could not submit booking. Please try again.");
          document.getElementById("bookingForm").classList.remove("hidden");
          document.getElementById("successMessage").classList.add("hidden");
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
      disableFullyBookedTopics();
    })
    .catch((error) => {
      console.error("Error fetching topics:", error);
    });
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

// Prevent Duplicate Topic Selection Across Slots with Tooltips
function preventDuplicateSelections() {
  // Get all dropdowns for slots
  const allSelects = document.querySelectorAll('.topic-select');

  // Collect selected values
  const selectedValues = Array.from(allSelects).map(select => select.value);

  // Loop through each dropdown
  allSelects.forEach(select => {
    // Loop through each option in the dropdown
    Array.from(select.options).forEach(option => {
      // Enable all options initially
      option.disabled = false;

      // Disable the option if it's selected in another dropdown
      if (option.value && selectedValues.includes(option.value)) {
        // Keep the option enabled in the current dropdown if it's the selected value
        if (select.value !== option.value) {
          option.disabled = true;
        }
      }
    });
  });
}
