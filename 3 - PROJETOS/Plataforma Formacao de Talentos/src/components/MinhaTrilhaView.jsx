// =====================================================================
// MinhaTrilhaView.jsx — A jornada REAL do usuário logado (Firebase).
// Lê a trilha do usuário (tracks) + seu progresso (user_progress),
// permite marcar módulos como concluídos e AVANÇAR de nível de verdade:
//   N0 concluído  -> escolhe 1 trilha técnica e vira N1
//   N1 certificado -> vira N2 e recebe um afilhado automaticamente
//   N2 (mentor) -> ao afilhado se certificar, é promovido a N3
// =====================================================================
import React, { useEffect, useMemo, useState } from 'react';
import {
  Loader2,
  CheckCircle2,
  Circle,
  ChevronDown,
  Award,
  Rocket,
  Users,
  UserRound,
  ShieldCheck,
  Trophy,
  ExternalLink,
  PlayCircle,
} from 'lucide-react';
import {
  getTrack,
  getUserProgress,
  setModuleProgress,
  updateUserLevel,
  atualizarUsuario,
  listarTrilhas,
  listarMentorias,
  getUserProfile,
  autoVincularAfilhado,
  reconciliarPromocaoMentor,
} from '../services/dbService.js';

const NIVEL_LABEL = { 0: 'Nível 0', 1: 'Nível 1', 2: 'Nível 2', 3: 'Nível 3' };

