import React from 'react'

const EmptyRecords = () => {
  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">No Recommendations Available</h2>
        <p className="text-gray-600 mb-4">Check back later for personalized music recommendations based on your emotions.</p>
        <img src="/empty_recommendation.svg" alt="Empty Recommendations" className="w-64 h-64 mx-auto mb-4" />
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">Refresh</button>
      </div>
  )
}

export default EmptyRecords