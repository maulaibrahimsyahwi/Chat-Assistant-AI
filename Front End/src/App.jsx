import React from "react";
import ChatContainer from "./components/ChatContainer";
import "./index.css";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  return (
    <>
      <ChatContainer />;
      <SpeedInsights />
    </>
  );
}

export default App;
