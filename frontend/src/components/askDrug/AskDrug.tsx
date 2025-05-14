import { useState } from 'react';
import { Search, X, ChevronDown, ChevronUp, AlertCircle, Pill, Info, AlertOctagon, Clock } from 'lucide-react';

const MedicationSearch = () => {
  const [brandName, setBrandName] = useState('');
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    indications: false,
    warnings: false,
    dosage: false,
    ingredients: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const searchMedication = async () => {
    if (!brandName.trim()) return;
    
    setLoading(true);
    setError(null);
    setMedication(null);
    
    try {
      const response = await fetch(`http://localhost:3000/document/medicine?brand_name=${encodeURIComponent(brandName)}`);
      
      if (!response.ok) {
        throw new Error(response.status === 404 
          ? 'No medication found with this brand name' 
          : 'Failed to fetch medication data');
      }
      
      const data = await response.json();
      setMedication(data.results[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setMedication(null);
    setBrandName('');
    setError(null);
  };

  const sectionIcons = {
    indications: <Info size={20} className="text-blue-500" />,
    warnings: <AlertOctagon size={20} className="text-amber-500" />,
    dosage: <Clock size={20} className="text-green-500" />,
    ingredients: <Pill size={20} className="text-purple-500" />
  };

  const sectionTitles = {
    indications: "Uses & Indications",
    warnings: "Warnings & Precautions",
    dosage: "Dosage & Administration",
    ingredients: "Active Ingredients"
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center mb-8">
          <Pill className="text-blue-600 mr-3" size={28} />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">MediSearch</h1>
        </div>
        
        <div className="flex items-center mb-8 relative">
          <div className="relative flex-grow">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              className="w-full p-4 pl-12 pr-12 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md text-lg"
              placeholder="Search medication by brand name..."
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && searchMedication()}
            />
            {brandName && (
              <button 
                onClick={clearResults}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <button
            onClick={searchMedication}
            disabled={loading || !brandName.trim()}
            className="ml-4 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full hover:from-blue-600 hover:to-blue-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-lg font-medium flex items-center"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && (
          <div className="p-4 mb-8 bg-red-50 border-l-4 border-red-500 rounded-lg animate-fade-in transition-all duration-300 ease-in-out">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-3 flex-shrink-0" size={24} />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {medication && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md transition-all animate-fade-in duration-300 ease-in-out">
            <div className="mb-6 border-b border-gray-100 pb-4">
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">
                Medication Details
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {medication.openfda?.brand_name?.[0] || 'Unknown Brand'}
              </h2>
              <p className="text-gray-600 text-lg">
                {medication.openfda?.generic_name?.[0] || 'Generic name not available'}
              </p>
            </div>

            {/* Information Sections */}
            <div className="space-y-4">
              {Object.keys(expandedSections).map(section => (
                <div 
                  key={section}
                  className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${expandedSections[section] ? 'shadow-md' : 'shadow-sm hover:shadow-md'}`}
                >
                  <button 
                    onClick={() => toggleSection(section)}
                    className={`w-full px-5 py-4 flex justify-between items-center transition-colors ${expandedSections[section] ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}
                    aria-expanded={expandedSections[section]}
                    aria-controls={`content-${section}`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{sectionIcons[section]}</span>
                      <span className="font-semibold text-gray-800">{sectionTitles[section]}</span>
                    </div>
                    <div className={`transition-transform duration-300 ${expandedSections[section] ? 'rotate-180' : ''}`}>
                      <ChevronDown size={20} />
                    </div>
                  </button>
                  
                  {expandedSections[section] && (
                    <div 
                      id={`content-${section}`}
                      className="px-5 py-4 border-t border-gray-200 bg-white"
                    >
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {medication[section === 'indications' ? 'indications_and_usage' : section === 'warnings' ? 'warnings' : section === 'dosage' ? 'dosage_and_administration' : 'active_ingredient']?.[0] || 'No information available'}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="text-center mt-8 text-gray-500 text-sm">
        Data provided by OpenFDA. Always consult with a healthcare professional before taking any medication.
      </div>
    </div>
  );
};

export default MedicationSearch;