// src/pages/AlbumPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Album, ArrowLeft } from 'lucide-react';

// Tipo para os álbuns
interface Album {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  schoolYear: string;
}

// Dados mockados para álbuns
const albunsMock: Record<number, Album[]> = {
  1: [
    { id: 101, name: "Álbum 2025 - Colégio Santa Maria", description: "Álbum completo com todas as turmas", price: 49.90, image: "/album1.jpg", schoolYear: "2025" },
    { id: 102, name: "Álbum 2025 - Turmas do Ensino Fundamental", description: "Álbum com turmas do 1º ao 5º ano", price: 39.90, image: "/album2.jpg", schoolYear: "2025" },
    { id: 103, name: "Álbum 2025 - Turmas do Ensino Médio", description: "Álbum com turmas do 1º ao 3º ano do EM", price: 39.90, image: "/album3.jpg", schoolYear: "2025" },
  ],
  2: [
    { id: 201, name: "Álbum 2025 - School Municipal João Paulo", description: "Álbum completo com todas as turmas", price: 45.90, image: "/album4.jpg", schoolYear: "2025" },
    { id: 202, name: "Álbum 2025 - Anos Iniciais", description: "Álbum com turmas do 1º ao 5º ano", price: 35.90, image: "/album5.jpg", schoolYear: "2025" },
  ],
  // Outros álbuns para outras schools
};

const AlbumPage = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const [albuns, setAlbuns] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [schoolname, setSchoolname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (schoolId) {
      // Simulando chamada API para obter álbuns da school
      setTimeout(() => {
        const id = parseInt(schoolId);
        setAlbuns(albunsMock[id] || []);

        // Definir name da school
        const schoolsnames: Record<number, string> = {
          1: 'Colégio Santa Maria',
          2: 'School Municipal João Paulo',
          3: 'Instituto Educacional Palmeiras',
          4: 'Colégio Santo Agostinho',
          5: 'School Estadual Prof. Carlos Silva',
          6: 'Centro Educacional Mundo Novo',
        };

        setSchoolname(schoolsnames[id] || 'School');
        setLoading(false);
      }, 500);
    }
  }, [schoolId]);

  return (
    <div className="space-y-6 mt-14">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="md:text-2xl font-bold">Álbuns disponíveis para {schoolname}</h1>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {albuns.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Nenhum álbum disponível para esta school.</p>
              <Link to="/schools" className="mt-4 inline-block text-primary-600 hover:underline">
                Voltar para lista de schools
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albuns.map((album) => (
                <div
                  key={album.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <Album color='gray' className="h-10 w-10" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{album.name}</h3>
                    <p className="text-gray-600 mt-1">{album.description}</p>
                    <p className="text-sm text-gray-500">Ano Letivo: {album.schoolYear}</p>
                    <Link
                      to={`/albuns/${album.id}/figurinhas`}
                      className="mt-4 block w-full py-2 px-4 bg-primary-600 text-white text-center rounded-md hover:bg-primary-700 transition-colors"
                    >
                      Selecionar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AlbumPage;