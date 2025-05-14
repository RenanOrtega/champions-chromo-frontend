// src/pages/SchoolsPage.tsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { School as SchoolIcon, Search } from 'lucide-react'
import { fetchSchools } from '../clients/school';
import { School } from '../types/school';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Selecione a Escola</h1>
      </div>

      <div className="mb-6 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            type="text"
            placeholder="Buscar por nome, cidade ou estado..."
            className="w-full pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <div className="h-40 flex items-center justify-center">
                <Skeleton className="h-32 w-32 rounded-all" />
              </div>
              <CardContent className="pt-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
          {filteredSchools.length === 0 ? (
            <Alert>
              <AlertDescription>
                Nenhuma escola encontrada com os critérios de busca.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchools.map((school) => (
                <Link
                  to={`/schools/${school.id}/albums`}
                  key={school.id}
                  className="block transition-shadow duration-300 hover:opacity-90"
                >
                  <Card className="hover:shadow-md border-2 hover:border-primary-200">
                    <CardHeader className="h-40 flex items-center justify-center bg-muted">
                      <SchoolIcon size={64} className="text-muted-foreground" />
                    </CardHeader>
                    <CardContent className=" bg-white">
                      <h3 className="font-bold text-lg mb-1">{school.name}</h3>
                      <p className="text-muted-foreground">{school.city}, {school.state}</p>
                      <p className="text-muted-foreground text-sm mt-2">{school.phone}</p>
                    </CardContent>
                  </Card>
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