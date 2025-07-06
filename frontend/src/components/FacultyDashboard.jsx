import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionForm from './SectionForm';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const facultyId = localStorage.getItem('userId');
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'submit', 'save', 'delete'

  useEffect(() => {
    if (!facultyId) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/faculty/proof/${facultyId}?year=${currentYear}`);
        const data = await res.json();
        if (res.ok && data) {
          setFormData(data);
          setSubmitted(!data.is_draft);
          setIsDraft(data.is_draft || false);
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

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/faculty/save-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faculty_id: facultyId, year: currentYear, ...formData }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitStatus('Draft saved successfully!');
        setIsDraft(true);
        setShowConfirmModal(false);
      } else {
        setSubmitStatus(data.message || 'Save failed.');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('Server error.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/faculty/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faculty_id: facultyId, year: currentYear, ...formData }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitStatus('Submission successful!');
        setSubmitted(true);
        setIsDraft(false);
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

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/faculty/submission/${facultyId}?year=${currentYear}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitStatus('Submission deleted successfully!');
        setFormData({});
        setSubmitted(false);
        setIsDraft(false);
        setShowDeleteModal(false);
      } else {
        setSubmitStatus(data.message || 'Delete failed.');
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

  const confirmAction = (type) => {
    setActionType(type);
    if (type === 'delete') {
      setShowDeleteModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  const executeAction = () => {
    if (actionType === 'submit') {
      handleSubmit();
    } else if (actionType === 'save') {
      handleSaveDraft();
    }
  };

  const cancelAction = () => {
    setShowConfirmModal(false);
    setShowDeleteModal(false);
    setActionType('');
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

        {isDraft && !submitted && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-yellow-800 font-medium">Draft Saved</h3>
                <p className="text-yellow-700 text-sm">Your work has been saved as a draft. Remember to submit when ready.</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
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

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-6">
            {!submitted && (
              <>
                <button
                  type="button"
                  onClick={() => confirmAction('save')}
                  disabled={loading}
                  className="px-6 py-3 font-medium rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-200 disabled:opacity-50"
                >
                  {loading && actionType === 'save' ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  type="button"
                  onClick={() => confirmAction('submit')}
                  disabled={loading}
                  className="px-8 py-3 font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition duration-200 disabled:opacity-50"
                >
                  {loading && actionType === 'submit' ? 'Submitting...' : 'Submit Final'}
                </button>
              </>
            )}
            
            {(submitted || isDraft) && (
              <button
                type="button"
                onClick={() => confirmAction('delete')}
                disabled={loading}
                className="px-6 py-3 font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition duration-200 disabled:opacity-50"
              >
                {loading && actionType === 'delete' ? 'Deleting...' : 'Delete Submission'}
              </button>
            )}
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {actionType === 'submit' ? 'Confirm Final Submission' : 'Confirm Save Draft'}
            </h3>
            <p className="text-gray-600 mb-6">
              {actionType === 'submit' 
                ? 'Are you sure you want to submit your performance data? This action cannot be undone.'
                : 'Are you sure you want to save your current progress as a draft?'
              }
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelAction}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-medium transition duration-200 text-white ${
                  actionType === 'submit' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {loading ? 'Processing...' : (actionType === 'submit' ? 'Confirm Submit' : 'Confirm Save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-red-900 mb-4">Confirm Delete Submission</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your submission? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelAction}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
              >
                {loading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;