import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Page from "@/components/Page";

const NotFoundPage = () => {
    return (
        <Page>
            <div className="mx-auto max-w-sm py-16 text-center">
                <p className="text-sm font-semibold text-secondary-500 tabular-nums">Erro 404</p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Página não encontrada</h1>
                <p className="mt-2 text-slate-600">
                    A página que você está procurando não existe ou foi movida.
                </p>
                <Button asChild size="lg" className="mt-6">
                    <Link to="/">Voltar para a página inicial</Link>
                </Button>
            </div>
        </Page>
    )
}

export default NotFoundPage;
