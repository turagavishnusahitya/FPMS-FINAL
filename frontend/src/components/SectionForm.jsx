import React from 'react';

const SectionForm = ({ sectionCode, sectionTitle, fields, formData, handleChange, disabled = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">{sectionCode}: {sectionTitle}</h3>
        <p className="text-sm text-gray-600 mt-1">
          Enter proof/document links for each sub-criterion below
        </p>
      </div>

      {/* Form Fields */}
      <div className="p-6">
        <div className="grid gap-6">
          {Array.from({ length: fields }).map((_, i) => {
            const name = `${sectionCode.toLowerCase()}_${i + 1}`;
            return (
              <div key={name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {sectionCode}.{i + 1} Proof Link
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="url"
                  name={name}
                  value={formData[name] || ''}
                  onChange={handleChange}
                  disabled={disabled}
                  className={`w-full px-4 py-3 border rounded-lg transition duration-200 ${
                    disabled 
                      ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400'
                  }`}
                  placeholder={`Enter URL for ${sectionCode}.${i + 1} (e.g., https://drive.google.com/...)`}
                />
                {formData[name] && (
                  <div className="flex items-center text-sm text-green-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Link provided
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Progress:</span>
            <span className="font-medium">
              {Object.keys(formData).filter(key => key.startsWith(sectionCode.toLowerCase()) && formData[key]).length} / {fields} completed
            </span>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(Object.keys(formData).filter(key => key.startsWith(sectionCode.toLowerCase()) && formData[key]).length / fields) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionForm;