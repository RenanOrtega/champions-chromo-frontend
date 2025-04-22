// src/pages/SchoolsPage.tsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Album, School, Search } from 'lucide-react'

// Tipo para a school
interface School {
  id: number;
  nome: string;
  cidade: string;
  estado: string;
  imagem: string;
}

// Dados mockados para schools
const schoolsMock: School[] = [
  { id: 1, nome: 'Colégio Santa Maria', cidade: 'São Paulo', estado: 'SP', imagem: '/school1.jpg' },
  { id: 2, nome: 'School Municipal João Paulo', cidade: 'Rio de Janeiro', estado: 'RJ', imagem: '/school2.jpg' },
  { id: 3, nome: 'Instituto Educacional Palmeiras', cidade: 'Belo Horizonte', estado: 'MG', imagem: '/school3.jpg' },
  { id: 4, nome: 'Colégio Santo Agostinho', cidade: 'Salvador', estado: 'BA', imagem: '/school4.jpg' },
  { id: 5, nome: 'School Estadual Prof. Carlos Silva', cidade: 'Porto Alegre', estado: 'RS', imagem: '/school5.jpg' },
  { id: 6, nome: 'Centro Educacional Mundo Novo', cidade: 'Brasília', estado: 'DF', imagem: '/school6.jpg' },
]

const SchoolsPage = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando uma chamada API
    setTimeout(() => {
      setSchools(schoolsMock);
      setLoading(false);
    }, 500);
  }, []);

  const schoolsFiltradas = schools.filter(school =>
    school.nome.toLowerCase().includes(search.toLowerCase()) ||
    school.cidade.toLowerCase().includes(search.toLowerCase()) ||
    school.estado.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Selecione a School</h1>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          placeholder="Buscar por nome ou localização..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {schoolsFiltradas.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Nenhuma escola encontrada com os critérios de busca.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {schoolsFiltradas.map((school) => (
                <Link
                  key={school.id}
                  to={`/schools/${school.id}/albuns`}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-40 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <School color='gray' className="h-10 w-10" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{school.nome}</h3>
                    <p className="text-gray-600 text-sm">{school.cidade}, {school.estado}</p>
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