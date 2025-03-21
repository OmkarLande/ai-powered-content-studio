import { useState } from "react";
import axios from "axios";

const NotionSender = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const sendToNotion = async () => {
    await axios.post("http://localhost:5000/send/notion", { title, content });
    alert("Content sent to Notion!");
  };

  return (
    <div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
      <button onClick={sendToNotion}>Send to Notion</button>
    </div>
  );
};

export default NotionSender;
