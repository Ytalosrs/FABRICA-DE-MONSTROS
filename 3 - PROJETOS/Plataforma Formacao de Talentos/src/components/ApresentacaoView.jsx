// =====================================================================
// ApresentacaoView.jsx — Dashboard de Apresentação / Onboarding.
// Explica o que é a Formação de Talentos, a jornada completa (N0→N3)
// e onde o colaborador chega ao concluir tudo. Exibido no início.
// =====================================================================
import React from 'react';
import {
  Sparkles,
  Layers,
  Users,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Award,
  Rocket,
  BookOpen,
  Trophy,
  CheckCircle2,
  Compass,
} from 'lucide-react';

// Etapas da jornada (níveis encadeados).
const JORNADA = [
  {
    nivel: 'Nível 0',
    titulo: 'Introdução — Trilha Tech 360',
    icon: Sparkles,
    desc: 'Você começa do zero: alfabetização digital, história da TI, lógica e fundamentos de dados. São 5 módulos + a Avaliação de Passagem.',
    tag: 'Base obrigatória para todos',
  },
  {
    nivel: 'Nível 1',
    titulo: 'Trilha Técnica',
    icon: Layers,
    desc: 'Escolhe 1 entre 10 trilhas (FlutterFlow, Kubernetes, IA Agêntica, Mulesoft, Qlik, Salesforce…), estuda os módulos e conquista a Certificação N1.',
    tag: 'Você escolhe sua especialidade',
  },
  {
    nivel: 'Nível 2',
    titulo: 'Squad + Mentoria',
    icon: Users,
    desc: 'Entra em um Squad e recebe automaticamente um afilhado do Nível 1 da mesma trilha. Sua missão: mentorá-lo até a certificação.',
    tag: 'Você ensina o que aprendeu',
  },
  {
    nivel: 'Nível 3',
    titulo: 'Especialista de Suporte',
    icon: ShieldCheck,
    desc: 'Quando seu afilhado é certificado, você é promovido automaticamente a Especialista — consultor técnico do setor, atendendo os Squads.',
    tag: 'O destino da jornada',
  },
];

const COMO_FUNCIONA = [
  { icon: BookOpen, titulo: 'Estude', desc: 'Módulos passo a passo, no seu ritmo.' },
  { icon: Award, titulo: 'Certifique-se', desc: 'Prove seu conhecimento e suba de nível.' },
  { icon: Users, titulo: 'Apadrinhe', desc: 'Mentore um novo colega da sua trilha.' },
  { icon: ShieldCheck, titulo: 'Squad', desc: 'Um novo desafio te espera: atue como especialista dentro dos Squads.' },
];

export default function ApresentacaoView({ onStart, nomeUsuario }) {
  const primeiroNome = (nomeUsuario || '').split(' ')[0];

  return (
    <div className="space-y-10 animate-fade-up">
      {/* HERO */}
      <section className="glass-panel overflow-hidden rounded-2xl p-8 sm:p-10">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles size={14} /> Bem-vindo(a){primeiroNome ? `, ${primeiroNome}` : ''} à Zello
        </span>
        <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-ice sm:text-4xl">
          Sua jornada da <span className="text-primary">estaca zero</span> ao{' '}
          <span className="text-primary">especialista</span>.
        </h1>
        <p className="mt-4 max-w-2xl text-silver">
          A <strong className="text-ice">Formação de Talentos</strong> é a trilha de crescimento da
          Zello: um caminho estruturado que leva pessoas <strong className="text-ice">sem base em
          tecnologia</strong> até o nível de <strong className="text-ice">especialistas</strong> —
          aprendendo, sendo certificadas e, depois, ensinando quem vem atrás.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            onClick={onStart}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white shadow-glow transition-all hover:bg-primary-hover active:scale-[0.99]"
          >
            <Rocket size={17} /> Começar minha jornada
          </button>
          <span className="text-xs text-silver">
            Leva ~10 minutos para entender como tudo funciona.
          </span>
        </div>

        {/* Números-resumo */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">
          {[
            { n: '4', l: 'níveis encadeados' },
            { n: '10', l: 'trilhas técnicas' },
            { n: '1', l: 'afilhado para mentorar' },
            { n: '100%', l: 'promoção automática' },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-2xl font-extrabold text-primary sm:text-3xl">{s.n}</p>
              <p className="text-xs text-silver">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* A JORNADA EM 4 NÍVEIS */}
      <section>
        <div className="mb-5 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
            <Compass size={18} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-ice">A jornada em 4 níveis</h2>
            <p className="text-xs text-silver">Cada nível desbloqueia o próximo, de forma automática.</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          {JORNADA.map((etapa, i) => (
            <div key={etapa.nivel} className="relative flex">
              <div className="glass-panel flex w-full flex-col rounded-2xl p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
                    <etapa.icon size={22} />
                  </span>
                  <span className="text-xs font-bold text-silver">{String(i).padStart(2, '0')}</span>
                </div>
                <p className="text-xs font-bold uppercase tracking-wide text-primary">{etapa.nivel}</p>
                <h3 className="mt-0.5 font-bold text-ice">{etapa.titulo}</h3>
                <p className="mt-2 flex-1 text-sm text-silver">{etapa.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent">
                  <CheckCircle2 size={12} /> {etapa.tag}
                </span>
              </div>
              {/* Seta de conexão (desktop) */}
              {i < JORNADA.length - 1 && (
                <ArrowRight
                  size={20}
                  className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-primary/60 lg:block"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ONDE VOCÊ VAI CHEGAR */}
      <section className="glass-panel overflow-hidden rounded-2xl p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary/20 text-primary ring-1 ring-primary/30">
            <Trophy size={32} />
          </span>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">Onde você vai chegar</p>
            <h2 className="mt-1 text-2xl font-extrabold text-ice">Especialista de Suporte Técnico</h2>
            <p className="mt-2 max-w-2xl text-silver">
              Ao final da jornada, você domina uma tecnologia, já formou outra pessoa e se torna
              referência consultiva do seu setor — resolvendo dúvidas dos Squads e sustentando o
              conhecimento dentro da fábrica. De aluno a professor, de professor a especialista.
            </p>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section>
        <div className="mb-5 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
            <GraduationCap size={18} />
          </span>
          <h2 className="text-lg font-bold text-ice">Como funciona, na prática</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COMO_FUNCIONA.map((c, i) => (
            <div key={c.titulo} className="glass-panel rounded-2xl p-5">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
                <c.icon size={20} />
              </span>
              <p className="mt-3 text-xs font-bold text-silver">Passo {i + 1}</p>
              <h3 className="font-bold text-ice">{c.titulo}</h3>
              <p className="mt-1 text-sm text-silver">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="glass-panel flex flex-col items-center gap-4 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-extrabold text-ice">Pronto(a) para começar?</h2>
        <p className="max-w-xl text-silver">
          Sua jornada começa no <strong className="text-ice">Nível 0 — Trilha Tech 360</strong>.
          Um passo de cada vez, e você chega lá.
        </p>
        <button
          onClick={onStart}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow-glow transition-all hover:bg-primary-hover active:scale-[0.99]"
        >
          <Rocket size={17} /> Ir para o Nível 0
        </button>
      </section>
    </div>
  );
}
