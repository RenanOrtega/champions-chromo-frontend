import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Page from '@/components/Page'

const steps = [
  {
    title: 'Selecione a escola',
    description: 'Escolha a escola do seu filho para ver os álbuns disponíveis.',
  },
  {
    title: 'Escolha o álbum',
    description: 'Selecione entre os modelos disponíveis para a escola.',
  },
  {
    title: 'Marque as figurinhas que faltam',
    description: 'Toque nos números que faltam, envie o pedido e combine o pagamento pelo WhatsApp.',
  },
]

const HomePage = () => {
  return (
    <Page className="space-y-12 sm:space-y-16">
      <section className="grid items-center gap-8 rounded-lg bg-primary-700 px-6 py-10 text-white sm:px-10 md:grid-cols-[1fr_auto] md:py-12">
        <div>
          <h1 className="max-w-xl text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Quer completar seu álbum de figurinhas?
          </h1>
          <p className="mt-3 max-w-lg text-lg text-primary-100">
            Sem problemas, é só pedir as que faltam.
          </p>
          <Link
            to="/schools"
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-md bg-secondary-400 px-6 text-base font-semibold text-slate-950 transition-colors hover:bg-secondary-300"
          >
            Fazer meu pedido
            <ArrowRight className="size-5" />
          </Link>
        </div>
        <img
          src="/logo.png"
          alt=""
          className="hidden w-44 md:block lg:w-52"
        />
      </section>

      <section>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Como funciona</h2>
        <ol className="mt-6 grid gap-6 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4 md:flex-col md:gap-3 md:border-t-2 md:border-slate-300 md:pt-4">
              <span className="text-3xl font-bold leading-none text-secondary-500 tabular-nums">{index + 1}</span>
              <div>
                <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-l-4 border-secondary-400 pl-5 sm:pl-6">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Lembranças que duram para sempre</h2>
        <div className="mt-3 max-w-2xl space-y-3 leading-relaxed text-slate-700">
          <p>
            Nossos álbuns de figurinhas escolares são a maneira perfeita de preservar as memórias dos anos escolares do seu filho.
          </p>
          <p>
            Com fotos de alta qualidade e design personalizado para cada escola, estes álbuns se tornarão tesouros de família.
          </p>
        </div>
      </section>
    </Page>
  )
}

export default HomePage
