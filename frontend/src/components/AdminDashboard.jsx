
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import this

const AdminDashboard = () => {
  const navigate = useNavigate(); // ✅ for redirection
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [proofData, setProofData] = useState({});
  const [scores, setScores] = useState({});
  const [statusMsg, setStatusMsg] = useState('');

  const adminId = localStorage.getItem('adminId');
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchFaculty = async () => {
      const res = await fetch('http://localhost:3001/api/admin/faculty-submissions');
      const data = await res.json();
      setFacultyList(data);
    };
    fetchFaculty();
  }, []);

  const handleSelect = async (faculty_id) => {
    setSelectedFaculty(faculty_id);
    const res = await fetch(`http://localhost:3001/api/admin/proofs/${faculty_id}?year=${currentYear}`);
    const data = await res.json();
    setProofData(data || {});
    setScores({});
  };

  const handleScoreChange = (e) => {
    const { name, value } = e.target;
    setScores((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSubmitScore = async () => {
    const payload = {
      faculty_id: selectedFaculty,
      year: currentYear,
      scored_by: adminId,
      ...scores,
    };

    const res = await fetch('http://localhost:3001/api/admin/submit-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      setStatusMsg('Score submitted successfully!');
    } else {
      setStatusMsg(data.message || 'Submission failed.');
    }
  };

  const handleLogout = () => {
  localStorage.removeItem('adminId');
  localStorage.removeItem('userType');
  localStorage.removeItem('isAuthenticated');
  navigate('/');
};

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with Logout Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Welcome Admin: {adminId}</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-8">
        {/* Faculty List */}
        <div className="w-1/3">
          <h3 className="text-lg font-semibold mb-2">Faculty Submissions</h3>
          <ul className="border rounded p-3 max-h-[600px] overflow-y-auto bg-gray-50">
            {facultyList.map((f) => (
              <li
                key={f.faculty_id}
                onClick={() => handleSelect(f.faculty_id)}
                className="cursor-pointer px-2 py-1 hover:bg-blue-100 border-b"
              >
                {f.faculty_id}
              </li>
            ))}
          </ul>
        </div>

        {/* Faculty Details and Scoring */}
        <div className="w-2/3">
          {selectedFaculty && (
            <>
              <h3 className="text-xl font-semibold mb-4">
                Scoring for: {selectedFaculty}
              </h3>

              <div className="bg-white p-4 mb-4 rounded shadow">
                <h4 className="text-md font-semibold mb-2">Proof Links</h4>
                <ul className="text-sm space-y-1">
                  {Object.entries(proofData)
                    .filter(([key]) => key.startsWith('l'))
                    .map(([key, value]) => (
                      <li key={key}>
                        <strong>{key.toUpperCase()}:</strong>{' '}
                        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                          {value}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {Array.from({ length: 6 }, (_, i) => (
                  <input
                    key={`a1_${i + 1}`}
                    type="number"
                    name={`a1_${i + 1}`}
                    onChange={handleScoreChange}
                    placeholder={`Score A1.${i + 1}`}
                    className="border p-2 rounded"
                  />
                ))}
                {Array.from({ length: 9 }, (_, i) => (
                  <input
                    key={`a2_${i + 1}`}
                    type="number"
                    name={`a2_${i + 1}`}
                    onChange={handleScoreChange}
                    placeholder={`Score A2.${i + 1}`}
                    className="border p-2 rounded"
                  />
                ))}
                {Array.from({ length: 9 }, (_, i) => (
                  <input
                    key={`a3_${i + 1}`}
                    type="number"
                    name={`a3_${i + 1}`}
                    onChange={handleScoreChange}
                    placeholder={`Score A3.${i + 1}`}
                    className="border p-2 rounded"
                  />
                ))}
                {Array.from({ length: 6 }, (_, i) => (
                  <input
                    key={`a4_${i + 1}`}
                    type="number"
                    name={`a4_${i + 1}`}
                    onChange={handleScoreChange}
                    placeholder={`Score A4.${i + 1}`}
                    className="border p-2 rounded"
                  />
                ))}
                {Array.from({ length: 5 }, (_, i) => (
                  <input
                    key={`a5_${i + 1}`}
                    type="number"
                    name={`a5_${i + 1}`}
                    onChange={handleScoreChange}
                    placeholder={`Score A5.${i + 1}`}
                    className="border p-2 rounded"
                  />
                ))}
              </div>

              <button
                onClick={handleSubmitScore}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Submit Score
              </button>
              {statusMsg && <p className="mt-2 text-blue-600 font-medium">{statusMsg}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
