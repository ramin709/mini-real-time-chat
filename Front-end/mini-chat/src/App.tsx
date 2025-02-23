import { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState({user: "", content: ""});
  const [response, setResponse] = useState<String | null>(null);

  const sendMessage = async () => {
    try {
      console.log(message)
      const res = await axios.post("http://backend:5000/messages/send", {content: message.content, user: message.user});
      console.log(res);
      setResponse(res.data);
    } catch (error) {
      setResponse("Error sending message.");
      console.error(error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Kafka Message Sender</h1>
      <input
        type="text"
        placeholder="Enter message..."
        onChange={(e) => setMessage({...message, content: e.target.value})}
        style={{ padding: "10px", width: "300px" }}
      />
      <input
        type="text"
        placeholder="Enter username..."
        onChange={(e) => setMessage({...message, user: e.target.value})}
        style={{ padding: "10px", width: "300px" }}
      />
      <button onClick={sendMessage} style={{ marginLeft: "10px", padding: "10px" }}>
        Send to Kafka
      </button>
      {response && (
        <div style={{ marginTop: "20px", fontSize: "18px" }}>
          <strong>Response:</strong> {JSON.stringify(response)}
        </div>
      )}
    </div>
  );
}

export default App;
