import React from "react";
import Navbar from "../components/Navbar/Navbar"; // Import Navbar
import Footer from "../components/Footer/Footer";

const ChatPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "120px" }}>  {/* Adjust this value depending on Navbar height */}
      </div>
      <Footer />
    </div>
  );
};

export default ChatPage;
