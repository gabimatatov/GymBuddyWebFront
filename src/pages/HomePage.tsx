import React from "react";
import Navbar from "../components/Navbar/Navbar"; // Import Navbar

const HomePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "120px" }}>  {/* Adjust this value depending on Navbar height */}
      </div>
    </div>
  );
};

export default HomePage;
