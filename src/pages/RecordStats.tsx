// pages/RecordStats.tsx
import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const RecordStats: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          
          {/* Main content */}
          <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-green-500">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-400">
                <span className="text-2xl">📊</span>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Game Stats Input Form</h1>
              
              <p className="text-gray-300 mb-8">
                This page will allow you to input statistics for a game you participated in.
                The form will be added here in a future update.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Placeholder cards */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-300 mb-2">Select Sport</h3>
                  <p className="text-gray-400 text-sm">Basketball, Soccer, Baseball, etc.</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-300 mb-2">Game Details</h3>
                  <p className="text-gray-400 text-sm">Date, opponent, location</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-300 mb-2">Statistics</h3>
                  <p className="text-gray-400 text-sm">Points, rebounds, goals, etc.</p>
                </div>
              </div>
              
              {/* Temporary action buttons */}
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => alert("Form submission will be implemented soon!")}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Submit Stats (Demo)
                </button>
                <button
                  onClick={() => navigate("/stats")}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  View Current Stats
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordStats;