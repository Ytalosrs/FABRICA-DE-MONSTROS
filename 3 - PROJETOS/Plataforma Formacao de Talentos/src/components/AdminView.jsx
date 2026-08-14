// =====================================================================
// AdminView.jsx — Painel de administração (só para admins).
// Gerencia Trilhas (+ módulos/conteúdos), Colaboradores e Mentorias.
// =====================================================================
import React, { useEffect, useMemo, useState } from 'react';
import {
  Layers,
  Users,
  Handshake,
  Plus,
  Trash2,
  Save,
  X,
  Pencil,
  Loader2,
  ChevronRight,
  Upload,
  Paperclip,
  ExternalLink,
} from 'lucide-react';
import {
  listarTrilhas,
  salvarTrilha,
  excluirTrilha,
  listarUsuarios,
  atualizarUsuario,
  listarMentorias,
  salvarMentoria,
  excluirMentoria,
} from '../services/dbService.js';
import { criarColaborador } from '../services/authService.js';
import {
  uploadArquivo,
  categoriaDoArquivo,
  formatarTamanho,
  UPLOAD_HABILITADO,
} from '../services/storageService.js';

const inputCls =
  'w-full rounded-lg border border-white/10 bg-deep px-3 py-2 text-sm text-ice placeholder:text-silver/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30';
const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-glow transition-all hover:bg-primary-hover active:scale-[0.99] disabled:opacity-60';
const btnGhost =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-silver transition-colors hover:border-primary hover:text-primary';
const NIVEIS = [0, 1, 2, 3];

