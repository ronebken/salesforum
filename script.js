document.addEventListener('DOMContentLoaded', updateSlots);

document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const brand = document.getElementById('brand').value;
    const sessions = Array.from(document.querySelectorAll('input[name="session"]:checked'))
                          .map(checkbox => checkbox.value);

    if (sessions.length > 4) {
        alert("You can select up to 4 breakout sessions.");
        return;
    }

    const data = {
        name: name,
        brand: brand,
        sessions: sessions
    };

    fetch('YOUR_GOOGLE_WEB_APP_URL', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
      .then(data => {
          if (data.status === "success") {
              alert("Booking successful!");
              location.reload();
          } else {
              alert(data.message);
          }
      }).catch(error => {
          console.error('Error:', error);
          alert("An error occurred. Please try again.");
      });
});

function updateSlots() {
    fetch('YOUR_GOOGLE_WEB_APP_URL?getSlots=true')
        .then(response => response.json())
        .then(data => {
            data.forEach(slot => {
                const slotElement = document.getElementById(`slots-${slot.session.toLowerCase().replace(/ /g, '')}`);
                if (slotElement) {
                    slotElement.textContent = slot.slots;
                    if (parseInt(slot.slots) === 0) {
                        const checkbox = document.querySelector(`input[value="${slot.session}"]`);
                        checkbox.disabled = true;
                    }
                }
            });
        }).catch(error => {
            console.error('Error:', error);
        });
}
