import React from "react";
import Navbar from "../components/Navbar/Navbar"; // Import Navbar

const ChatPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "120px" }}>  {/* Adjust this value depending on Navbar height */}
      </div>
    </div>
  );
};

export default ChatPage;
