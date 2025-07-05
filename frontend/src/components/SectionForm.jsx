import React from 'react';

const SectionForm = ({ sectionCode, sectionTitle, fields, formData, handleChange }) => {
  return (
    <div className="bg-white p-4 shadow rounded mb-6">
      <h3 className="text-lg font-semibold mb-2">{sectionCode}: {sectionTitle}</h3>
      <p className="text-sm text-gray-600 mb-2">Enter proof/document links for each sub-criterion.</p>
      {Array.from({ length: fields }).map((_, i) => {
        const name = `${sectionCode.toLowerCase()}_${i + 1}`;
        return (
          <div key={name} className="mb-3">
            <label className="block mb-1">{sectionCode}.{i + 1} Proof Link</label>
            <input
              type="text"
              name={name}
              value={formData[name] || ''}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder={`Enter URL for ${sectionCode}.${i + 1}`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SectionForm;
