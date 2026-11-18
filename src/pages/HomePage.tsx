import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Instagram, Mail, MessageCircle } from 'lucide-react'
import { albums, contact, hero, segments, steps } from '../content/home'

const sectionTitle = 'font-display font-extrabold text-3xl md:text-4xl leading-tight text-slate-800'

const HomePage = () => {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  const whatsappHref = contact.whatsapp ? `https://wa.me/${contact.whatsapp}` : undefined
  const instagramHref = contact.instagram ? `https://instagram.com/${contact.instagram}` : undefined

  return (
    <div className="mt-16 -mb-10 bg-white">
      <section className="bg-[#E6F7F6]">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-14">
          <div className="flex-1 flex flex-col gap-5">
            <p className="text-xs md:text-sm font-semibold tracking-widest uppercase text-teal-800">{hero.eyebrow}</p>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-slate-800">
              {hero.title}
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-slate-600">{hero.text}</p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="#contato"
                className="text-center bg-secondary-600 hover:bg-secondary-700 text-white font-semibold px-7 py-4 rounded-full transition-colors"
              >
                Quero um álbum
              </a>
              <Link
                to="/schools"
                className="text-center bg-white text-teal-800 border-2 border-teal-800 hover:bg-teal-50 font-semibold px-7 py-3.5 rounded-full transition-colors"
              >
                Comprar figurinhas
              </Link>
            </div>
          </div>
          <img
            src={hero.image}
            alt="Álbuns de figurinhas feitos pelo Rei das Figurinhas"
            width={1200}
            height={900}
            className="flex-1 w-full md:w-auto md:max-w-[50%] aspect-[4/3] object-cover rounded-2xl"
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pt-16 md:pt-24 pb-8 flex flex-col gap-8 md:gap-10">
        <div className="flex flex-col gap-3 max-w-2xl">
          <h2 className={sectionTitle}>Para quem fazemos</h2>
          <p className="text-slate-600 md:text-lg">Cada álbum é desenhado do zero, com as fotos e a identidade de quem encomenda.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {segments.map((s) => (
            <article key={s.title} className="flex md:flex-col gap-4 items-center md:items-stretch">
              <img
                src={s.image}
                alt={s.title}
                width={800}
                height={600}
                loading="lazy"
                className="w-32 md:w-full shrink-0 aspect-[4/3] object-cover rounded-xl"
              />
              <div className="flex flex-col gap-1 md:gap-2">
                <h3 className="font-display font-extrabold text-xl md:text-2xl text-slate-800">{s.title}</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">{s.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="albuns" className="scroll-mt-20 max-w-6xl mx-auto px-4 py-16 md:py-20 flex flex-col gap-8 md:gap-10">
        <div className="flex flex-col gap-3 max-w-2xl">
          <h2 className={sectionTitle}>Álbuns que já fizemos</h2>
          <p className="text-slate-600 md:text-lg">Alguns dos nossos trabalhos recentes.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-7">
          {albums.map((a, i) => (
            <article key={i} className="flex flex-col gap-2 md:gap-3">
              <img
                src={a.image}
                alt={`Álbum ${a.name}`}
                width={800}
                height={1000}
                loading="lazy"
                className="w-full aspect-[4/5] object-cover rounded-xl"
              />
              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1">
                <h3 className="text-sm md:text-lg font-semibold text-slate-800">{a.name}</h3>
                <span className="self-start text-xs md:text-sm font-semibold text-teal-800 bg-[#E6F7F6] px-2.5 py-1 rounded-full">
                  {a.tag}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="como-funciona" className="scroll-mt-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20 flex flex-col gap-8 md:gap-10">
          <h2 className={sectionTitle}>Como funciona</h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((st, i) => (
              <li key={st.title} className="flex md:flex-col gap-4 md:gap-3 items-start">
                <span className="shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-full bg-teal-700 text-white flex items-center justify-center font-display font-extrabold text-xl">
                  {i + 1}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-lg text-slate-800">{st.title}</h3>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">{st.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="bg-secondary-50 rounded-3xl p-6 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex flex-col gap-2">
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-slate-800">Já tem o álbum da escola?</h2>
            <p className="text-slate-600 md:text-lg">Escolha a escola, marque as figurinhas que faltam e pague pelo Pix.</p>
          </div>
          <Link
            to="/schools"
            className="text-center shrink-0 bg-secondary-600 hover:bg-secondary-700 text-white font-semibold px-8 py-4 rounded-full transition-colors"
          >
            Comprar figurinhas
          </Link>
        </div>
      </section>

      <section id="contato" className="scroll-mt-16 bg-slate-800 text-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20 flex flex-col md:flex-row gap-10 md:gap-12 md:justify-between">
          <div className="flex-1 flex flex-col gap-3">
            <h2 className="font-display font-extrabold text-3xl md:text-4xl leading-tight text-white">Vamos fazer o seu álbum?</h2>
            <p className="text-slate-300 md:text-lg">Conte para a gente o que você imagina e mandamos uma proposta.</p>
          </div>
          <div className="flex-1 flex flex-col gap-3 md:max-w-sm">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-[#25D366] text-[#0B2B17] font-semibold px-5 py-4 rounded-2xl"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              WhatsApp: {contact.whatsappLabel}
            </a>
            <a
              href={instagramHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 border border-slate-600 hover:border-slate-400 px-5 py-4 rounded-2xl"
            >
              <Instagram className="h-5 w-5" aria-hidden="true" />
              Instagram: {contact.instagram ? `@${contact.instagram}` : '@perfil'}
            </a>
            <a
              href={contact.email ? `mailto:${contact.email}` : undefined}
              className="flex items-center gap-3 border border-slate-600 hover:border-slate-400 px-5 py-4 rounded-2xl"
            >
              <Mail className="h-5 w-5" aria-hidden="true" />
              E-mail: {contact.email || 'contato@dominio.com.br'}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
