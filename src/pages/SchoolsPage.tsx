// src/pages/SchoolsPage.tsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { School as SchoolIcon, Search } from 'lucide-react'
import { fetchSchools } from '../clients/school';
import { School } from '../types/school';

const SchoolsPage = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSchools = async () => {
      try {
        const data = await fetchSchools();
        setSchools(data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar escolas:', err);
        setError('Não foi possível carregar a lista de escolas. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    loadSchools();
  }, []);

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(search.toLowerCase()) ||
    school.city.toLowerCase().includes(search.toLowerCase()) ||
    school.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Selecione a Escola</h1>
      </div>

      <div className="mb-6 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome, cidade ou estado..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <>
          {filteredSchools.length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              Nenhuma escola encontrada com os critérios de busca.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchools.map((school) => (
                <Link
                  to={`/schools/${school.id}/albums`}
                  key={school.id}
                  className="block bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-shadow duration-300"
                >
                  <div className="h-40 bg-gray-200 flex items-center justify-center">
                    <SchoolIcon size={64} className="text-gray-400" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{school.name}</h3>
                    <p className="text-gray-600">{school.city}, {school.state}</p>
                    <p className="text-gray-500 text-sm mt-2">{school.phone}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SchoolsPage;