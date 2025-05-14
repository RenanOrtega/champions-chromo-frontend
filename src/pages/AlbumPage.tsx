// src/pages/AlbumPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Album as AlbumIcon, ArrowLeft } from 'lucide-react';
import { fetchAlbumsBySchoolId } from '../clients/album';
import { Album } from '../types/album';

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Álbuns disponíveis</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-muted flex items-center justify-center">
                <Skeleton className="h-24 w-24" />
              </div>
              <CardContent className="p-4 pt-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-4" />
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
          {albums.length === 0 ? (
            <div className="text-center py-10">
              <Alert>
                <AlertDescription>Nenhum álbum disponível para esta escola.</AlertDescription>
              </Alert>
              <Button
                variant="link"
                asChild
                className="mt-4"
              >
                <Link to="/schools">Voltar para lista de escolas</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => {
                const releaseYear = new Date(album.releaseDate).getFullYear();

                return (
                  <Card
                    key={album.id}
                    className="overflow-hidden"
                  >
                    <CardHeader className="h-48 bg-muted flex items-center justify-center">
                      <AlbumIcon className="h-16 w-16 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{album.name}</h3>
                      <div className='flex items-center gap-2 mt-2'>
                        <Badge variant="outline">
                          {album.totalStickers} figurinhas
                        </Badge>
                        <Badge variant="secondary" className="bg-secondary-300">
                          Ano: {releaseYear}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full bg-primary-400 hover:bg-primary-500" asChild>
                        <Link
                          to={`/albums/${album.id}/figurinhas`}
                        >
                          Selecionar
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
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