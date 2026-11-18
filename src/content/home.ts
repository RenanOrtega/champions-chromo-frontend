// Conteúdo da página de abertura.
// Para trocar uma imagem, substitua o arquivo em public/home/ mantendo o mesmo nome
// (ou altere o caminho aqui). Tamanhos recomendados estão ao lado de cada item.

export const hero = {
  eyebrow: 'Álbuns de figurinhas personalizados',
  title: 'Transformamos a sua história em álbum de figurinhas',
  text: 'Criamos álbuns para empresas, escolas e eventos: do layout das páginas à impressão das figurinhas.',
  image: '/home/destaque.jpg', // 1200 × 900 px
}

export const segments = [
  {
    title: 'Empresas',
    text: 'Álbum da equipe, de aniversário da empresa ou de campanha interna.',
    image: '/home/segmento-empresas.jpg', // 800 × 600 px
  },
  {
    title: 'Escolas',
    text: 'Cada aluno vira figurinha. Os pais compram as que faltam aqui no site.',
    image: '/home/segmento-escolas.jpg', // 800 × 600 px
  },
  {
    title: 'Eventos e festas',
    text: 'Casamentos, formaturas, aniversários e times.',
    image: '/home/segmento-eventos.jpg', // 800 × 600 px
  },
]

// De 6 a 9 álbuns. Imagens 800 × 1000 px (em pé).
export const albums = [
  { name: 'Nome do cliente', tag: 'Empresa', image: '/home/album-1.jpg' },
  { name: 'Nome do cliente', tag: 'Escola', image: '/home/album-2.jpg' },
  { name: 'Nome do cliente', tag: 'Evento', image: '/home/album-3.jpg' },
  { name: 'Nome do cliente', tag: 'Empresa', image: '/home/album-4.jpg' },
  { name: 'Nome do cliente', tag: 'Escola', image: '/home/album-5.jpg' },
  { name: 'Nome do cliente', tag: 'Empresa', image: '/home/album-6.jpg' },
]

export const steps = [
  { title: 'Conversa inicial', text: 'Você conta o tema, a quantidade de figurinhas e o prazo.' },
  { title: 'Fotos e layout', text: 'Recebemos as fotos e montamos as páginas para sua aprovação.' },
  { title: 'Impressão', text: 'Imprimimos álbuns e figurinhas.' },
  { title: 'Entrega', text: 'Entregamos tudo pronto para colar.' },
]

// Deixe vazio ('') o que não quiser mostrar.
export const contact = {
  whatsapp: '', // só números com DDD, ex.: '5511999999999'
  whatsappLabel: '(00) 00000-0000',
  instagram: '', // sem @, ex.: 'reidasfigurinhas'
  email: '',
}
