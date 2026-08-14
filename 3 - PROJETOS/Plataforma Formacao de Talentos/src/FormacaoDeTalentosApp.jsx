// =====================================================================
// SEÇÃO 4 — APLICAÇÃO REACT PRINCIPAL — "FORMAÇÃO DE TALENTOS"
// Design System "Dark Tech" (Tailwind) + Lucide Icons.
// Simulador de perfis: N0, N1, N2, N3 e Visão do Gestor.
// =====================================================================
import React, { useEffect, useMemo, useState } from 'react';
import Login from './components/Login.jsx';
import Navbar from './components/Navbar.jsx';
import DevAccessBar from './components/DevAccessBar.jsx';
import ApresentacaoView from './components/ApresentacaoView.jsx';
import AdminView from './components/AdminView.jsx';
import MinhaTrilhaView from './components/MinhaTrilhaView.jsx';
import { observarAuth, sair, loginDemo } from './services/authService.js';
import {
  observarPerfil,
  listarUsuarios,
  listarMentorias,
  listarTrilhas,
  listarProgresso,
} from './services/dbService.js';
import { isFirebaseConfigured } from './firebase.js';
import {
  GraduationCap,
  Loader2,
  Lock,
  CheckCircle2,
  Circle,
  PlayCircle,
  ArrowRight,
  Award,
  ShieldCheck,
  Users,
  UserRound,
  Sparkles,
  Trophy,
  MessageCircle,
  Lightbulb,
  TrendingUp,
  LayoutDashboard,
  ClipboardCheck,
  X,
  ChevronRight,
  BadgeCheck,
  Flame,
  HelpCircle,
  Layers,
  ChevronDown,
  Home,
  Settings,
} from 'lucide-react';
import {
  TRILHAS,
  TRILHAS_TECNICAS,
  trilhaPorId,
  MODULOS_N0,
  N0_NOME,
  MODULOS_N1,
  USUARIOS,
  MENTORIAS,
  FILA_DUVIDAS,
} from './data/mock.js';

// ---------------------------------------------------------------------
// Metadados dos perfis do simulador
// ---------------------------------------------------------------------
// Navegação visível para todo colaborador logado.
const PERFIS = [
  { id: 'INTRO', label: 'Início', sub: 'Apresentação', icon: Home },
  { id: 'MINHA', label: 'Minha Trilha', sub: 'Seu progresso', icon: Layers },
  { id: 'GESTOR', label: 'Equipe', sub: 'Visão geral', icon: Users },
];

// Abas extras só para admin (a aba de gestão fica dentro de "Admin").
const PERFIS_ADMIN = [];

// =====================================================================
// COMPONENTES REUTILIZÁVEIS
// =====================================================================
function ProgressBar({ value, accent = false, className = '' }) {
  return (
    <div className={`h-2 w-full rounded-full bg-line/60 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-700 ${
          accent ? 'bg-accent' : 'bg-primary'
        }`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function Avatar({ src, alt, size = 44, ring = false }) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full object-cover shrink-0 ${
        ring ? 'ring-2 ring-accent ring-offset-2 ring-offset-elevated' : 'ring-1 ring-line'
      }`}
      style={{ width: size, height: size }}
    />
  );
}

function NivelChip({ nivel }) {
  const map = {
    N0: { txt: 'Nível 0', cls: 'bg-accent/15 text-accent border-accent/30' },
    N1: { txt: 'Nível 1', cls: 'bg-primary/15 text-primary border-primary/30' },
    N2: { txt: 'Nível 2', cls: 'bg-violet-500/15 text-violet-300 border-violet-400/30' },
    N3: { txt: 'Nível 3', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' },
  };
  const s = map[nivel] ?? map.N0;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.cls}`}>
      {s.txt}
    </span>
  );
}

function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-xl2 border border-line bg-elevated p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, children, hint }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      {Icon && (
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon size={18} />
        </span>
      )}
      <div>
        <h2 className="text-lg font-bold text-ice">{children}</h2>
        {hint && <p className="text-xs text-silver">{hint}</p>}
      </div>
    </div>
  );
}

const statusMeta = {
  concluido: { icon: CheckCircle2, cls: 'text-accent', label: 'Concluído' },
  em_andamento: { icon: PlayCircle, cls: 'text-primary', label: 'Em andamento' },
  nao_iniciado: { icon: Circle, cls: 'text-silver', label: 'Não iniciado' },
};

