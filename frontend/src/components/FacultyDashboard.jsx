import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Add this
import SectionForm from './SectionForm';

const FacultyDashboard = () => {
  const navigate = useNavigate(); // ✅ for redirection after logout
  const facultyId = localStorage.getItem('userId');
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

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
      } else {
        setSubmitStatus(data.message || 'Submission failed.');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('Server error.');
    }
  };

  const handleLogout = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('userType');
  localStorage.removeItem('isAuthenticated');
  navigate('/');
};


  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Logout button aligned right */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Welcome, {facultyId}</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {submitted && (
        <p className="text-green-700 font-medium mb-4">
          You have already submitted your proof for {currentYear}.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionForm sectionCode="L1" sectionTitle="Teaching & Learning" fields={6} formData={formData} handleChange={handleChange} />
        <SectionForm sectionCode="L2" sectionTitle="Research & Consultancy" fields={9} formData={formData} handleChange={handleChange} />
        <SectionForm sectionCode="L3" sectionTitle="Professional Development" fields={9} formData={formData} handleChange={handleChange} />
        <SectionForm sectionCode="L4" sectionTitle="Contribution to Institute" fields={6} formData={formData} handleChange={handleChange} />
        <SectionForm sectionCode="L5" sectionTitle="Student Development" fields={5} formData={formData} handleChange={handleChange} />

        <button
          type="submit"
          disabled={submitted}
          className={`px-6 py-2 font-medium rounded text-white ${submitted ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {submitted ? 'Already Submitted' : 'Submit All Sections'}
        </button>
        {submitStatus && <p className="text-blue-600 mt-2">{submitStatus}</p>}
      </form>
    </div>
  );
};

export default FacultyDashboard;
