document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const brand = document.getElementById('brand').value;
    const sessions = Array.from(document.querySelectorAll('input[name="session"]:checked'))
                          .map(checkbox => checkbox.value);

    const data = {
        name: name,
        brand: brand,
        sessions: sessions
    };

    fetch('https://script.google.com/macros/s/AKfycbwXCNa-vcRSDgCLL6uP5uNvz1h9E7rTz7X6-0veUOBgUm6hqjUVmPmGrfZmupUAHDGMeA/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        alert("Booking successful!");
        location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred. Please try again.");
    });
});
