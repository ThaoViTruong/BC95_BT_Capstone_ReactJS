import React from "react";
import Cinema from "../components/Cinema";

const CinemaPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <section className="max-w-7xl mx-auto px-4 py-16">
        <Cinema />
      </section>
    </div>
  );
};

export default CinemaPage;
