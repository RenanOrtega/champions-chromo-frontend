import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { School as SchoolIcon, Search, SearchX, WifiOff } from 'lucide-react'
import { fetchSchools } from '../clients/school';
import { School } from '../types/school';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Page from '@/components/Page';
import StateMessage from '@/components/StateMessage';
import { formatPhone } from '@/lib/format';

const gridClass = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

const SchoolsPage = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const loadSchools = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSchools();
        setSchools(data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar escolas:', err);
        setError('Não foi possível carregar a lista de escolas.');
        setLoading(false);
      }
    };

    loadSchools();
  }, [attempt]);

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(search.toLowerCase()) ||
    school.city.toLowerCase().includes(search.toLowerCase()) ||
    school.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Page title="Escolha a escola" subtitle="Os álbuns disponíveis mudam de escola para escola.">
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
        <Input
          type="search"
          aria-label="Buscar escola"
          placeholder="Buscar por nome, cidade ou estado"
          className="h-11 bg-white pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className={gridClass} aria-busy="true" aria-label="Carregando escolas">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4">
              <Skeleton className="size-16 shrink-0" />
              <div className="flex-1 space-y-2">
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
      ) : schools.length === 0 ? (
        <StateMessage
          icon={SchoolIcon}
          title="Nenhuma escola disponível no momento"
          description="Assim que uma escola abrir pedidos, ela aparece aqui."
        />
      ) : filteredSchools.length === 0 ? (
        <StateMessage
          icon={SearchX}
          title={`Nenhuma escola encontrada para "${search}"`}
          description="Tente buscar só pelo nome da cidade ou por parte do nome da escola."
        >
          <Button variant="outline" onClick={() => setSearch('')}>Limpar busca</Button>
        </StateMessage>
      ) : (
        <ul className={gridClass}>
          {filteredSchools.map((school) => (
            <li key={school.id}>
              <Link
                to={`/schools/${school.id}/albums`}
                className="flex h-full items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-primary-500"
              >
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100">
                  {school.imageUrl ? (
                    <img
                      src={school.imageUrl}
                      alt=""
                      className="size-full object-cover"
                      loading="lazy"
                    />
                  ) : (<SchoolIcon className="size-7 text-slate-400" strokeWidth={1.5} />)}
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold leading-snug text-slate-900">{school.name}</h2>
                  <p className="mt-0.5 text-sm text-slate-600">{school.city}, {school.state}</p>
                  {school.phone && (
                    <p className="mt-0.5 text-sm text-slate-500 tabular-nums">{formatPhone(school.phone)}</p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Page>
  );
};

export default SchoolsPage;
