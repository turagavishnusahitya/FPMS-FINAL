import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionForm from './SectionForm';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const facultyId = localStorage.getItem('userId');
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (!facultyId) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/faculty/proof/${facultyId}?year=${currentYear}`);
        const data = await res.json();
        if (res.ok && data) {
          setFormData(data);
          setSubmitted(true);
        }
      } catch (err) {
        console.error('Error fetching existing submission:', err);
      }
    };
    fetchData();
  }, [facultyId, currentYear]);

  const handleChange = (e) => {
    if (submitted) return;
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitted) return;
    
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/faculty/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faculty_id: facultyId, year: currentYear, ...formData }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitStatus('Submission successful!');
        setSubmitted(true);
        setShowConfirmModal(false);
      } else {
        setSubmitStatus(data.message || 'Submission failed.');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('Server error.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
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
              <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {facultyId}</p>
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
        {/* Status Banner */}
        {submitted && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-green-800 font-medium">Submission Complete</h3>
                <p className="text-green-700 text-sm">You have successfully submitted your proof for {currentYear}.</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); confirmSubmit(); }} className="space-y-8">
          <SectionForm 
            sectionCode="L1" 
            sectionTitle="Teaching & Learning" 
            fields={6} 
            formData={formData} 
            handleChange={handleChange}
            disabled={submitted}
          />
          <SectionForm 
            sectionCode="L2" 
            sectionTitle="Research & Consultancy" 
            fields={9} 
            formData={formData} 
            handleChange={handleChange}
            disabled={submitted}
          />
          <SectionForm 
            sectionCode="L3" 
            sectionTitle="Professional Development" 
            fields={9} 
            formData={formData} 
            handleChange={handleChange}
            disabled={submitted}
          />
          <SectionForm 
            sectionCode="L4" 
            sectionTitle="Contribution to Institute" 
            fields={6} 
            formData={formData} 
            handleChange={handleChange}
            disabled={submitted}
          />
          <SectionForm 
            sectionCode="L5" 
            sectionTitle="Student Development" 
            fields={5} 
            formData={formData} 
            handleChange={handleChange}
            disabled={submitted}
          />

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={submitted || loading}
              className={`px-8 py-3 font-medium rounded-lg text-white transition duration-200 ${
                submitted || loading
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : submitted ? (
                'Already Submitted'
              ) : (
                'Submit All Sections'
              )}
            </button>
          </div>

          {submitStatus && (
            <div className="text-center">
              <p className={`font-medium ${submitStatus.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                {submitStatus}
              </p>
            </div>
          )}
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Submission</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your performance data? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelSubmit}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
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

export default FacultyDashboard;