import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Album as AlbumIcon, ChevronRight, WifiOff } from 'lucide-react';
import { fetchAlbumsBySchoolId } from '../clients/album';
import { Album, albumHasType, stickerTypes } from '../types/album';
import { School } from '../types/school';

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSchoolBanner } from '@/context/BannerContext';
import { fetchSchoolById } from '@/clients/school';
import Page from '@/components/Page';
import StateMessage from '@/components/StateMessage';
import TypeBadge from '@/components/TypeBadge';

const gridClass = "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4";

const AlbumPage = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const { setSchoolBanner } = useSchoolBanner();

  useEffect(() => {
    const getAlbums = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!schoolId) {
          throw new Error('School ID is required');
        }

        const schoolData = await fetchSchoolById(schoolId);
        setSchool(schoolData);
        setSchoolBanner(schoolData);

        const albums = await fetchAlbumsBySchoolId(schoolId);
        setAlbums(albums);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar álbuns:', err);
        setError('Não foi possível carregar os álbuns.');
        setLoading(false);
      }
    };

    if (schoolId) {
      getAlbums();
    }
  }, [schoolId, attempt, setSchoolBanner]);

  const handleImageError = (albumId: string) => {
    setImageErrors(prev => new Set([...prev, albumId]));
  };

  return (
    <Page
      showBack
      title="Álbuns disponíveis"
      subtitle={school ? `${school.name} · ${school.city}, ${school.state}` : undefined}
    >
      {loading ? (
        <div className={gridClass} aria-busy="true" aria-label="Carregando álbuns">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <Skeleton className="aspect-square rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <StateMessage icon={WifiOff} tone="error" title={error} description="Confira sua conexão e tente de novo.">
          <Button onClick={() => setAttempt(a => a + 1)}>Tentar de novo</Button>
        </StateMessage>
      ) : albums.length === 0 ? (
        <StateMessage
          icon={AlbumIcon}
          title="Esta escola ainda não tem álbuns"
          description="Volte em breve ou escolha outra escola."
        >
          <Button variant="outline" asChild>
            <Link to="/schools">Ver outras escolas</Link>
          </Button>
        </StateMessage>
      ) : (
        <ul className={gridClass}>
          {albums.map((album) => {
            const hasImageError = imageErrors.has(album.id);

            return (
              <li key={album.id}>
                <Link
                  to={`/albums/${album.id}/figurinhas`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-colors hover:border-primary-500"
                >
                  <div className="flex aspect-square items-center justify-center bg-slate-100">
                    {album.coverImage && !hasImageError ? (
                      <img
                        src={album.coverImage}
                        alt=""
                        className="size-full object-cover"
                        onError={() => handleImageError(album.id)}
                        loading="lazy"
                      />
                    ) : (
                      <AlbumIcon className="size-12 text-slate-400" strokeWidth={1.5} />
                    )}
                  </div>

                  <div className="flex grow flex-col p-4">
                    <h2 className="font-semibold leading-snug text-slate-900 line-clamp-2">
                      {album.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 tabular-nums">
                      {album.totalStickers} figurinhas
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {stickerTypes.filter(type => albumHasType(album, type)).map(type => (
                        <TypeBadge key={type} type={type} />
                      ))}
                    </div>
                    <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-primary-700">
                      Escolher figurinhas
                      <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Page>
  );
};

export default AlbumPage;
