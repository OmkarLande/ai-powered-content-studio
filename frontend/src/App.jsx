import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import NotionAuth from "./components/NotionAuth";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 class="text-3xl font-bold underline text-red-500">Hello world!</h1>
      <NotionAuth />
    </>
  );
}

export default App;
