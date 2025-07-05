import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [proofData, setProofData] = useState({});
  const [scores, setScores] = useState({});
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const adminId = localStorage.getItem('adminId');
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/admin/faculty-submissions');
        const data = await res.json();
        setFacultyList(data);
      } catch (err) {
        console.error('Error fetching faculty:', err);
      }
    };
    fetchFaculty();
  }, []);

  const handleSelect = async (faculty_id) => {
    setSelectedFaculty(faculty_id);
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/admin/proofs/${faculty_id}?year=${currentYear}`);
      const data = await res.json();
      setProofData(data || {});
      setScores({});
      setStatusMsg('');
    } catch (err) {
      console.error('Error fetching proof:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (e) => {
    const { name, value } = e.target;
    setScores((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSubmitScore = async () => {
    setLoading(true);
    const payload = {
      faculty_id: selectedFaculty,
      year: currentYear,
      scored_by: adminId,
      ...scores,
    };

    try {
      const res = await fetch('http://localhost:3001/api/admin/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMsg('Score submitted successfully!');
        setShowConfirmModal(false);
      } else {
        setStatusMsg(data.message || 'Submission failed.');
      }
    } catch (err) {
      console.error('Submit score error:', err);
      setStatusMsg('Server error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminId');
    localStorage.removeItem('userType');
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const confirmSubmit = () => {
    setShowConfirmModal(true);
  };

  const cancelSubmit = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {adminId}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Faculty List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Faculty Submissions</h3>
                <p className="text-sm text-gray-600 mt-1">{facultyList.length} faculty members</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {facultyList.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No submissions found</p>
                  </div>
                ) : (
                  facultyList.map((f) => (
                    <div
                      key={f.faculty_id}
                      onClick={() => handleSelect(f.faculty_id)}
                      className={`px-6 py-4 cursor-pointer border-b border-gray-100 hover:bg-blue-50 transition duration-200 ${
                        selectedFaculty === f.faculty_id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{f.faculty_id}</span>
                        {selectedFaculty === f.faculty_id && (
                          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Faculty Details and Scoring */}
          <div className="lg:col-span-2">
            {selectedFaculty ? (
              <div className="space-y-6">
                {/* Faculty Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Scoring for: {selectedFaculty}
                  </h3>
                  <p className="text-gray-600">Academic Year: {currentYear}</p>
                </div>

                {loading ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600">Loading faculty data...</p>
                  </div>
                ) : (
                  <>
                    {/* Proof Links */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Submitted Proof Links</h4>
                      <div className="grid gap-3">
                        {Object.entries(proofData)
                          .filter(([key]) => key.startsWith('l'))
                          .map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium text-gray-700">{key.toUpperCase()}:</span>
                              <a 
                                href={value} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 hover:text-blue-800 underline flex items-center"
                              >
                                View Document
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Scoring Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-6">Performance Scoring</h4>
                      
                      <div className="space-y-6">
                        {/* A1 Section */}
                        <div>
                          <h5 className="font-medium text-gray-900 mb-3">A1: Teaching & Learning (6 criteria)</h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }, (_, i) => (
                              <input
                                key={`a1_${i + 1}`}
                                type="number"
                                name={`a1_${i + 1}`}
                                onChange={handleScoreChange}
                                placeholder={`A1.${i + 1} Score`}
                                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="0"
                                max="100"
                              />
                            ))}
                          </div>
                        </div>

                        {/* A2 Section */}
                        <div>
                          <h5 className="font-medium text-gray-900 mb-3">A2: Research & Consultancy (9 criteria)</h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Array.from({ length: 9 }, (_, i) => (
                              <input
                                key={`a2_${i + 1}`}
                                type="number"
                                name={`a2_${i + 1}`}
                                onChange={handleScoreChange}
                                placeholder={`A2.${i + 1} Score`}
                                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="0"
                                max="100"
                              />
                            ))}
                          </div>
                        </div>

                        {/* A3 Section */}
                        <div>
                          <h5 className="font-medium text-gray-900 mb-3">A3: Professional Development (9 criteria)</h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Array.from({ length: 9 }, (_, i) => (
                              <input
                                key={`a3_${i + 1}`}
                                type="number"
                                name={`a3_${i + 1}`}
                                onChange={handleScoreChange}
                                placeholder={`A3.${i + 1} Score`}
                                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="0"
                                max="100"
                              />
                            ))}
                          </div>
                        </div>

                        {/* A4 Section */}
                        <div>
                          <h5 className="font-medium text-gray-900 mb-3">A4: Contribution to Institute (6 criteria)</h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }, (_, i) => (
                              <input
                                key={`a4_${i + 1}`}
                                type="number"
                                name={`a4_${i + 1}`}
                                onChange={handleScoreChange}
                                placeholder={`A4.${i + 1} Score`}
                                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="0"
                                max="100"
                              />
                            ))}
                          </div>
                        </div>

                        {/* A5 Section */}
                        <div>
                          <h5 className="font-medium text-gray-900 mb-3">A5: Student Development (5 criteria)</h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Array.from({ length: 5 }, (_, i) => (
                              <input
                                key={`a5_${i + 1}`}
                                type="number"
                                name={`a5_${i + 1}`}
                                onChange={handleScoreChange}
                                placeholder={`A5.${i + 1} Score`}
                                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="0"
                                max="100"
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-center mt-8">
                        <button
                          onClick={confirmSubmit}
                          disabled={loading || Object.keys(scores).length === 0}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition duration-200 flex items-center"
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Submitting...
                            </>
                          ) : (
                            'Submit Scores'
                          )}
                        </button>
                      </div>

                      {statusMsg && (
                        <div className="mt-4 text-center">
                          <p className={`font-medium ${statusMsg.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                            {statusMsg}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Faculty Member</h3>
                <p className="text-gray-600">Choose a faculty member from the list to view their submissions and provide scores.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Score Submission</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit the scores for {selectedFaculty}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelSubmit}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitScore}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
              >
                {loading ? 'Submitting...' : 'Confirm Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;