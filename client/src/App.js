import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);

  const sendMessage = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/data', {
        message,
      });
      setResponse(res.data);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>React + Node.js TEST</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter a message"
      />
      <button onClick={sendMessage}>Send to Server</button>
      {response && <p>Server Response: {JSON.stringify(response)}</p>}
    </div>
  );
}

export default App;