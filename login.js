document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

    // Ensure messageElement exists
    if (!messageElement) {
        console.error('Message element not found');
        return;
    }

    // Make an API call to the authentication endpoint
    fetch('http://54.226.228.156:5050/api/authentication', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else if (response.status === 401) {
            throw new Error('Check user credentials or User authorization and try again');
        } else if (response.status === 400) {
            throw new Error('Bad request. Please provide both username and password.');
        } else {
            throw new Error('An unexpected error occurred.');
        }
    })
    .then(data => {
        if (data.message) {
            messageElement.textContent = data.message; // Display success message
        } else {
            messageElement.textContent = 'Authenticated successfully'; // Fallback message
        }
        messageElement.style.color = 'green'; // Change message color to green for success
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username); // Store username for later use
        localStorage.setItem('password', password); // Store password for later use
        setTimeout(() => {
            window.location.href = 'index.html'; // Redirect to index.html after 1 second
        }, 1000);
    })
    .catch(error => {
        messageElement.textContent = error.message; // Display error message
        messageElement.style.color = 'red'; // Change message color to red for errors
    });
});