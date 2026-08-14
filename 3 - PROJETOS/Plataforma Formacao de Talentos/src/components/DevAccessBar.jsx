// =====================================================================
// DevAccessBar.jsx — Modo de Demonstração / Acesso Rápido de Teste
// Barra fixa (apenas em desenvolvimento) para alternar instantaneamente
// o perfil do usuário logado e navegar por todas as telas.
// Estilo Zello: fundo #161B28, bordas #27272A, botões laranja #FF6B00.
// =====================================================================
import React from 'react';
import { FlaskConical, LogOut, ChevronRight } from 'lucide-react';

// Perfis de teste (correspondem às 5 visões do sistema).
export const DEMO_PROFILES = [
  {
    perfil: 'N0',
    label: 'Nível 0 (Iniciante)',
    profile: {
      nome: 'Lucas (Novo Aluno)',
      email: 'lucas@zello.tec.br',
      nivelAtual: 0,
      trilhaAtivaId: 'iniciante_n0',
    },
  },
  {
    perfil: 'N1',
    label: 'Nível 1 (Aluno Técnico)',
    profile: {
      nome: 'Ana (Aluno N1)',
      email: 'ana@zello.tec.br',
      nivelAtual: 1,
      trilhaAtivaId: 'flutterflow',
    },
  },
  {
    perfil: 'N2',
    label: 'Nível 2 (Mentor N2)',
    profile: {
      nome: 'Carlos (Mentor N2)',
      email: 'carlos@zello.tec.br',
      nivelAtual: 2,
      trilhaAtivaId: 'flutterflow',
      afilhado: { nome: 'Ana', progresso: 65 },
    },
  },
  {
    perfil: 'N3',
    label: 'Nível 3 (Especialista N3)',
    profile: {
      nome: 'Mariana (Suporte N3)',
      email: 'mariana@zello.tec.br',
      nivelAtual: 3,
      trilhaAtivaId: 'flutterflow',
    },
  },
  {
    perfil: 'GESTOR',
    label: 'Gestor / Admin',
    profile: {
      nome: 'Gestor (Admin)',
      email: 'gestor@zello.tec.br',
      nivelAtual: null,
      trilhaAtivaId: null,
    },
  },
];

export default function DevAccessBar({ onSelect, onLogout, currentPerfil, autenticado }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-elevated/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-3 py-2 sm:px-6">
        <span className="mr-1 inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
          <FlaskConical size={13} /> Modo Demo
        </span>

        {DEMO_PROFILES.map((d) => {
          const ativo = autenticado && currentPerfil === d.perfil;
          return (
            <button
              key={d.perfil}
              onClick={() => onSelect(d.perfil, d.profile)}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                ativo
                  ? 'bg-primary text-white shadow-glow'
                  : 'border border-line bg-deep text-silver hover:border-primary hover:text-primary'
              }`}
              title={`Entrar como ${d.label}`}
            >
              <ChevronRight size={12} className={ativo ? 'text-white' : 'text-primary'} />
              {d.label}
            </button>
          );
        })}

        {autenticado && (
          <button
            onClick={onLogout}
            className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-line bg-deep px-2.5 py-1.5 text-xs font-semibold text-silver transition-colors hover:border-red-500/50 hover:text-red-300"
            title="Sair / limpar sessão"
          >
            <LogOut size={13} /> Sair
          </button>
        )}
      </div>
    </div>
  );
}
