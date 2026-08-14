// =====================================================================
// TELA DE LOGIN E AUTENTICAÇÃO — "FORMAÇÃO DE TALENTOS" (identidade Zello)
// Conectada ao Firebase Auth (com fallback demo). Acesso restrito a
// e-mails corporativos @zello.tec.br.
// =====================================================================
import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  LogIn,
  Loader2,
  ShieldCheck,
  Rocket,
  GraduationCap,
  Users,
  Award,
} from 'lucide-react';
import ZelloLogo, { ZelloWatermark } from './ZelloLogo.jsx';
import {
  registrar,
  entrar,
  loginDemo,
  validarEmailCorporativo,
  DOMINIO_CORPORATIVO,
  MSG_DOMINIO,
} from '../services/authService.js';
import { isFirebaseConfigured } from '../firebase.js';

const ANO = new Date().getFullYear();

export default function Login() {
  const [modo, setModo] = useState('login'); // 'login' | 'cadastro'
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [emailInvalido, setEmailInvalido] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const atualizar = (campo) => (e) => {
    const valor = e.target.value;
    setForm((f) => ({ ...f, [campo]: valor }));

    // Validação do e-mail em tempo de digitação.
    if (campo === 'email') {
      const vazio = valor.trim() === '';
      const invalido = !vazio && !validarEmailCorporativo(valor);
      setEmailInvalido(invalido);
      setErro(invalido ? MSG_DOMINIO : '');
    }
  };

  const submeter = async (e) => {
    e.preventDefault();
    setErro('');

    // 1. Validação de domínio corporativo (frontend).
    if (!validarEmailCorporativo(form.email)) {
      setEmailInvalido(true);
      setErro(MSG_DOMINIO);
      return;
    }
    // 2. Validações básicas.
    if (form.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (modo === 'cadastro' && form.nome.trim().length < 3) {
      setErro('Informe seu nome completo para o cadastro.');
      return;
    }

    // 3. Firebase Auth (o observador de sessão no App faz o redirect).
    setCarregando(true);
    try {
      if (modo === 'cadastro') {
        await registrar({ nome: form.nome.trim(), email: form.email, senha: form.senha });
      } else {
        await entrar({ email: form.email, senha: form.senha });
      }
    } catch (err) {
      setErro(err.message || 'Falha na autenticação.');
    } finally {
      setCarregando(false);
    }
  };

  // Acesso rápido: pula a validação do Firebase e entra como Nível 0 de teste.
  const acessoRapido = async () => {
    setCarregando(true);
    try {
      await loginDemo({
        nome: 'Lucas (Novo Aluno)',
        email: 'lucas@zello.tec.br',
        nivelAtual: 0,
        trilhaAtivaId: 'iniciante_n0',
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden app-atmosphere">
      {/* Fundo ÚNICO para a tela toda (esquerda + direita ficam iguais):
          orbes borrados animados + marca d'água desfocada cobrindo tudo. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <ZelloWatermark opacity={0.05} className="blur-[2px]" />
        <div className="orb orb-a -left-32 top-[-10%] h-96 w-96 bg-primary/30" />
        <div className="orb orb-b right-[-8%] top-1/3 h-[28rem] w-[28rem] bg-accent/20" />
        <div className="orb orb-c bottom-[-15%] left-1/3 h-80 w-80 bg-primary/20" />
      </div>

      {/* Coluna esquerda — painel de marca (mesmo fundo da direita) */}
      <div className="relative hidden lg:flex lg:w-1/2">
        <div className="relative z-10 flex w-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <ZelloLogo size={48} />
            <div>
              <p className="text-lg font-bold">ZELLO</p>
              <p className="text-sm text-silver">Formação de Talentos</p>
            </div>
          </div>

          <div className="max-w-md space-y-5">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-balance">
              Do zero em tecnologia ao <span className="text-primary">especialista</span>.
            </h1>
            <p className="text-lg text-silver">
              Aprendizado, nivelamento e apadrinhamento automatizados — a jornada
              completa do colaborador Zello em uma só plataforma.
            </p>
            <div className="h-1 w-16 rounded-full bg-primary" />
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: GraduationCap, label: 'Trilha Tech 360' },
                { icon: Users, label: 'Mentoria em Squad' },
                { icon: Award, label: 'Certificação N1' },
              ].map((f) => (
                <div key={f.label} className="glass-panel rounded-xl p-3 text-center">
                  <f.icon size={20} className="mx-auto mb-1.5 text-primary" />
                  <p className="text-xs text-silver">{f.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-silver">
            <p className="text-silver/60">Suporte</p>
            <p>
              Dev:{' '}
              <a
                href="mailto:eduardo.candido@zello.tec.br"
                className="text-silver transition-colors hover:text-primary"
              >
                eduardo.candido@zello.tec.br
              </a>
            </p>
            <p className="pt-2 text-silver/60">© {ANO} Candido Sistemas</p>
          </div>
        </div>
      </div>

      {/* Coluna direita — card de login (glassmorphism), centralizado vertical e horizontalmente */}
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-10 sm:px-12 lg:w-1/2">
        <div className="relative my-auto w-full max-w-md animate-fade-up">
          {/* Marca Zello (topo — visível principalmente no mobile) */}
          <div className="mb-5 flex flex-col items-center text-center lg:hidden">
            <ZelloLogo size={52} className="mb-2.5" />
            <h1 className="text-xl font-extrabold tracking-tight text-ice">
              FORMAÇÃO DE <span className="text-primary">TALENTOS</span>
            </h1>
          </div>

          {/* Card de login */}
          <div className="glass-panel rounded-2xl p-7">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-ice">
                {modo === 'login' ? 'Entrar' : 'Criar conta'}
              </h2>
              <p className="mt-1 text-sm text-silver">
                Acesse o painel com suas credenciais corporativas.
              </p>
            </div>

          {/* Abas Login / Cadastro */}
          <div className="mb-6 flex rounded-lg border border-white/10 bg-deep/60 p-1">
            {[
              { id: 'login', label: 'Entrar' },
              { id: 'cadastro', label: 'Criar conta' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setModo(t.id);
                  setErro('');
                }}
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${
                  modo === t.id ? 'bg-primary text-white shadow-glow' : 'text-silver hover:text-ice'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={submeter} noValidate className="space-y-4">
            {/* Nome (apenas no cadastro) */}
            {modo === 'cadastro' && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-silver">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={atualizar('nome')}
                  placeholder="Seu nome"
                  className="w-full rounded-lg border border-line bg-deep px-4 py-3 text-sm text-ice placeholder:text-silver/50 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            )}

            {/* E-mail corporativo */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-silver">
                E-mail corporativo
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    emailInvalido ? 'text-red-400' : 'text-silver'
                  }`}
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={atualizar('email')}
                  placeholder={`colaborador${DOMINIO_CORPORATIVO}`}
                  autoComplete="email"
                  aria-invalid={emailInvalido}
                  className={`w-full rounded-lg border bg-deep px-4 py-3 pl-10 text-sm text-ice placeholder:text-silver/50 transition-colors focus:outline-none focus:ring-2 ${
                    emailInvalido
                      ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30'
                      : 'border-line focus:border-primary focus:ring-primary/30'
                  }`}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-silver">Senha</label>
              <div className="relative">
                <Lock
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-silver"
                />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={form.senha}
                  onChange={atualizar('senha')}
                  placeholder="••••••••"
                  autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
                  className="w-full rounded-lg border border-line bg-deep px-4 py-3 pl-10 pr-11 text-sm text-ice placeholder:text-silver/50 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-silver transition-colors hover:text-ice"
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Mensagem de erro / alerta */}
            {erro && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-300 animate-fade-up"
              >
                <AlertTriangle size={17} className="mt-0.5 shrink-0" />
                <span>{erro}</span>
              </div>
            )}

            {/* Botão Entrar no Sistema */}
            <button
              type="submit"
              disabled={carregando}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white shadow-glow transition-all hover:bg-primary-hover hover:shadow-[0_0_20px_-4px_rgba(255,107,0,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Processando...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  {modo === 'login' ? 'Entrar no Sistema' : 'Criar conta e entrar'}
                </>
              )}
            </button>
          </form>

          {/* Aviso de domínio */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-silver">
            <ShieldCheck size={14} className="text-accent" />
            Apenas e-mails <span className="font-semibold text-ice">{DOMINIO_CORPORATIVO}</span>
          </div>
        </div>

        {/* Acesso Rápido para Teste / Demonstração — só no modo demo (sem Firebase) */}
        {!isFirebaseConfigured && (
          <div className="mt-3.5 rounded-xl2 border border-dashed border-primary/40 bg-elevated/50 p-3.5">
            <div className="mb-2 flex items-center gap-2">
              <Rocket size={14} className="text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-wide text-primary">
                Acesso Rápido para Teste / Demonstração
              </span>
            </div>
            <button
              type="button"
              onClick={acessoRapido}
              disabled={carregando}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/50 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent active:scale-[0.99] disabled:opacity-60"
            >
              <Rocket size={16} /> Acessar sem Login (Modo Demo)
            </button>
          </div>
        )}

          <p className="mt-4 text-center text-xs text-silver/70">
            Zello · Formação de Talentos
          </p>
        </div>
      </div>
    </div>
  );
}