export default function AdminView({ currentUid }) {
  const [aba, setAba] = useState('trilhas');
  const [trilhas, setTrilhas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mentorias, setMentorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [msg, setMsg] = useState(null); // { tipo: 'ok'|'erro', texto }

  const flash = (tipo, texto) => {
    setMsg({ tipo, texto });
    setTimeout(() => setMsg(null), 3500);
  };

  const recarregar = async () => {
    setCarregando(true);
    try {
      const [t, u, m] = await Promise.all([listarTrilhas(), listarUsuarios(), listarMentorias()]);
      t.sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
      setTrilhas(t);
      setUsuarios(u);
      setMentorias(m);
    } catch (e) {
      flash('erro', 'Falha ao carregar dados: ' + e.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    recarregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const abas = [
    { id: 'trilhas', label: 'Trilhas', icon: Layers },
    { id: 'colaboradores', label: 'Colaboradores', icon: Users },
    { id: 'mentorias', label: 'Mentorias', icon: Handshake },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ice">Administração</h1>
          <p className="text-sm text-silver">Gerencie trilhas, colaboradores e mentorias.</p>
        </div>
        <button className={btnGhost} onClick={recarregar}>
          <Loader2 size={15} className={carregando ? 'animate-spin' : ''} /> Atualizar
        </button>
      </div>

      {/* Abas */}
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/10 bg-elevated p-1.5">
        {abas.map((a) => (
          <button
            key={a.id}
            onClick={() => setAba(a.id)}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
              aba === a.id ? 'bg-primary text-white shadow-glow' : 'text-silver hover:text-ice'
            }`}
          >
            <a.icon size={16} /> {a.label}
          </button>
        ))}
      </div>

      {/* Mensagem */}
      {msg && (
        <div
          className={`rounded-lg border px-4 py-2.5 text-sm ${
            msg.tipo === 'ok'
              ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
              : 'border-red-500/30 bg-red-500/10 text-red-300'
          }`}
        >
          {msg.texto}
        </div>
      )}

      {carregando ? (
        <div className="grid place-items-center py-16 text-silver">
          <Loader2 size={26} className="animate-spin text-primary" />
        </div>
      ) : (
        <>
          {aba === 'trilhas' && (
            <TrilhasAdmin
              trilhas={trilhas}
              onSaved={recarregar}
              flash={flash}
            />
          )}
          {aba === 'colaboradores' && (
            <ColaboradoresAdmin
              usuarios={usuarios}
              trilhas={trilhas}
              onSaved={recarregar}
              flash={flash}
              currentUid={currentUid}
            />
          )}
          {aba === 'mentorias' && (
            <MentoriasAdmin
              usuarios={usuarios}
              mentorias={mentorias}
              onSaved={recarregar}
              flash={flash}
            />
          )}
        </>
      )}
    </div>
  );
}

// =====================================================================
// TRILHAS
// =====================================================================
function trilhaVazia() {
  return { id: '', nome: '', nivel: 1, ordem: 99, icone: 'Layers', descricao: '', modulos: [] };
}

function TrilhasAdmin({ trilhas, onSaved, flash }) {
  const [editando, setEditando] = useState(null); // objeto trilha ou null
  const [novo, setNovo] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const abrirNova = () => {
    setNovo(true);
    setEditando(trilhaVazia());
  };
  const abrirEdicao = (t) => {
    setNovo(false);
    setEditando(JSON.parse(JSON.stringify(t)));
  };

  const salvar = async () => {
    if (!editando.id.trim()) return flash('erro', 'Informe um ID (sem espaços) para a trilha.');
    if (!editando.nome.trim()) return flash('erro', 'Informe o nome da trilha.');
    setSalvando(true);
    try {
      await salvarTrilha({
        ...editando,
        id: editando.id.trim(),
        nivel: Number(editando.nivel),
        ordem: Number(editando.ordem),
      });
      flash('ok', 'Trilha salva.');
      setEditando(null);
      onSaved();
    } catch (e) {
      flash('erro', 'Erro ao salvar: ' + e.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id) => {
    if (!confirm(`Excluir a trilha "${id}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await excluirTrilha(id);
      flash('ok', 'Trilha excluída.');
      onSaved();
    } catch (e) {
      flash('erro', 'Erro ao excluir: ' + e.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className={btnPrimary} onClick={abrirNova}>
          <Plus size={16} /> Nova trilha
        </button>
      </div>

      <div className="grid gap-3">
        {trilhas.map((t) => (
          <div
            key={t.id}
            className="glass-panel flex items-center justify-between gap-4 rounded-xl p-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                  Nível {t.nivel}
                </span>
                <p className="truncate font-bold text-ice">{t.nome}</p>
              </div>
              <p className="mt-0.5 truncate text-xs text-silver">
                {t.id} · {(t.modulos || []).length} módulo(s)
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button className={btnGhost} onClick={() => abrirEdicao(t)}>
                <Pencil size={14} /> Editar
              </button>
              <button
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10"
                onClick={() => excluir(t.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editando && (
        <TrilhaEditor
          trilha={editando}
          setTrilha={setEditando}
          novo={novo}
          salvando={salvando}
          onSalvar={salvar}
          onFechar={() => setEditando(null)}
          flash={flash}
        />
      )}
    </div>
  );
}

function TrilhaEditor({ trilha, setTrilha, novo, salvando, onSalvar, onFechar, flash }) {
  const [enviando, setEnviando] = useState(null); // chave `${mi}-${ci}` em upload
  const set = (campo, valor) => setTrilha((t) => ({ ...t, [campo]: valor }));

  // Upload de arquivo para um conteúdo (preenche url + metadados).
  const onUpload = async (mi, ci, file) => {
    if (!file) return;
    setEnviando(`${mi}-${ci}`);
    try {
      const res = await uploadArquivo(file, `trilhas/${trilha.id || 'nova'}`);
      const tipoAuto = categoriaDoArquivo(res.tipo);
      setTrilha((t) => {
        const modulos = [...t.modulos];
        const conteudos = [...modulos[mi].conteudos];
        const atual = conteudos[ci] || {};
        conteudos[ci] = {
          ...atual,
          url: res.url,
          arquivoNome: res.nome,
          arquivoCaminho: res.caminho || null,
          arquivoTamanho: res.tamanho || null,
          tipo: !atual.tipo || atual.tipo === 'link' ? tipoAuto : atual.tipo,
        };
        modulos[mi] = { ...modulos[mi], conteudos };
        return { ...t, modulos };
      });
      flash?.('ok', res.demo ? 'Arquivo carregado (modo demo, não persiste).' : 'Arquivo enviado.');
    } catch (e) {
      flash?.('erro', 'Falha no upload: ' + e.message);
    } finally {
      setEnviando(null);
    }
  };

  const addModulo = () =>
    setTrilha((t) => ({
      ...t,
      modulos: [
        ...(t.modulos || []),
        { ordem: (t.modulos?.length || 0) + 1, titulo: '', descricao: '', conteudos: [] },
      ],
    }));
  const setModulo = (i, campo, valor) =>
    setTrilha((t) => {
      const modulos = [...t.modulos];
      modulos[i] = { ...modulos[i], [campo]: valor };
      return { ...t, modulos };
    });
  const rmModulo = (i) =>
    setTrilha((t) => ({ ...t, modulos: t.modulos.filter((_, idx) => idx !== i) }));

  const addConteudo = (mi) =>
    setTrilha((t) => {
      const modulos = [...t.modulos];
      const conteudos = [...(modulos[mi].conteudos || []), { tipo: 'video', titulo: '', url: '', duracao: '' }];
      modulos[mi] = { ...modulos[mi], conteudos };
      return { ...t, modulos };
    });
  const setConteudo = (mi, ci, campo, valor) =>
    setTrilha((t) => {
      const modulos = [...t.modulos];
      const conteudos = [...modulos[mi].conteudos];
      conteudos[ci] = { ...conteudos[ci], [campo]: valor };
      modulos[mi] = { ...modulos[mi], conteudos };
      return { ...t, modulos };
    });
  const rmConteudo = (mi, ci) =>
    setTrilha((t) => {
      const modulos = [...t.modulos];
      modulos[mi] = { ...modulos[mi], conteudos: modulos[mi].conteudos.filter((_, idx) => idx !== ci) };
      return { ...t, modulos };
    });

  return (
    <div className="fixed inset-0 z-50 grid place-items-start overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="mx-auto my-8 w-full max-w-3xl rounded-2xl border border-white/10 bg-elevated p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ice">{novo ? 'Nova trilha' : 'Editar trilha'}</h3>
          <button onClick={onFechar} className="rounded-lg p-1.5 text-silver hover:bg-deep hover:text-ice">
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-silver">ID (sem espaços)</label>
            <input
              className={inputCls}
              value={trilha.id}
              disabled={!novo}
              onChange={(e) => set('id', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="ex: flutterflow"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-silver">Nome</label>
            <input className={inputCls} value={trilha.nome} onChange={(e) => set('nome', e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-silver">Nível</label>
            <select className={inputCls} value={trilha.nivel} onChange={(e) => set('nivel', e.target.value)}>
              <option value={0}>Nível 0</option>
              <option value={1}>Nível 1</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-silver">Ordem</label>
            <input
              type="number"
              className={inputCls}
              value={trilha.ordem}
              onChange={(e) => set('ordem', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-silver">Descrição</label>
            <input
              className={inputCls}
              value={trilha.descricao}
              onChange={(e) => set('descricao', e.target.value)}
            />
          </div>
        </div>

        {/* Módulos */}
        <div className="mt-5 flex items-center justify-between">
          <h4 className="font-bold text-ice">Módulos</h4>
          <button className={btnGhost} onClick={addModulo}>
            <Plus size={14} /> Adicionar módulo
          </button>
        </div>

        <div className="mt-3 space-y-4">
          {(trilha.modulos || []).map((m, mi) => (
            <div key={mi} className="rounded-xl border border-white/10 bg-deep/40 p-4">
              <div className="flex items-start gap-2">
                <span className="mt-2 text-xs font-bold text-silver">{mi + 1}</span>
                <div className="flex-1 space-y-2">
                  <input
                    className={inputCls}
                    value={m.titulo}
                    onChange={(e) => setModulo(mi, 'titulo', e.target.value)}
                    placeholder="Título do módulo"
                  />
                  <input
                    className={inputCls}
                    value={m.descricao}
                    onChange={(e) => setModulo(mi, 'descricao', e.target.value)}
                    placeholder="Descrição curta"
                  />
                </div>
                <button
                  className="mt-1 rounded-lg border border-red-500/30 p-2 text-red-300 hover:bg-red-500/10"
                  onClick={() => rmModulo(mi)}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Conteúdos */}
              <div className="mt-3 space-y-3 pl-6">
                {(m.conteudos || []).map((c, ci) => (
                  <div key={ci} className="rounded-lg border border-white/10 bg-deep/50 p-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        className={`${inputCls} w-28`}
                        value={c.tipo || 'link'}
                        onChange={(e) => setConteudo(mi, ci, 'tipo', e.target.value)}
                      >
                        <option value="video">Vídeo</option>
                        <option value="texto">Texto</option>
                        <option value="quiz">Quiz</option>
                        <option value="pdf">PDF</option>
                        <option value="imagem">Imagem</option>
                        <option value="audio">Áudio</option>
                        <option value="arquivo">Arquivo</option>
                        <option value="link">Link</option>
                      </select>
                      <input
                        className={`${inputCls} min-w-[160px] flex-1`}
                        value={c.titulo}
                        onChange={(e) => setConteudo(mi, ci, 'titulo', e.target.value)}
                        placeholder="Título do conteúdo"
                      />
                      <input
                        className={`${inputCls} w-24`}
                        value={c.duracao}
                        onChange={(e) => setConteudo(mi, ci, 'duracao', e.target.value)}
                        placeholder="12min"
                      />
                      <button
                        className="rounded-lg border border-red-500/30 p-2 text-red-300 hover:bg-red-500/10"
                        onClick={() => rmConteudo(mi, ci)}
                        title="Remover conteúdo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Link OU upload de arquivo */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <input
                        className={`${inputCls} min-w-[200px] flex-1`}
                        value={c.url || ''}
                        onChange={(e) => setConteudo(mi, ci, 'url', e.target.value)}
                        placeholder="Cole o link do conteúdo (YouTube, Google Drive, site…)"
                      />
                      {UPLOAD_HABILITADO && (
                        <label
                          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white ${
                            enviando === `${mi}-${ci}` ? 'pointer-events-none opacity-70' : ''
                          }`}
                        >
                          {enviando === `${mi}-${ci}` ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Upload size={13} />
                          )}
                          Enviar arquivo
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              onUpload(mi, ci, e.target.files?.[0]);
                              e.target.value = '';
                            }}
                          />
                        </label>
                      )}
                      {c.url ? (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                        >
                          <ExternalLink size={12} /> abrir
                        </a>
                      ) : null}
                    </div>

                    {/* Nome do arquivo enviado */}
                    {c.arquivoNome && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-emerald-300">
                        <Paperclip size={12} />
                        {c.arquivoNome}
                        {c.arquivoTamanho ? (
                          <span className="text-silver">· {formatarTamanho(c.arquivoTamanho)}</span>
                        ) : null}
                      </div>
                    )}
                  </div>
                ))}
                <button
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  onClick={() => addConteudo(mi)}
                >
                  <Plus size={12} /> Adicionar conteúdo
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button className={btnGhost} onClick={onFechar}>
            Cancelar
          </button>
          <button className={btnPrimary} onClick={onSalvar} disabled={salvando}>
            {salvando ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Salvar trilha
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// COLABORADORES
// =====================================================================
function ColaboradoresAdmin({ usuarios, trilhas, onSaved, flash, currentUid }) {
  const opcoesTrilha = useMemo(() => trilhas.map((t) => ({ id: t.id, nome: t.nome })), [trilhas]);
  const [novo, setNovo] = useState({ nome: '', email: '', senha: '', nivelAtual: 0, trilhaAtivaId: 'iniciante_n0' });
  const [criando, setCriando] = useState(false);

  const salvarLinha = async (u, campo, valor) => {
    try {
      const dados = { [campo]: campo === 'nivelAtual' ? Number(valor) : valor };
      await atualizarUsuario(u.uid, dados);
      flash('ok', `${u.nome}: ${campo} atualizado.`);
      onSaved();
    } catch (e) {
      flash('erro', 'Erro ao atualizar: ' + e.message);
    }
  };

  const alternarAdmin = async (u) => {
    const novoValor = !u.admin;
    try {
      await atualizarUsuario(u.uid, { admin: novoValor });
      flash('ok', `${u.nome} ${novoValor ? 'agora é admin' : 'não é mais admin'}.`);
      onSaved();
    } catch (e) {
      flash('erro', 'Erro ao alterar admin: ' + e.message);
    }
  };

  const criar = async () => {
    if (!novo.nome.trim() || !novo.email.trim() || novo.senha.length < 6) {
      return flash('erro', 'Preencha nome, e-mail e senha (mín. 6 caracteres).');
    }
    setCriando(true);
    try {
      await criarColaborador({
        nome: novo.nome.trim(),
        email: novo.email.trim(),
        senha: novo.senha,
        nivelAtual: Number(novo.nivelAtual),
        trilhaAtivaId: novo.trilhaAtivaId,
      });
      flash('ok', 'Colaborador criado.');
      setNovo({ nome: '', email: '', senha: '', nivelAtual: 0, trilhaAtivaId: 'iniciante_n0' });
      onSaved();
    } catch (e) {
      flash('erro', e.message);
    } finally {
      setCriando(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Novo colaborador */}
      <div className="glass-panel rounded-xl p-4">
        <h4 className="mb-3 font-bold text-ice">Novo colaborador</h4>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <input className={inputCls} placeholder="Nome" value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} />
          <input className={inputCls} placeholder="email@zello.tec.br" value={novo.email} onChange={(e) => setNovo({ ...novo, email: e.target.value })} />
          <input className={inputCls} type="password" placeholder="Senha temporária" value={novo.senha} onChange={(e) => setNovo({ ...novo, senha: e.target.value })} />
          <select className={inputCls} value={novo.nivelAtual} onChange={(e) => setNovo({ ...novo, nivelAtual: e.target.value })}>
            {NIVEIS.map((n) => (
              <option key={n} value={n}>Nível {n}</option>
            ))}
          </select>
          <select className={inputCls} value={novo.trilhaAtivaId} onChange={(e) => setNovo({ ...novo, trilhaAtivaId: e.target.value })}>
            {opcoesTrilha.map((t) => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex justify-end">
          <button className={btnPrimary} onClick={criar} disabled={criando}>
            {criando ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Criar colaborador
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-silver">
              <th className="pb-3">Colaborador</th>
              <th className="pb-3">Nível</th>
              <th className="pb-3">Trilha</th>
              <th className="pb-3 text-center">Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {usuarios.map((u) => {
              const ehVoce = u.uid === currentUid;
              return (
                <tr key={u.uid} className="text-ice">
                  <td className="py-3">
                    <p className="font-medium">
                      {u.nome} {ehVoce && <span className="text-xs text-primary">(você)</span>}
                    </p>
                    <p className="text-xs text-silver">{u.email}</p>
                  </td>
                  <td className="py-3">
                    <select
                      className={`${inputCls} w-28`}
                      value={u.nivelAtual ?? 0}
                      onChange={(e) => salvarLinha(u, 'nivelAtual', e.target.value)}
                    >
                      {NIVEIS.map((n) => (
                        <option key={n} value={n}>Nível {n}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3">
                    <select
                      className={`${inputCls} w-56`}
                      value={u.trilhaAtivaId || ''}
                      onChange={(e) => salvarLinha(u, 'trilhaAtivaId', e.target.value)}
                    >
                      {opcoesTrilha.map((t) => (
                        <option key={t.id} value={t.id}>{t.nome}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 text-center">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={!!u.admin}
                      disabled={ehVoce}
                      onClick={() => alternarAdmin(u)}
                      title={ehVoce ? 'Você não pode remover o próprio acesso' : u.admin ? 'Remover admin' : 'Tornar admin'}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        u.admin ? 'bg-primary' : 'bg-line'
                      } ${ehVoce ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          u.admin ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
            {!usuarios.length && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-silver">
                  Nenhum colaborador ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =====================================================================
// MENTORIAS
// =====================================================================
function MentoriasAdmin({ usuarios, mentorias, onSaved, flash }) {
  const porUid = useMemo(() => Object.fromEntries(usuarios.map((u) => [u.uid, u])), [usuarios]);
  const mentores = usuarios.filter((u) => (u.nivelAtual ?? 0) >= 2);
  const afilhados = usuarios.filter((u) => (u.nivelAtual ?? 0) === 1);
  const [nova, setNova] = useState({ mentorId: '', menteeId: '' });
  const [salvando, setSalvando] = useState(false);

  const criar = async () => {
    if (!nova.mentorId || !nova.menteeId) return flash('erro', 'Selecione mentor e afilhado.');
    if (nova.mentorId === nova.menteeId) return flash('erro', 'Mentor e afilhado devem ser diferentes.');
    const mentor = porUid[nova.mentorId];
    const afilhado = porUid[nova.menteeId];
    setSalvando(true);
    try {
      await salvarMentoria({
        mentorId: nova.mentorId,
        menteeId: nova.menteeId,
        trackId: afilhado?.trilhaAtivaId || mentor?.trilhaAtivaId,
      });
      flash('ok', 'Mentoria criada.');
      setNova({ mentorId: '', menteeId: '' });
      onSaved();
    } catch (e) {
      flash('erro', 'Erro ao criar: ' + e.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id) => {
    if (!confirm('Encerrar/excluir esta mentoria?')) return;
    try {
      await excluirMentoria(id);
      flash('ok', 'Mentoria removida.');
      onSaved();
    } catch (e) {
      flash('erro', 'Erro ao remover: ' + e.message);
    }
  };

  return (
    <div className="space-y-5">
      {/* Nova mentoria */}
      <div className="glass-panel rounded-xl p-4">
        <h4 className="mb-3 font-bold text-ice">Vincular mentor a afilhado</h4>
        <div className="grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr_auto]">
          <select className={inputCls} value={nova.mentorId} onChange={(e) => setNova({ ...nova, mentorId: e.target.value })}>
            <option value="">Mentor (Nível 2+)</option>
            {mentores.map((u) => (
              <option key={u.uid} value={u.uid}>{u.nome} · {u.trilhaAtivaId}</option>
            ))}
          </select>
          <ChevronRight size={18} className="mx-auto hidden text-primary sm:block" />
          <select className={inputCls} value={nova.menteeId} onChange={(e) => setNova({ ...nova, menteeId: e.target.value })}>
            <option value="">Afilhado (Nível 1)</option>
            {afilhados.map((u) => (
              <option key={u.uid} value={u.uid}>{u.nome} · {u.trilhaAtivaId}</option>
            ))}
          </select>
          <button className={btnPrimary} onClick={criar} disabled={salvando}>
            {salvando ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Vincular
          </button>
        </div>
        <p className="mt-2 text-xs text-silver">
          Dica: mentor e afilhado devem estar na mesma trilha.
        </p>
      </div>

      {/* Lista */}
      <div className="grid gap-3">
        {mentorias.map((m) => (
          <div key={m.id} className="glass-panel flex items-center justify-between gap-4 rounded-xl p-4">
            <div className="min-w-0 text-sm">
              <p className="font-semibold text-ice">
                {porUid[m.mentorId]?.nome || m.mentorId}{' '}
                <span className="text-silver">→</span>{' '}
                {porUid[m.menteeId]?.nome || m.menteeId}
              </p>
              <p className="text-xs text-silver">
                {m.trackId} ·{' '}
                <span className={m.status === 'ACTIVE' ? 'text-emerald-300' : 'text-silver'}>
                  {m.status}
                </span>
              </p>
            </div>
            <button
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10"
              onClick={() => excluir(m.id)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {!mentorias.length && (
          <p className="py-6 text-center text-silver">Nenhuma mentoria ativa.</p>
        )}
      </div>
    </div>
  );
}
