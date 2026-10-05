import { whatsAppUrl } from '@/lib/contact'

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-sm text-slate-600 sm:flex-row sm:px-6">
        <p>&copy; {new Date().getFullYear()} Rei das Figurinhas</p>
        <p>
          Dúvidas sobre o seu pedido?{' '}
          <a
            href={whatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary-700 underline underline-offset-2 hover:text-primary-800"
          >
            Fale com a gente no WhatsApp
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
