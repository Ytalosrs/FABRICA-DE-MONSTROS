// =====================================================================
// Navbar.jsx — Header/Marca da plataforma com identidade Zello.
// Exibe o símbolo <ZelloLogo />, o título "FORMAÇÃO DE TALENTOS"
// (Branco + Laranja), o simulador de visão e o usuário logado com o
// Nível carregado em tempo real do Firestore.
// =====================================================================
import React from 'react';
import { LogOut } from 'lucide-react';
import ZelloLogo from './ZelloLogo.jsx';

const NIVEL_LABEL = { 0: 'Nível 0', 1: 'Nível 1', 2: 'Nível 2', 3: 'Nível 3' };

export default function Navbar({ perfil, setPerfil, perfis, usuario, nivelAtual, onLogout }) {
  const nomeBruto = usuario?.nome || usuario?.displayName || 'Colaborador';
  // Separa o nome do cargo entre parênteses. Ex.: "Lucas (Novo Aluno)".
  const cargoMatch = nomeBruto.match(/\(([^)]+)\)/);
  const cargo = cargoMatch ? cargoMatch[1] : null;
  const nome = nomeBruto.replace(/\s*\([^)]*\)\s*/g, '').trim() || nomeBruto;
  // Iniciais só das palavras alfabéticas do nome (ignora parênteses).
  const iniciais =
    nome
      .split(/\s+/)
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-elevated/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Marca Zello — símbolo oficial + título */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ZelloLogo size={44} />
            <div className="leading-tight">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Zello</p>
              <h1 className="text-lg font-extrabold tracking-tight text-ice">
                FORMAÇÃO DE <span className="text-primary">TALENTOS</span>
              </h1>
            </div>
          </div>

          {/* Usuário + Logout (mobile) */}
          <div className="flex items-center gap-2 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary">
              {iniciais}
            </span>
            <button
              onClick={onLogout}
              className="rounded-lg border border-line p-2 text-silver transition-colors hover:border-red-500/50 hover:text-red-300"
              aria-label="Sair"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Simulador de visão */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-silver">
            Navegação
          </span>
          <div className="flex flex-wrap gap-1.5 rounded-xl border border-line bg-elevated p-1.5">
            {perfis.map((p) => {
              const ativo = perfil === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPerfil(p.id)}
                  className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                    ativo
                      ? 'bg-primary text-white shadow-glow'
                      : 'text-silver hover:bg-deep hover:text-ice'
                  }`}
                  aria-pressed={ativo}
                >
                  <p.icon size={16} />
                  <span className="flex flex-col items-start leading-none">
                    <span>{p.label}</span>
                    <span className={`text-[10px] font-normal ${ativo ? 'text-white/80' : 'text-silver/70'}`}>
                      {p.sub}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Usuário + Nível ao vivo + Logout (desktop) */}
        <div className="hidden items-center gap-2.5 lg:flex">
          {/* Pill do usuário */}
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/20 text-sm font-bold text-primary ring-1 ring-primary/30">
              {iniciais}
            </span>
            <div className="leading-tight">
              <p className="whitespace-nowrap text-sm font-semibold text-ice">{nome}</p>
              <p className="whitespace-nowrap text-[11px] text-silver">
                {cargo ? cargo : usuario?.email}
              </p>
            </div>
            {typeof nivelAtual === 'number' && (
              <span className="ml-1 inline-flex shrink-0 items-center rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[11px] font-bold text-accent">
                {NIVEL_LABEL[nivelAtual] ?? `Nível ${nivelAtual}`}
              </span>
            )}
          </div>
          <button
            onClick={onLogout}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-line px-3 py-2.5 text-sm font-semibold text-silver transition-colors hover:border-red-500/50 hover:bg-red-500/5 hover:text-red-300"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </div>
    </header>
  );
}
