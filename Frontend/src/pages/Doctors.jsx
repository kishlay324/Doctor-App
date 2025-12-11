import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Doctors = () => {
  const navigate = useNavigate();
  const { speciality } = useParams();

  const [showFilter, setShowFilter] = useState(false);
  const { doctors } = useContext(AppContext);

  const [filterdoc, setFilterdoc] = useState([]);

  const applyFilter = () => {
    if (speciality) {
      // Decode URL-encoded speciality (for HashRouter compatibility)
      const decodedSpeciality = decodeURIComponent(speciality).trim();
      console.log('🔍 Filtering by speciality:', decodedSpeciality);
      console.log('📋 Available doctors:', doctors.map(d => d.speciality));
      
      const filtered = doctors.filter(doc => {
        const docSpeciality = (doc.speciality || '').trim();
        const docSpecialityLower = docSpeciality.toLowerCase();
        const filterSpecialityLower = decodedSpeciality.toLowerCase();
        
        // Exact match (case-insensitive)
        let match = docSpecialityLower === filterSpecialityLower;
        
        // Handle singular/plural variations (Pediatrician vs Pediatricians)
        if (!match) {
          // Check if one is singular and other is plural
          const docSingular = docSpecialityLower.replace(/s$/, '');
          const filterSingular = filterSpecialityLower.replace(/s$/, '');
          
          // Match if base words are the same (pediatrician = pediatricians)
          if (docSingular === filterSingular && docSingular.length > 0) {
            match = true;
          }
          
          // Also check if one ends with 's' and other doesn't, but base is same
          if (!match) {
            const docWithS = docSpecialityLower + 's';
            const docWithoutS = docSpecialityLower.replace(/s$/, '');
            match = docWithS === filterSpecialityLower || docWithoutS === filterSpecialityLower;
          }
        }
        
        // Handle "General physician" variations
        if (!match && (filterSpecialityLower.includes('physician') || filterSpecialityLower.includes('general'))) {
          const hasPhysician = docSpecialityLower.includes('physician');
          const hasGeneral = docSpecialityLower.includes('general');
          match = hasPhysician || hasGeneral;
        }
        
        if (match) {
          console.log(`✅ Match found: ${doc.name} - "${doc.speciality}" (matched with filter: "${decodedSpeciality}")`);
        }
        return match;
      });
      
      console.log(`📊 Filter result: ${filtered.length} doctors found for "${decodedSpeciality}"`);
      if (filtered.length === 0) {
        console.warn('⚠️ No doctors found. Available specialities:', [...new Set(doctors.map(d => d.speciality))]);
      }
      console.log("Filtered Doctors:", filtered);
      setFilterdoc(filtered);
    } else {
      setFilterdoc(doctors);
    }
  };
  

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div className="text-gray-600">
      <p>Browse Through the doctors Specialist.</p>
      
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button 
          onClick={() => setShowFilter(prev => !prev)} 
          className={`py-1.5 px-3 border border-gray-300 rounded sm:hidden transition-all cursor-pointer ${showFilter ? 'bg-indigo-100 text-black' : ''}`}
        >
          Filters
        </button>

        <div className={`flex flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer py-1.5 ${speciality === 'General physician' ? 'bg-indigo-100 text-black' : ''}`}>General physician</p>
          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer py-1.5 ${speciality === 'Gynecologist' ? 'bg-indigo-100 text-black' : ''}`}>Gynecologist</p>
          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer py-1.5 ${speciality === 'Dermatologist' ? 'bg-indigo-100 text-black' : ''}`}>Dermatologist</p>
          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer py-1.5 ${speciality === 'Pediatricians' ? 'bg-indigo-100 text-black' : ''}`}>Pediatricians</p>
          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer py-1.5 ${speciality === 'Neurologist' ? 'bg-indigo-100 text-black' : ''}`}>Neurologist</p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer py-1.5 ${speciality === 'Gastroenterologist' ? 'bg-indigo-100 text-black' : ''}`}>Gastroenterologist</p>
        </div>

        <div className="w-full">
          {filterdoc.length === 0 && speciality ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No doctors found for "{speciality}"</p>
              <p className="text-gray-400 text-sm mt-2">Try selecting a different speciality or view all doctors</p>
              <button 
                onClick={() => navigate('/doctors')}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                View All Doctors
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-auto gap-4 gap-y-6 px-3">
              {filterdoc.map((item, index) => (
                <div
                  onClick={() => navigate(`/appointment/${item._id}`)}
                  className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
                  key={index}
                >
                  <img className="bg-blue-50" src={item.image} alt={item.name} />
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-center text-green-500">
                      <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                      <p>Available</p>
                    </div>
                    <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                    <p className="text-gray-600 text-sm">{item.speciality}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
