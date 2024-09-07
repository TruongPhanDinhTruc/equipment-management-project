import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/auth/login");
      return;
    }
  });

  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}

export default Home;
