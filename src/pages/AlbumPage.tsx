// src/pages/AlbumPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Album as AlbumIcon, ArrowLeft } from 'lucide-react';
import { Album } from '../types';
import { fetchAlbumsBySchoolId } from '../clients/album';

const AlbumPage = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [schoolName, setSchoolName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getAlbums = async () => {
      try {
        setLoading(true);

        if (!schoolId) {
          throw new Error('School ID is required');
        }

        const albums = await fetchAlbumsBySchoolId(schoolId);
        setAlbums(albums);
        setSchoolName('COLOCAR NOME DA ESCOLA');
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar álbuns:', err);
        setError('Falha ao carregar os álbuns. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };

    if (schoolId) {
      getAlbums();
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
        <h1 className="md:text-2xl font-bold">Álbuns disponíveis para {schoolName}</h1>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <Link to="/schools" className="mt-4 inline-block text-primary-600 hover:underline">
            Voltar para lista de escolas
          </Link>
        </div>
      ) : (
        <>
          {albums.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Nenhum álbum disponível para esta escola.</p>
              <Link to="/schools" className="mt-4 inline-block text-primary-600 hover:underline">
                Voltar para lista de escolas
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => {
                // Calcular o ano do álbum a partir da data de lançamento
                const releaseYear = new Date(album.releaseDate).getFullYear();

                return (
                  <div
                    key={album.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="h-48 bg-gray-200 flex items-center justify-center">                      
                      <AlbumIcon color='gray' className="h-10 w-10" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{album.name}</h3>
                      <p className="text-gray-600 mt-1">
                        Total de figurinhas: {album.totalStickers}
                      </p>
                      <p className="text-sm text-gray-500">Ano: {releaseYear}</p>
                      <p className="text-primary-600 font-semibold mt-2">
                        R$ {album.price.toFixed(2)}
                      </p>
                      <Link
                        to={`/albums/${album.id}/figurinhas`}
                        className="mt-4 block w-full py-2 px-4 bg-primary-600 text-white text-center rounded-md hover:bg-primary-700 transition-colors"
                      >
                        Selecionar
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AlbumPage;