function ModuloRow({ modulo, index }) {
  const meta = statusMeta[modulo.status] ?? statusMeta.nao_iniciado;
  const Icon = meta.icon;
  return (
    <div className="group flex items-center gap-4 rounded-lg border border-transparent px-3 py-3 transition-colors hover:border-line hover:bg-deep/40">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-xs font-bold text-silver">
        {index + 1}
      </span>
      <Icon size={20} className={`${meta.cls} shrink-0`} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-ice">{modulo.titulo}</p>
        <p className="truncate text-xs text-silver">{modulo.desc}</p>
      </div>
      <span className={`hidden text-xs font-medium sm:block ${meta.cls}`}>{meta.label}</span>
      <ChevronRight size={16} className="text-silver opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}

// Botão CTA padrão
function Button({ children, variant = 'primary', className = '', icon: Icon, ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover active:scale-[0.98] shadow-glow',
    accent: 'bg-accent text-deep hover:bg-accent-hover active:scale-[0.98] shadow-glow-accent',
    ghost: 'border border-line bg-transparent text-ice hover:border-primary hover:text-primary',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

// =====================================================================
// INTERFACE NÍVEL 0 — Introdução Básica ("Trilha Tech 360 / TI do Zero")
// =====================================================================

// Acordeão de módulo com tópicos do conteúdo real.
function ModuloN0Accordion({ modulo, aberto, onToggle }) {
  const meta = statusMeta[modulo.status] ?? statusMeta.nao_iniciado;
  const StatusIcon = meta.icon;
  const Icon = modulo.icon ?? GraduationCap;
  return (
    <div
      className={`overflow-hidden rounded-xl border transition-colors ${
        aberto ? 'border-accent/40 bg-deep/40' : 'border-line bg-elevated hover:border-primary/50'
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={aberto}
        className="flex w-full items-center gap-4 px-4 py-3.5 text-left"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-xs font-bold text-silver">
          {modulo.num}
        </span>
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
            aberto ? 'bg-accent/15 text-accent' : 'bg-deep text-primary'
          }`}
        >
          <Icon size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ice">{modulo.titulo}</p>
          <p className="truncate text-xs text-silver">{modulo.desc}</p>
        </div>
        <span className={`hidden items-center gap-1.5 text-xs font-medium sm:flex ${meta.cls}`}>
          <StatusIcon size={15} /> {meta.label}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-silver transition-transform ${aberto ? 'rotate-180 text-accent' : ''}`}
        />
      </button>
      {aberto && (
        <div className="animate-fade-up border-t border-line/60 px-4 py-4 pl-[4.5rem]">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-silver">
            Conteúdo do módulo
          </p>
          <ul className="space-y-2">
            {modulo.topicos.map((t, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-ice">
                <span className="mt-0.5 shrink-0 text-accent">
                  <CheckCircle2 size={15} />
                </span>
                <span className="text-silver">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ViewN0() {
  // Módulos de aprendizado (1–5) e a avaliação de passagem (6) separados.
  const modulosAprendizado = MODULOS_N0.filter((m) => !m.isAvaliacao);
  const avaliacao = MODULOS_N0.find((m) => m.isAvaliacao);
  const [aberto, setAberto] = useState('m3'); // módulo em andamento aberto por padrão

  const concluidos = modulosAprendizado.filter((m) => m.status === 'concluido').length;
  const progresso = Math.round((concluidos / modulosAprendizado.length) * 100);
  const liberouAvaliacao = concluidos === modulosAprendizado.length;

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Card grande de introdução em destaque */}
      <div className="relative overflow-hidden rounded-xl2 border border-accent/30 bg-gradient-to-br from-accent/15 via-elevated to-elevated p-7">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              <Sparkles size={14} /> {N0_NOME}
            </span>
            <h1 className="text-2xl font-extrabold leading-tight text-ice md:text-3xl">
              Bem-vindo(a) à sua jornada de tecnologia!
            </h1>
            <p className="mt-2 text-silver">
              O <strong className="text-ice">Nível 0</strong> é a base obrigatória: da história da
              computação à lógica e aos bancos de dados. Conclua os 5 módulos e passe na
              Avaliação de Passagem para desbloquear as 10 trilhas técnicas.
            </p>
            <div className="mt-5 max-w-md">
              <div className="mb-1.5 flex justify-between text-xs text-silver">
                <span>Seu progresso ({concluidos}/{modulosAprendizado.length} módulos)</span>
                <span className="font-semibold text-accent">{progresso}%</span>
              </div>
              <ProgressBar value={progresso} accent />
            </div>
          </div>
          <Button variant="accent" icon={PlayCircle} className="shrink-0">
            Continuar aprendendo
          </Button>
        </div>
      </div>

      {/* Módulos passo a passo (acordeão com tópicos) */}
      <div>
        <SectionTitle icon={GraduationCap} hint="Clique em cada módulo para ver o conteúdo detalhado">
          Grade curricular — Trilha Tech 360
        </SectionTitle>
        <div className="space-y-3">
          {modulosAprendizado.map((m) => (
            <ModuloN0Accordion
              key={m.id}
              modulo={m}
              aberto={aberto === m.id}
              onToggle={() => setAberto(aberto === m.id ? null : m.id)}
            />
          ))}
        </div>
      </div>

      {/* Card destacado: Avaliação de Passagem (Módulo 6) */}
      {avaliacao && (
        <div
          className={`relative overflow-hidden rounded-xl2 border p-6 ${
            liberouAvaliacao
              ? 'border-primary/40 bg-gradient-to-br from-primary/15 via-elevated to-elevated'
              : 'border-line bg-elevated'
          }`}
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                  liberouAvaliacao ? 'bg-primary text-white' : 'bg-deep text-silver'
                }`}
              >
                {liberouAvaliacao ? <ClipboardCheck size={24} /> : <Lock size={22} />}
              </span>
              <div>
                <h3 className="text-lg font-bold text-ice">{avaliacao.titulo}</h3>
                <ul className="mt-2 space-y-1.5">
                  {avaliacao.topicos.map((t, i) => (
                    <li key={i} className="flex gap-2 text-sm text-silver">
                      <ChevronRight size={15} className="mt-0.5 shrink-0 text-primary" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Button
              variant={liberouAvaliacao ? 'primary' : 'ghost'}
              icon={liberouAvaliacao ? Award : Lock}
              disabled={!liberouAvaliacao}
              className="shrink-0"
            >
              {liberouAvaliacao ? 'Iniciar avaliação' : 'Conclua os 5 módulos'}
            </Button>
          </div>
        </div>
      )}

      {/* Catálogo bloqueado */}
      <div>
        <SectionTitle icon={Lock} hint="Conclua o Nível 0 para escolher e desbloquear 1 trilha">
          Trilhas Técnicas (bloqueadas)
        </SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {TRILHAS_TECNICAS.map((t) => (
            <div
              key={t.id}
              className="group relative flex flex-col items-center gap-2 rounded-xl border border-line bg-elevated/60 p-4 text-center opacity-70"
              title="Bloqueado — conclua o Nível 0"
            >
              <div className="absolute right-2 top-2 text-silver">
                <Lock size={14} />
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-deep text-silver">
                <t.icon size={20} />
              </span>
              <p className="text-xs font-medium leading-tight text-silver">{t.nome.replace('Trilha - ', '')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// INTERFACE NÍVEL 1 — Escolha da Trilha + Certificação
// =====================================================================
function CertificacaoModal({ trilha, onClose, onAprovar }) {
  if (!trilha) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg animate-fade-up rounded-xl2 border border-line bg-elevated p-6 shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-accent/15 text-accent">
              <ClipboardCheck size={22} />
            </span>
            <div>
              <h3 className="text-lg font-bold text-ice">Certificação N1</h3>
              <p className="text-xs text-silver">{trilha.nome}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-silver hover:bg-deep hover:text-ice">
            <X size={18} />
          </button>
        </div>

        <div className="rounded-lg border border-line bg-deep/50 p-4">
          <p className="text-sm text-silver">
            Ao ser aprovado(a), você sobe para o <strong className="text-ice">Nível 2</strong>,
            entra em um <strong className="text-ice">Squad</strong> e recebe automaticamente
            um <strong className="text-accent">afilhado(a)</strong> da mesma trilha para mentorar.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {['25 questões técnicas', 'Projeto prático avaliado', 'Nota mínima: 70%'].map((x) => (
              <li key={x} className="flex items-center gap-2 text-ice">
                <CheckCircle2 size={16} className="text-accent" /> {x}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="accent" icon={Award} onClick={onAprovar}>
            Realizar certificação
          </Button>
        </div>
      </div>
    </div>
  );
}

function ViewN1() {
  // Trilha escolhida (simulada): Analista.
  const [trilhaSelecionada, setTrilhaSelecionada] = useState('analista');
  const [modalTrilha, setModalTrilha] = useState(null);
  const [aprovado, setAprovado] = useState(false);

  const progresso = Math.round(
    (MODULOS_N1.filter((m) => m.status === 'concluido').length / MODULOS_N1.length) * 100,
  );

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Banner de status da trilha em curso */}
      <div className="rounded-xl2 border border-primary/30 bg-gradient-to-br from-primary/15 via-elevated to-elevated p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Layers size={14} /> Trilha em curso
            </span>
            <h1 className="text-2xl font-extrabold text-ice">
              {trilhaPorId(trilhaSelecionada)?.nome}
            </h1>
            <p className="mt-1 text-sm text-silver">
              Estude os módulos e faça a Certificação N1 para virar mentor(a).
            </p>
            <div className="mt-4 max-w-md">
              <div className="mb-1.5 flex justify-between text-xs text-silver">
                <span>Progresso da trilha</span>
                <span className="font-semibold text-primary">{progresso}%</span>
              </div>
              <ProgressBar value={progresso} />
            </div>
          </div>
          <Button
            variant="accent"
            icon={aprovado ? BadgeCheck : Award}
            disabled={aprovado}
            onClick={() => setModalTrilha(trilhaPorId(trilhaSelecionada))}
          >
            {aprovado ? 'Certificado(a)!' : 'Fazer Certificação N1'}
          </Button>
        </div>
      </div>

      {/* Módulos da trilha */}
      <Card>
        <SectionTitle icon={GraduationCap} hint="Conclua para liberar a certificação">
          Módulos da Trilha
        </SectionTitle>
        <div className="divide-y divide-line/50">
          {MODULOS_N1.map((m, i) => (
            <ModuloRow key={m.id} modulo={m} index={i} />
          ))}
        </div>
      </Card>

      {/* Catálogo interativo das 10 trilhas técnicas */}
      <div>
        <SectionTitle icon={Layers} hint="Selecione para visualizar — você cursa 1 por vez">
          Catálogo de Trilhas Técnicas
        </SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRILHAS_TECNICAS.map((t) => {
            const ativa = t.id === trilhaSelecionada;
            return (
              <button
                key={t.id}
                onClick={() => setTrilhaSelecionada(t.id)}
                className={`group flex flex-col rounded-xl2 border p-5 text-left transition-all ${
                  ativa
                    ? 'border-primary bg-primary/10 shadow-glow'
                    : 'border-line bg-elevated hover:border-primary/60 hover:-translate-y-0.5'
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-lg ${
                      ativa ? 'bg-primary text-white' : 'bg-deep text-primary'
                    }`}
                  >
                    <t.icon size={20} />
                  </span>
                  {ativa && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                      <CheckCircle2 size={12} /> Em curso
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-ice">{t.nome.replace('Trilha - ', '')}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-silver">{t.descricao}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Ver trilha <ArrowRight size={13} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <CertificacaoModal
        trilha={modalTrilha}
        onClose={() => setModalTrilha(null)}
        onAprovar={() => {
          setAprovado(true);
          setModalTrilha(null);
        }}
      />
    </div>
  );
}

// =====================================================================
// INTERFACE NÍVEL 2 — Squad + Mentoria ("Seu Afilhado")
// =====================================================================
function ViewN2() {
  const [dicaEnviada, setDicaEnviada] = useState(false);
  const mentoria = MENTORIAS[0]; // dupla ativa (se houver)
  const afilhado = mentoria ? USUARIOS.find((u) => u.id === mentoria.afilhadoId) : null;
  const trilha = mentoria ? trilhaPorId(mentoria.trilhaId) : null;
  const rumoN3 = mentoria?.progressoAfilhado ?? 0;

  // Estado vazio: ainda sem afilhado vinculado.
  if (!mentoria || !afilhado) {
    return (
      <div className="space-y-8 animate-fade-up">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-violet-500/15 text-violet-300">
            <Users size={20} />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-ice">Squad + Mentoria</h1>
            <p className="text-sm text-silver">Você é mentor(a) neste nível.</p>
          </div>
        </div>
        <Card className="text-center">
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-8">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/15 text-accent">
              <UserRound size={28} />
            </span>
            <h2 className="text-lg font-bold text-ice">Nenhum afilhado vinculado ainda</h2>
            <p className="text-sm text-silver">
              Assim que um aluno do Nível 1 da sua trilha entrar, o sistema vincula
              automaticamente um afilhado(a) para você mentorar até a certificação.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-violet-500/15 text-violet-300">
          <Users size={20} />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-ice">{mentoria.squad}</h1>
          <p className="text-sm text-silver">
            Trilha {trilha?.nome.replace('Trilha - ', '')} · Sua missão: levar seu afilhado à certificação.
          </p>
        </div>
      </div>

      {/* Painel "Seu Afilhado" em destaque */}
      <div className="rounded-xl2 border border-accent/30 bg-gradient-to-br from-accent/10 via-elevated to-elevated p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar src={afilhado.avatarUrl} alt={afilhado.nome} size={72} ring />
              <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-elevated bg-accent p-1 text-deep">
                <UserRound size={12} />
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">Seu afilhado(a)</p>
              <h2 className="text-xl font-bold text-ice">{afilhado.nome}</h2>
              <p className="text-sm text-silver">{afilhado.setor} · <NivelChip nivel="N1" /></p>
            </div>
          </div>

          <div className="flex-1 lg:border-l lg:border-line lg:pl-6">
            <div className="mb-1.5 flex justify-between text-xs text-silver">
              <span>Progresso na trilha</span>
              <span className="font-semibold text-accent">{mentoria.progressoAfilhado}%</span>
            </div>
            <ProgressBar value={mentoria.progressoAfilhado} accent />
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                variant="primary"
                icon={MessageCircle}
                onClick={() => setDicaEnviada(false)}
              >
                Conversar
              </Button>
              <Button
                variant="ghost"
                icon={Lightbulb}
                onClick={() => setDicaEnviada(true)}
              >
                {dicaEnviada ? 'Dica enviada ✓' : 'Enviar dica'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de progresso rumo ao N3 */}
      <Card>
        <SectionTitle icon={TrendingUp} hint="Você é promovido a N3 quando seu afilhado é certificado">
          Seu caminho rumo ao Nível 3
        </SectionTitle>
        <div className="flex items-center gap-4">
          <NivelChip nivel="N2" />
          <div className="flex-1">
            <ProgressBar value={rumoN3} accent />
          </div>
          <NivelChip nivel="N3" />
        </div>
        <p className="mt-3 text-sm text-silver">
          Faltam <strong className="text-ice">{100 - rumoN3}%</strong> do progresso do seu afilhado
          para você se tornar <strong className="text-emerald-300">Especialista de Suporte</strong>.
        </p>
      </Card>

      {/* Dicas de mentoria */}
      <Card>
        <SectionTitle icon={Lightbulb}>Sugestões de mentoria desta semana</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            'Revise o Projeto Prático Guiado junto com o afilhado.',
            'Compartilhe um caso real do chão de fábrica.',
            'Faça um simulado da certificação em dupla.',
          ].map((dica, i) => (
            <div key={i} className="rounded-lg border border-line bg-deep/40 p-4 text-sm text-silver">
              <Flame size={16} className="mb-2 text-primary" />
              {dica}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// =====================================================================
// INTERFACE NÍVEL 3 — Formado / Especialista de Suporte
// =====================================================================
function ViewN3() {
  const prioridadeCls = {
    alta: 'bg-red-500/15 text-red-300 border-red-400/30',
    media: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
    baixa: 'bg-slate-500/15 text-silver border-line',
  };
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Badge de Especialista */}
      <div className="relative overflow-hidden rounded-xl2 border border-emerald-400/30 bg-gradient-to-br from-emerald-500/15 via-elevated to-elevated p-7">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40">
            <Trophy size={30} />
          </span>
          <div className="flex-1">
            <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              <ShieldCheck size={14} /> Formado
            </span>
            <h1 className="text-2xl font-extrabold text-ice">Especialista de Suporte Técnico</h1>
            <p className="mt-1 text-sm text-silver">
              Você mentorou um afilhado(a) até a certificação e agora atua como consultor(a)
              do setor, respondendo às dúvidas dos Squads.
            </p>
          </div>
          <div className="flex gap-6 sm:flex-col sm:items-end">
            <div className="text-center sm:text-right">
              <p className="text-2xl font-extrabold text-emerald-300">0</p>
              <p className="text-xs text-silver">Dúvidas resolvidas</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-2xl font-extrabold text-accent">0</p>
              <p className="text-xs text-silver">Afilhados formados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fila de dúvidas dos Squads */}
      <Card>
        <SectionTitle icon={HelpCircle} hint="Consultoria em tempo real para os Squads">
          Fila de dúvidas dos Squads
        </SectionTitle>
        <div className="space-y-3">
          {FILA_DUVIDAS.map((d) => (
            <div
              key={d.id}
              className="flex flex-col gap-3 rounded-xl border border-line bg-deep/40 p-4 transition-colors hover:border-emerald-400/40 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-ice">{d.autor}</span>
                  <span className="text-xs text-silver">· {d.squad}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${prioridadeCls[d.prioridade]}`}>
                    {d.prioridade}
                  </span>
                </div>
                <p className="text-sm text-silver">{d.pergunta}</p>
                <p className="mt-1 text-xs text-silver/70">{d.tempo}</p>
              </div>
              <Button variant="accent" icon={MessageCircle} className="shrink-0">
                Responder
              </Button>
            </div>
          ))}
          {!FILA_DUVIDAS.length && (
            <p className="py-8 text-center text-sm text-silver">
              Nenhuma dúvida na fila no momento. 🎉
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

// =====================================================================
// VISÃO DO GESTOR / ADMIN — Dashboard
// =====================================================================
function ViewGestor() {
  const [usuarios, setUsuarios] = useState([]);
  const [mentorias, setMentorias] = useState([]);
  const [trilhas, setTrilhas] = useState([]);
  const [progresso, setProgresso] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let vivo = true;
    (async () => {
      setCarregando(true);
      try {
        const [u, m, t, p] = await Promise.all([
          listarUsuarios(),
          listarMentorias(),
          listarTrilhas(),
          listarProgresso(),
        ]);
        if (!vivo) return;
        setUsuarios(u);
        setMentorias(m);
        setTrilhas(t);
        setProgresso(p);
      } catch (e) {
        if (e?.code !== 'permission-denied') console.warn('[gestor]', e?.code || e);
      } finally {
        if (vivo) setCarregando(false);
      }
    })();
    return () => {
      vivo = false;
    };
  }, []);

  const nomeTrilha = useMemo(
    () => Object.fromEntries(trilhas.map((t) => [t.id, t.nome])),
    [trilhas],
  );
  const porUid = useMemo(() => Object.fromEntries(usuarios.map((u) => [u.uid, u])), [usuarios]);

  // % concluído de cada colaborador na sua trilha ativa.
  const modCount = useMemo(
    () => Object.fromEntries(trilhas.map((t) => [t.id, (t.modulos || []).length])),
    [trilhas],
  );
  const feitosPorUser = useMemo(() => {
    const acc = {};
    progresso
      .filter((p) => p.completed)
      .forEach((p) => {
        acc[p.userId] = acc[p.userId] || {};
        acc[p.userId][p.trackId] = (acc[p.userId][p.trackId] || 0) + 1;
      });
    return acc;
  }, [progresso]);
  const pctDe = (u) => {
    const totalMods = modCount[u.trilhaAtivaId] || 0;
    const feitos = feitosPorUser[u.uid]?.[u.trilhaAtivaId] || 0;
    return totalMods ? Math.round((feitos / totalMods) * 100) : 0;
  };

  const distribuicao = useMemo(() => {
    const acc = { N0: 0, N1: 0, N2: 0, N3: 0 };
    usuarios.forEach((u) => {
      const k = `N${u.nivelAtual ?? 0}`;
      if (acc[k] != null) acc[k] += 1;
    });
    return acc;
  }, [usuarios]);
  const total = usuarios.length;
  const maxBar = Math.max(...Object.values(distribuicao), 1);
  const ativas = mentorias.filter((m) => m.status === 'ACTIVE');

  const iniciais = (nome = '') =>
    nome.split(/\s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase() || '?';

  const niveis = [
    { id: 'N0', label: 'Nível 0 · Introdução', cor: 'bg-accent', txt: 'text-accent' },
    { id: 'N1', label: 'Nível 1 · Trilha Técnica', cor: 'bg-primary', txt: 'text-primary' },
    { id: 'N2', label: 'Nível 2 · Squad + Mentoria', cor: 'bg-violet-400', txt: 'text-violet-300' },
    { id: 'N3', label: 'Nível 3 · Especialista', cor: 'bg-emerald-400', txt: 'text-emerald-300' },
  ];

  if (carregando) {
    return (
      <div className="grid place-items-center py-20 text-silver">
        <Loader2 size={26} className="animate-spin text-primary" />
      </div>
    );
  }

  const Iniciais = ({ nome }) => (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">
      {iniciais(nome)}
    </span>
  );

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
          <LayoutDashboard size={20} />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-ice">Visão Geral da Equipe</h1>
          <p className="text-sm text-silver">Quem está na formação, como anda cada trilha e cada pessoa.</p>
        </div>
      </div>

      {/* Cards de total por nível */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {niveis.map((n) => (
          <Card key={n.id} className="!p-4">
            <div className="flex items-center justify-between">
              <NivelChip nivel={n.id} />
              <span className={`text-3xl font-extrabold ${n.txt}`}>{distribuicao[n.id]}</span>
            </div>
            <p className="mt-2 text-xs text-silver">{n.label}</p>
            <p className="text-xs text-silver/70">
              {total ? Math.round((distribuicao[n.id] / total) * 100) : 0}% do total
            </p>
          </Card>
        ))}
      </div>

      {/* "Gráfico" de barras horizontais */}
      <Card>
        <SectionTitle icon={TrendingUp} hint={`${total} colaborador(es) cadastrado(s)`}>
          Colaboradores por nível
        </SectionTitle>
        <div className="space-y-4">
          {niveis.map((n) => (
            <div key={n.id} className="flex items-center gap-4">
              <span className="w-40 shrink-0 text-sm text-silver">{n.label}</span>
              <div className="h-7 flex-1 overflow-hidden rounded-lg bg-line/40">
                <div
                  className={`flex h-full items-center justify-end rounded-lg px-2 text-xs font-bold text-deep transition-all duration-700 ${n.cor}`}
                  style={{ width: `${(distribuicao[n.id] / maxBar) * 100}%` }}
                >
                  {distribuicao[n.id] > 0 ? distribuicao[n.id] : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Mapeamento das duplas ativas */}
      <Card>
        <SectionTitle icon={Users} hint="Mentor (N2) ↔ afilhado (N1) da mesma trilha">
          Duplas de mentoria ativas
        </SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-silver">
                <th className="pb-3 font-semibold">Mentor (N2)</th>
                <th className="pb-3 font-semibold">Afilhado (N1)</th>
                <th className="pb-3 font-semibold">Trilha</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/50">
              {ativas.map((m) => {
                const mentor = porUid[m.mentorId];
                const afilhado = porUid[m.menteeId];
                return (
                  <tr key={m.id} className="text-ice">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <Iniciais nome={mentor?.nome || '?'} />
                        <span className="font-medium">{mentor?.nome || m.mentorId}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <Iniciais nome={afilhado?.nome || '?'} />
                        <span className="font-medium">{afilhado?.nome || m.menteeId}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-deep/50 px-2.5 py-1 text-xs text-silver">
                        {nomeTrilha[m.trackId] || m.trackId}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                        Ativa
                      </span>
                    </td>
                  </tr>
                );
              })}
              {!ativas.length && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-silver">
                    Nenhuma dupla de mentoria ativa ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Lista detalhada de cada colaborador */}
      <Card>
        <SectionTitle icon={Users} hint={`Dados de cada colaborador (${total})`}>
          Colaboradores
        </SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-silver">
                <th className="pb-3 font-semibold">Colaborador</th>
                <th className="pb-3 font-semibold">Nível</th>
                <th className="pb-3 font-semibold">Trilha</th>
                <th className="pb-3 font-semibold">Progresso</th>
                <th className="pb-3 text-center font-semibold">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/50">
              {usuarios
                .slice()
                .sort((a, b) => (b.nivelAtual ?? 0) - (a.nivelAtual ?? 0) || (a.nome || '').localeCompare(b.nome || ''))
                .map((u) => {
                  const pct = pctDe(u);
                  return (
                    <tr key={u.uid} className="text-ice">
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <Iniciais nome={u.nome || '?'} />
                          <div className="min-w-0">
                            <p className="truncate font-medium">{u.nome}</p>
                            <p className="truncate text-xs text-silver">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <NivelChip nivel={`N${u.nivelAtual ?? 0}`} />
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center rounded-full border border-line bg-deep/50 px-2.5 py-1 text-xs text-silver">
                          {nomeTrilha[u.trilhaAtivaId] || u.trilhaAtivaId || '—'}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20">
                            <ProgressBar value={pct} accent />
                          </div>
                          <span className="text-xs font-semibold text-accent">{pct}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        {u.admin ? (
                          <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                            Admin
                          </span>
                        ) : (
                          <span className="text-silver/40">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              {!usuarios.length && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-silver">
                    Nenhum colaborador cadastrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// =====================================================================
// SELETOR DE PERFIL (Simulador no topo) + LAYOUT PRINCIPAL
// Sessão via Firebase Auth; Nível carregado ao vivo do Firestore.
// =====================================================================
export default function FormacaoDeTalentosApp() {
  const [perfil, setPerfil] = useState('INTRO');
  const [authUser, setAuthUser] = useState(null); // usuário do Firebase Auth
  const [profile, setProfile] = useState(null); // documento `users` (Firestore)
  const [carregandoAuth, setCarregandoAuth] = useState(true);

  // Observa a sessão de autenticação.
  useEffect(() => {
    const unsub = observarAuth((u) => {
      setAuthUser(u);
      setCarregandoAuth(false);
      if (u) setPerfil('INTRO'); // inicia na tela de Apresentação/onboarding
      else setProfile(null);
    });
    return () => unsub && unsub();
  }, []);

  // Assina o perfil do Firestore em tempo real (Nível ao vivo).
  useEffect(() => {
    if (!authUser?.uid) return undefined;
    const unsub = observarPerfil(authUser.uid, (p) => setProfile(p));
    return () => unsub && unsub();
  }, [authUser]);

  const handleLogout = async () => {
    await sair();
  };

  // Acesso rápido de teste: entra com um perfil demo e abre a visão certa.
  const handleDevLogin = async (perfilId, demoProfile) => {
    await loginDemo(demoProfile);
    setPerfil(perfilId);
  };

  // Barra de teste só no modo demo (sem Firebase real). Com Firebase, some.
  const isDev = import.meta.env.DEV && !isFirebaseConfigured;

  // Splash enquanto resolve o estado de auth.
  if (carregandoAuth) {
    return (
      <div className="grid min-h-screen place-items-center bg-deep text-silver">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  const devBar = isDev ? (
    <DevAccessBar
      onSelect={handleDevLogin}
      onLogout={handleLogout}
      currentPerfil={perfil}
      autenticado={Boolean(authUser)}
    />
  ) : null;

  // Não autenticado → tela de Login (o observador acima faz o redirect).
  if (!authUser) {
    return (
      <>
        <Login />
        {devBar}
      </>
    );
  }

  const usuario = {
    nome: profile?.nome || authUser.displayName || authUser.email?.split('@')[0],
    email: profile?.email || authUser.email,
  };
  const nivelAtual = typeof profile?.nivelAtual === 'number' ? profile.nivelAtual : undefined;

  // Admin: no modo demo qualquer um testa; no Firebase real, só quem tem admin=true.
  const isAdmin = !isFirebaseConfigured || profile?.admin === true;
  const perfisVisiveis = isAdmin
    ? [...PERFIS, ...PERFIS_ADMIN, { id: 'ADMIN', label: 'Admin', sub: 'Gerenciar', icon: Settings }]
    : PERFIS;

  const views = {
    INTRO: <ApresentacaoView onStart={() => setPerfil('MINHA')} nomeUsuario={usuario.nome} />,
    MINHA: <MinhaTrilhaView uid={authUser.uid} profile={profile} />,
    GESTOR: <ViewGestor />,
    ADMIN: <AdminView currentUid={authUser.uid} />,
  };

  // Garante que o perfil ativo é uma aba visível (senão volta ao Início).
  const idsVisiveis = perfisVisiveis.map((p) => p.id);
  const perfilAtivo = idsVisiveis.includes(perfil) ? perfil : 'INTRO';

  return (
    <div className="relative min-h-screen app-atmosphere text-ice">
      {/* Fundo animado — orbes borrados flutuando (fixo enquanto rola) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="orb orb-a -left-40 top-[-12%] h-[32rem] w-[32rem] bg-primary/25" />
        <div className="orb orb-b right-[-12%] top-1/4 h-[36rem] w-[36rem] bg-accent/15" />
        <div className="orb orb-c bottom-[-18%] left-1/3 h-[28rem] w-[28rem] bg-primary/15" />
      </div>

      <div className="relative z-10">
        <Navbar
          perfil={perfilAtivo}
          setPerfil={setPerfil}
          perfis={perfisVisiveis}
          usuario={usuario}
          nivelAtual={nivelAtual}
          onLogout={handleLogout}
        />

        {/* Conteúdo (padding-bottom extra para não ficar sob a barra de teste) */}
        <main className={`mx-auto max-w-6xl px-4 py-8 sm:px-6 ${isDev ? 'pb-24' : ''}`}>
          {views[perfilAtivo]}
        </main>

        {/* Rodapé */}
        <footer className={`border-t border-white/10 py-6 text-center text-xs text-silver ${isDev ? 'mb-12' : ''}`}>
          Zello · Formação de Talentos · Nivelamento e mentoria automatizados
        </footer>
      </div>

      {devBar}
    </div>
  );
}
