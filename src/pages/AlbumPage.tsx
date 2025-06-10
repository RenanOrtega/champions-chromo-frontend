import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Album as AlbumIcon, ArrowLeft, Star, Hash } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
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

  const handleImageError = (albumId: string) => {
    setImageErrors(prev => new Set([...prev, albumId]));
  };

  const getStickerTypesBadges = (album: Album) => {
    const badges = [];
    
    if (album.hasCommon) {
      badges.push(
        <Badge key="common" variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Comuns
        </Badge>
      );
    }
    
    if (album.hasLegend) {
      badges.push(
        <Badge key="legend" variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Star className="w-3 h-3 mr-1" />
          Legends
        </Badge>
      );
    }
    
    if (album.hasA4) {
      badges.push(
        <Badge key="a4" variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          A4
        </Badge>
      );
    }

    return badges;
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                <Skeleton className="h-24 w-24 rounded-lg" />
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <div className="flex gap-2 mb-3">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <div className="flex gap-1 mb-4">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {albums.map((album) => {
                const hasImageError = imageErrors.has(album.id);

                return (
                  <Card
                    key={album.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
                  >
                    <CardHeader className="aspect-[2/2] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-0 relative overflow-hidden">
                      {album.coverImage && !hasImageError ? (
                        <>
                          <img
                            src={album.coverImage}
                            alt={album.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={() => handleImageError(album.id)}
                            loading="lazy"
                          />
                          {/* Overlay gradient for better text readability if needed */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200 w-full h-full">
                          <AlbumIcon className="h-16 w-16 mb-2" />
                          <span className="text-xs text-center px-2">Sem imagem de capa</span>
                        </div>
                      )} 
                    </CardHeader>
                    
                    <CardContent>
                      <div>
                        <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                          {album.name}
                        </h3>
                      </div>
                      
                      {/* Total de figurinhas com ícone */}
                      <div className="flex items-center gap-2 pt-1 pb-1">
                        <Hash className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {album.totalStickers} figurinhas
                        </span>
                      </div>
                      
                      {/* Tipos de figurinhas */}
                      <div className="flex flex-wrap gap-1">
                        {getStickerTypesBadges(album)}
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm" 
                        asChild
                      >
                        <Link to={`/albums/${album.id}/figurinhas`}>
                          Selecionar Álbum
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