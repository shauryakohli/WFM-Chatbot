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
    if (userInput.trim() !== '') {
        appendMessage('user', userInput);
        document.getElementById('user-input').value = '';
        // Simulate a response from the chatbot
        setTimeout(() => {
            const response = {
                type: 'table',
                data: [
                    ['Name', 'Age', 'City'],
                    ['John Doe', '30', 'New York'],
                    ['Jane Smith', '25', 'Los Angeles'],
                    ['Sam Johnson', '35', 'Chicago']
                ]
            };
            appendResponse(response);
        }, 1000);
    }
}

function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    document.getElementById('chatbox-body').appendChild(messageElement);
    document.getElementById('chatbox-body').scrollTop = document.getElementById('chatbox-body').scrollHeight;
}

function appendResponse(response) {
    if (response.type === 'table') {
        const tableElement = document.createElement('table');
        tableElement.classList.add('response-table');
        response.data.forEach(rowData => {
            const rowElement = document.createElement('tr');
            rowData.forEach(cellData => {
                const cellElement = document.createElement('td');
                cellElement.textContent = cellData;
                rowElement.appendChild(cellElement);
            });
            tableElement.appendChild(rowElement);
        });
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'bot');
        messageElement.appendChild(tableElement);
        document.getElementById('chatbox-body').appendChild(messageElement);
        document.getElementById('chatbox-body').scrollTop = document.getElementById('chatbox-body').scrollHeight;
    } else {
        appendMessage('bot', response.data);
    }
}