function Bar({ value }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-line/60">
      <div
        className="h-full rounded-full bg-accent transition-all duration-700"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export default function MinhaTrilhaView({ uid, profile }) {
  const nivel = profile?.nivelAtual ?? 0;
  if (nivel <= 1) return <Estudante uid={uid} profile={profile} nivel={nivel} />;
  if (nivel === 2) return <Mentor uid={uid} profile={profile} />;
  return <Formado profile={profile} />;
}

// =====================================================================
// ESTUDANTE (Nível 0 e 1) — estuda a trilha e avança
// =====================================================================
function Estudante({ uid, profile, nivel }) {
  const [trilha, setTrilha] = useState(null);
  const [feitos, setFeitos] = useState(new Set()); // ordens concluídas
  const [carregando, setCarregando] = useState(true);
  const [aberto, setAberto] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState('');
  const [tecnicas, setTecnicas] = useState([]);
  const [escolhida, setEscolhida] = useState('');

  const trackId = profile?.trilhaAtivaId;

  useEffect(() => {
    let vivo = true;
    (async () => {
      setCarregando(true);
      try {
        const t = await getTrack(trackId);
        const prog = await getUserProgress(uid);
        if (!vivo) return;
        setTrilha(t);
        const concluidos = new Set(
          prog.filter((p) => p.trackId === trackId && p.completed).map((p) => p.moduleId),
        );
        setFeitos(concluidos);
        if (nivel === 0) {
          const todas = await listarTrilhas();
          if (vivo) setTecnicas(todas.filter((x) => x.nivel === 1).sort((a, b) => a.ordem - b.ordem));
        }
      } catch (e) {
        if (e?.code !== 'permission-denied') console.warn('[minha-trilha]', e?.code || e);
      } finally {
        if (vivo) setCarregando(false);
      }
    })();
    return () => {
      vivo = false;
    };
  }, [uid, trackId, nivel]);

  const modulos = useMemo(
    () => (trilha?.modulos || []).slice().sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)),
    [trilha],
  );
  const total = modulos.length;
  const feitosCount = modulos.filter((m) => feitos.has(m.ordem)).length;
  const pct = total ? Math.round((feitosCount / total) * 100) : 0;
  const completou = total > 0 && feitosCount === total;

  const toggle = async (m) => {
    const novo = !feitos.has(m.ordem);
    setFeitos((s) => {
      const n = new Set(s);
      novo ? n.add(m.ordem) : n.delete(m.ordem);
      return n;
    });
    try {
      await setModuleProgress({ userId: uid, trackId, moduleId: m.ordem, completed: novo });
    } catch (e) {
      setMsg('Erro ao salvar progresso: ' + e.message);
      setFeitos((s) => {
        const n = new Set(s);
        novo ? n.delete(m.ordem) : n.add(m.ordem);
        return n;
      });
    }
  };

  // Avançar de nível
  const avancarN0 = async () => {
    if (!escolhida) {
      setMsg('Escolha uma trilha técnica para continuar.');
      return;
    }
    setSalvando(true);
    try {
      await atualizarUsuario(uid, { nivelAtual: 1, trilhaAtivaId: escolhida });
      // o perfil atualiza ao vivo (onSnapshot) e a tela recarrega sozinha
    } catch (e) {
      setMsg('Erro ao avançar: ' + e.message);
    } finally {
      setSalvando(false);
    }
  };

  const certificarN1 = async () => {
    setSalvando(true);
    try {
      await updateUserLevel(uid, 2);
      await autoVincularAfilhado(uid, trackId);
    } catch (e) {
      setMsg('Erro ao certificar: ' + e.message);
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="grid place-items-center py-20 text-silver">
        <Loader2 size={26} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!trilha) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-silver">
        Sua trilha ({trackId}) ainda não foi encontrada. Fale com o administrador.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Cabeçalho + progresso real */}
      <div className="glass-panel rounded-2xl p-6">
        <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
          {NIVEL_LABEL[nivel]}
        </span>
        <h1 className="text-2xl font-extrabold text-ice">{trilha.nome}</h1>
        {trilha.descricao && <p className="mt-1 text-sm text-silver">{trilha.descricao}</p>}
        <div className="mt-4 max-w-md">
          <div className="mb-1.5 flex justify-between text-xs text-silver">
            <span>Seu progresso ({feitosCount}/{total} módulos)</span>
            <span className="font-semibold text-accent">{pct}%</span>
          </div>
          <Bar value={pct} />
        </div>
      </div>

      {msg && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          {msg}
        </div>
      )}

      {/* Módulos reais com marcação de conclusão */}
      <div className="space-y-3">
        {modulos.map((m) => {
          const feito = feitos.has(m.ordem);
          const abertoAqui = aberto === m.ordem;
          return (
            <div
              key={m.ordem}
              className={`overflow-hidden rounded-xl border transition-colors ${
                feito ? 'border-accent/40 bg-deep/40' : 'border-line bg-elevated'
              }`}
            >
              <div className="flex items-center gap-3 p-4">
                <button
                  onClick={() => toggle(m)}
                  title={feito ? 'Marcar como não concluído' : 'Marcar como concluído'}
                  className={feito ? 'text-accent' : 'text-silver hover:text-ice'}
                >
                  {feito ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                <button
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  onClick={() => setAberto(abertoAqui ? null : m.ordem)}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-xs font-bold text-silver">
                    {m.ordem}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ice">{m.titulo}</p>
                    {m.descricao && <p className="truncate text-xs text-silver">{m.descricao}</p>}
                  </div>
                </button>
                {(m.conteudos || []).length > 0 && (
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-silver transition-transform ${abertoAqui ? 'rotate-180 text-accent' : ''}`}
                  />
                )}
              </div>
              {abertoAqui && (m.conteudos || []).length > 0 && (
                <div className="animate-fade-up space-y-2 border-t border-line/60 px-4 py-3 pl-14">
                  {m.conteudos.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <PlayCircle size={15} className="shrink-0 text-primary" />
                      <span className="text-silver">{c.titulo || c.tipo}</span>
                      {c.duracao && <span className="text-xs text-silver/60">· {c.duracao}</span>}
                      {c.url && (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-auto inline-flex items-center gap-1 text-xs text-accent hover:underline"
                        >
                          <ExternalLink size={12} /> abrir
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Avanço de nível */}
      {completou && nivel === 0 && (
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-bold text-ice">🎉 Você concluiu o Nível 0!</h3>
          <p className="mt-1 text-sm text-silver">
            Agora escolha a sua <strong className="text-ice">trilha técnica</strong> para começar o Nível 1.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <select
              value={escolhida}
              onChange={(e) => setEscolhida(e.target.value)}
              className="flex-1 rounded-lg border border-white/10 bg-deep px-4 py-3 text-sm text-ice focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Escolha uma trilha…</option>
              {tecnicas.map((t) => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
            <button
              onClick={avancarN0}
              disabled={salvando}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white shadow-glow transition-all hover:bg-primary-hover disabled:opacity-60"
            >
              {salvando ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
              Começar Nível 1
            </button>
          </div>
        </div>
      )}

      {completou && nivel === 1 && (
        <div className="glass-panel rounded-2xl p-6 text-center">
          <h3 className="text-lg font-bold text-ice">Pronto para a Certificação N1!</h3>
          <p className="mx-auto mt-1 max-w-lg text-sm text-silver">
            Ao certificar, você sobe para o <strong className="text-ice">Nível 2</strong>, entra em um
            Squad e recebe um afilhado(a) para mentorar.
          </p>
          <button
            onClick={certificarN1}
            disabled={salvando}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-deep shadow-glow-accent transition-all hover:bg-accent-hover disabled:opacity-60"
          >
            {salvando ? <Loader2 size={16} className="animate-spin" /> : <Award size={16} />}
            Certificar e virar mentor
          </button>
        </div>
      )}
    </div>
  );
}

// =====================================================================
// MENTOR (Nível 2) — acompanha o afilhado real
// =====================================================================
function Mentor({ uid, profile }) {
  const [carregando, setCarregando] = useState(true);
  const [afilhado, setAfilhado] = useState(null);
  const [pctAfilhado, setPctAfilhado] = useState(0);
  const [promovido, setPromovido] = useState(false);

  useEffect(() => {
    let vivo = true;
    (async () => {
      setCarregando(true);
      try {
        // 1. Reconcilia: se o afilhado já se formou, sobe para N3.
        const subiu = await reconciliarPromocaoMentor(uid, 2);
        if (subiu) {
          if (vivo) setPromovido(true);
          return; // o perfil atualiza ao vivo e a tela troca para Formado
        }
        // 2. Carrega o afilhado ativo.
        const mentorias = await listarMentorias();
        const minha = mentorias.find((m) => m.mentorId === uid && m.status === 'ACTIVE');
        if (!minha) {
          if (vivo) setAfilhado(null);
          return;
        }
        const perfilAf = await getUserProfile(minha.menteeId);
        const progAf = await getUserProgress(minha.menteeId);
        const track = await getTrack(minha.trackId);
        const totalMods = (track?.modulos || []).length || 1;
        const feitos = progAf.filter((p) => p.trackId === minha.trackId && p.completed).length;
        if (vivo) {
          setAfilhado({ ...perfilAf, trilha: track?.nome });
          setPctAfilhado(Math.round((feitos / totalMods) * 100));
        }
      } catch (e) {
        if (e?.code !== 'permission-denied') console.warn('[mentor]', e?.code || e);
      } finally {
        if (vivo) setCarregando(false);
      }
    })();
    return () => {
      vivo = false;
    };
  }, [uid]);

  if (carregando) {
    return (
      <div className="grid place-items-center py-20 text-silver">
        <Loader2 size={26} className="animate-spin text-primary" />
      </div>
    );
  }

  if (promovido) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center">
        <Trophy size={32} className="mx-auto mb-2 text-emerald-300" />
        <h2 className="text-xl font-bold text-ice">Parabéns! Você foi promovido a Nível 3.</h2>
        <p className="mt-1 text-sm text-silver">Seu afilhado se certificou. Atualizando…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-violet-500/15 text-violet-300">
          <Users size={20} />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-ice">Squad + Mentoria</h1>
          <p className="text-sm text-silver">Leve seu afilhado(a) até a certificação para virar Especialista.</p>
        </div>
      </div>

      {!afilhado ? (
        <div className="glass-panel rounded-2xl p-8 text-center">
          <UserRound size={28} className="mx-auto mb-2 text-accent" />
          <h2 className="text-lg font-bold text-ice">Nenhum afilhado vinculado ainda</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-silver">
            Assim que um aluno do Nível 1 da sua trilha estiver disponível, ele será vinculado a você.
          </p>
        </div>
      ) : (
        <>
          <div className="glass-panel rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Seu afilhado(a)</p>
            <h2 className="text-xl font-bold text-ice">{afilhado.nome}</h2>
            <p className="text-sm text-silver">{afilhado.email} · {afilhado.trilha}</p>
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-xs text-silver">
                <span>Progresso do afilhado</span>
                <span className="font-semibold text-accent">{pctAfilhado}%</span>
              </div>
              <Bar value={pctAfilhado} />
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="font-bold text-ice">Seu caminho ao Nível 3</h3>
            <p className="mt-1 text-sm text-silver">
              Quando <strong className="text-ice">{afilhado.nome}</strong> for certificado(a), você é
              promovido(a) automaticamente a <strong className="text-emerald-300">Especialista de Suporte</strong>.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// =====================================================================
// FORMADO (Nível 3)
// =====================================================================
function Formado({ profile }) {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="glass-panel rounded-2xl p-8">
        <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          <ShieldCheck size={14} /> Formado
        </span>
        <h1 className="text-2xl font-extrabold text-ice">Especialista de Suporte Técnico</h1>
        <p className="mt-2 max-w-2xl text-silver">
          Parabéns, {profile?.nome?.split(' ')[0] || 'colaborador'}! Você concluiu a jornada: dominou
          uma tecnologia, formou um afilhado e agora é referência consultiva do setor.
        </p>
      </div>
    </div>
  );
}
