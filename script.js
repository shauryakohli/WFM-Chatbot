let recognition;
let isRecording = false;

document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('voice-button').addEventListener('click', function() {
    if (!recognition) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('user-input').value = transcript;
            sendMessage();
        };
        recognition.onerror = function(event) {
            console.error('Speech recognition error', event);
            isRecording = false;
        };
    }

    if (isRecording) {
        recognition.stop();
        isRecording = false;
    } else {
        recognition.start();
        isRecording = true;
    }
});

document.getElementById('new-chat').addEventListener('click', function() {
    document.getElementById('chatbox-body').innerHTML = '';
});

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (userInput.trim() !== '' && username && password) {
        appendMessage('user', userInput);
        document.getElementById('user-input').value = '';

        // Make an API call to the chat endpoint
        fetch('http://54.226.228.156:5050/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                userMessage: userInput
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data); // Debugging: Log the API response
            if (data.category.toLowerCase() === 'text') {
                appendMessage('bot', data.message);
            } else if (data.category.toLowerCase() === 'table') {
                appendMessage('bot', data.message);
                try {
                    const tableData = JSON.parse(data.data.replace(/'/g, '"')); // Parse the data string into an array
                    appendTable(tableData, data.select);
                } catch (error) {
                    console.error('Error parsing table data:', error);
                    appendMessage('bot', 'An error occurred while parsing table data.');
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            appendMessage('bot', 'An error occurred. Please try again.');
        });
    }
}

function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    document.getElementById('chatbox-body').appendChild(messageElement);
    document.getElementById('chatbox-body').scrollTop = document.getElementById('chatbox-body').scrollHeight;
}

function appendTable(data, select) {
    console.log('Table Data:', data); // Debugging: Log the table data
    console.log('Select Column:', select); // Debugging: Log the select column

    if (!Array.isArray(data) || !Array.isArray(data[0])) {
        console.error('Invalid table data format');
        return;
    }

    const tableElement = document.createElement('table');
    tableElement.classList.add('response-table');

    // Append headers
    const headerRow = document.createElement('tr');
    data[0].forEach(header => {
        const headerCell = document.createElement('th');
        headerCell.textContent = header;
        headerRow.appendChild(headerCell);
    });
    tableElement.appendChild(headerRow);

    // Append data rows
    for (let i = 1; i < data.length; i++) {
        const rowElement = document.createElement('tr');
        for (let j = 0; j < data[i].length; j++) {
            const cellElement = document.createElement('td');
            cellElement.textContent = data[i][j];
            if (j === select) {
                cellElement.classList.add('clickable');
                cellElement.addEventListener('click', function() {
                    document.getElementById('user-input').value = data[i][j];
                    sendMessage();
                });
            }
            rowElement.appendChild(cellElement);
        }
        tableElement.appendChild(rowElement);
    }

    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'bot');
    messageElement.appendChild(tableElement);
    document.getElementById('chatbox-body').appendChild(messageElement);
    document.getElementById('chatbox-body').scrollTop = document.getElementById('chatbox-body').scrollHeight;
}