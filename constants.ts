import { QuizTopic } from './types';

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