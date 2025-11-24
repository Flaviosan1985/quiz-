import { QuizTopic, StudyTip } from './types';

export const TOPICS: QuizTopic[] = [
  {
    id: 'conhecimentos_ibge',
    label: 'Conhecimentos Técnicos',
    icon: '📊',
    promptContext: 'Foque estritamente na Lei nº 5.534/1968, Lei nº 5.878/1973, Estrutura organizacional do IBGE, conceitos de Recenseamento, Setor Censitário e a metodologia de pesquisa do Censo Demográfico. Nível: Concurso Recenseador.',
    color: 'bg-blue-600'
  },
  {
    id: 'portugues',
    label: 'Língua Portuguesa',
    icon: '📚',
    promptContext: 'Gramática normativa, interpretação de texto, coesão e coerência, regência nominal e verbal, crase e sintaxe. Estilo da banca FGV (foco em pegadinhas semânticas e reescrita de frases).',
    color: 'bg-indigo-500'
  },
  {
    id: 'etica',
    label: 'Ética no Serviço Público',
    icon: '⚖️',
    promptContext: 'Código de Ética Profissional do Servidor Público Civil do Poder Executivo Federal (Decreto nº 1.171/1994) e Lei nº 8.112/1990 (Regime Disciplinar). Foco em deveres e vedações.',
    color: 'bg-emerald-500'
  },
  {
    id: 'matematica',
    label: 'Raciocínio Lógico',
    icon: '📐',
    promptContext: 'Lógica proposicional, tabelas-verdade, análise combinatória, porcentagem e regra de três simples/composta. Problemas contextualizados com situações de coleta de dados.',
    color: 'bg-amber-500'
  },
  {
    id: 'geografia',
    label: 'Geografia do Brasil',
    icon: '🌎',
    promptContext: 'Divisão política e regional do Brasil, urbanização, dinâmicas da população (densidade, migração), cartografia básica e biomas brasileiros.',
    color: 'bg-rose-500'
  },
  {
    id: 'informatica',
    label: 'Noções de Informática',
    icon: '💻',
    promptContext: 'Conceitos de Internet e Intranet, navegadores, correio eletrônico, segurança da informação e noções de sistemas operacionais e editores de texto.',
    color: 'bg-violet-500'
  }
];

export const STUDY_TIPS: StudyTip[] = [
  {
    id: 'tip_1',
    title: 'A diferença entre Lei 8.112 e Decreto 1.171',
    category: 'Ética',
    icon: '⚖️',
    color: 'bg-emerald-500',
    content: 'Muitos candidatos confundem: o Decreto 1.171/94 trata do Código de Ética (moral, decoro, zelo), enquanto a Lei 8.112/90 trata do Regime Jurídico (deveres, proibições e punições administrativas). Lembre-se: A Comissão de Ética aplica apenas a penalidade de CENSURA. Suspensão e Demissão vêm da 8.112.'
  },
  {
    id: 'tip_2',
    title: 'Português FGV: Interpretação x Gramática',
    category: 'Português',
    icon: '📚',
    color: 'bg-indigo-500',
    content: 'A banca FGV ama "reescrita de frases". A dica é: verifique sempre se a reescrita manteve o sentido original E a correção gramatical. Cuidado com trocas sutis de conjunções (ex: "mas" por "portanto") que alteram a lógica do texto.'
  },
  {
    id: 'tip_3',
    title: 'O que é Setor Censitário?',
    category: 'Conhecimentos Técnicos',
    icon: '📊',
    color: 'bg-blue-600',
    content: 'É a unidade territorial de coleta e divulgação de dados estatísticos do IBGE. É a área de trabalho de um Recenseador. Importante: Respeita a divisão político-administrativa e outros limites (bairros, distritos).'
  },
  {
    id: 'tip_4',
    title: 'Matemática: A onipresente Regra de Três',
    category: 'Matemática',
    icon: '📐',
    color: 'bg-amber-500',
    content: 'Em provas do IBGE, problemas envolvendo densidade demográfica, proporção de entrevistados e estimativas populacionais quase sempre se resolvem com Regra de Três Simples. Domine identificar se as grandezas são Diretamente ou Inversamente proporcionais.'
  }
];