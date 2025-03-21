import React from "react";

REDIRECT_URI = "http://localhost:5000/notion/callback"


const NotionAuth = () => {
 const connectNotion = () => {
  const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${NOTION_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  window.location.href = notionAuthUrl;
};


  return (
    <button onClick={connectNotion}>
      Connect with Notion
    </button>
  );
};

export default NotionAuth;
