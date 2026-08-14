-- =====================================================================
-- SEÇÃO 2 — ESQUEMA DE BANCO DE DADOS (PostgreSQL / Supabase)
-- Plataforma "FORMAÇÃO DE TALENTOS"
-- Modela usuários, trilhas, módulos, progresso, mentorias e certificações.
-- =====================================================================

-- Extensões (Supabase já habilita pgcrypto por padrão para gen_random_uuid).
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Tipos enumerados de domínio
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'nivel_usuario') then
    -- 0 = Introdução | 1 = Trilha Técnica | 2 = Squad+Mentoria | 3 = Formado/Suporte
    create type nivel_usuario as enum ('N0', 'N1', 'N2', 'N3');
  end if;

  if not exists (select 1 from pg_type where typname = 'status_progresso') then
    create type status_progresso as enum ('bloqueado', 'nao_iniciado', 'em_andamento', 'concluido');
  end if;

  if not exists (select 1 from pg_type where typname = 'status_mentoria') then
    create type status_mentoria as enum ('ativa', 'concluida', 'cancelada');
  end if;

  if not exists (select 1 from pg_type where typname = 'resultado_certificacao') then
    create type resultado_certificacao as enum ('agendada', 'aprovado', 'reprovado');
  end if;
end$$;

-- ---------------------------------------------------------------------
-- TABELA: trilhas
-- Nível base obrigatória (Iniciante) + 10 trilhas técnicas.
-- ---------------------------------------------------------------------
create table if not exists trilhas (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  nome          text not null,
  descricao     text,
  -- Nível exigido para cursar: 'N0' para a base, 'N1' para as técnicas.
  nivel_alvo    nivel_usuario not null default 'N1',
  is_base       boolean not null default false, -- true apenas para "Iniciante"
  ordem         int not null default 0,
  icone         text,                            -- nome do ícone (lucide)
  criado_em     timestamptz not null default now()
);

create index if not exists idx_trilhas_nivel_alvo on trilhas (nivel_alvo);
create unique index if not exists uq_trilha_base on trilhas (is_base) where is_base = true;

-- ---------------------------------------------------------------------
-- TABELA: usuarios
-- Um usuário cursa no máximo 1 trilha técnica por vez (trilha_atual_id).
-- ---------------------------------------------------------------------
create table if not exists usuarios (
  id                uuid primary key default gen_random_uuid(),
  auth_id           uuid unique,                 -- referência ao auth.users do Supabase
  nome              text not null,
  -- Domínio corporativo obrigatório: barra qualquer e-mail sem sufixo @zello.tec.br.
  email             text not null unique
                      check (lower(email) like '%@zello.tec.br'),
  setor             text,
  avatar_url        text,
  nivel             nivel_usuario not null default 'N0',
  trilha_atual_id   uuid references trilhas (id) on delete set null,
  ativo             boolean not null default true,
  criado_em         timestamptz not null default now(),
  atualizado_em     timestamptz not null default now()
);

create index if not exists idx_usuarios_nivel on usuarios (nivel);
create index if not exists idx_usuarios_trilha on usuarios (trilha_atual_id);
create index if not exists idx_usuarios_nivel_trilha on usuarios (nivel, trilha_atual_id);

-- Trigger: normaliza o e-mail (minúsculo/sem espaços) e reforça o domínio
-- corporativo com uma mensagem de erro clara (defesa em profundidade além do CHECK).
create or replace function fn_valida_email_corporativo()
returns trigger as $$
begin
  new.email := lower(trim(new.email));
  if new.email !~ '^[^@\s]+@zello\.tec\.br$' then
    raise exception 'Acesso permitido apenas para e-mails corporativos com final @zello.tec.br (recebido: %)', new.email
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_valida_email_corporativo on usuarios;
create trigger trg_valida_email_corporativo
  before insert or update of email on usuarios
  for each row execute function fn_valida_email_corporativo();

-- ---------------------------------------------------------------------
-- TABELA: modulos
-- Conteúdo sequencial de cada trilha.
-- ---------------------------------------------------------------------
create table if not exists modulos (
  id            uuid primary key default gen_random_uuid(),
  trilha_id     uuid not null references trilhas (id) on delete cascade,
  titulo        text not null,
  descricao     text,
  ordem         int not null default 0,
  carga_horaria int not null default 1,          -- em horas
  criado_em     timestamptz not null default now(),
  unique (trilha_id, ordem)
);

create index if not exists idx_modulos_trilha on modulos (trilha_id);

-- ---------------------------------------------------------------------
-- TABELA: progresso_usuario
-- Progresso do usuário módulo a módulo.
-- ---------------------------------------------------------------------
create table if not exists progresso_usuario (
  id                uuid primary key default gen_random_uuid(),
  usuario_id        uuid not null references usuarios (id) on delete cascade,
  modulo_id         uuid not null references modulos (id) on delete cascade,
  status            status_progresso not null default 'nao_iniciado',
  percentual        int not null default 0 check (percentual between 0 and 100),
  iniciado_em       timestamptz,
  concluido_em      timestamptz,
  atualizado_em     timestamptz not null default now(),
  unique (usuario_id, modulo_id)
);

create index if not exists idx_progresso_usuario on progresso_usuario (usuario_id);
create index if not exists idx_progresso_status on progresso_usuario (usuario_id, status);

-- ---------------------------------------------------------------------
-- TABELA: certificacoes
-- Registro das provas de certificação N1 por trilha.
-- ---------------------------------------------------------------------
create table if not exists certificacoes (
  id            uuid primary key default gen_random_uuid(),
  usuario_id    uuid not null references usuarios (id) on delete cascade,
  trilha_id     uuid not null references trilhas (id) on delete cascade,
  resultado     resultado_certificacao not null default 'agendada',
  nota          numeric(5, 2) check (nota between 0 and 100),
  aplicada_em   timestamptz,
  emitida_em    timestamptz,
  criado_em     timestamptz not null default now()
);

create index if not exists idx_cert_usuario on certificacoes (usuario_id);
create index if not exists idx_cert_trilha on certificacoes (trilha_id);
-- Uma certificação aprovada única por usuário+trilha.
create unique index if not exists uq_cert_aprovada
  on certificacoes (usuario_id, trilha_id)
  where resultado = 'aprovado';

-- ---------------------------------------------------------------------
-- TABELA: mentorias
-- Vincula um mentor N2 a um afilhado N1 da MESMA trilha.
-- ---------------------------------------------------------------------
create table if not exists mentorias (
  id                uuid primary key default gen_random_uuid(),
  mentor_id         uuid not null references usuarios (id) on delete cascade,
  afilhado_id       uuid not null references usuarios (id) on delete cascade,
  trilha_id         uuid not null references trilhas (id) on delete cascade,
  squad             text,
  status            status_mentoria not null default 'ativa',
  vinculada_em      timestamptz not null default now(),
  concluida_em      timestamptz,
  check (mentor_id <> afilhado_id)
);

create index if not exists idx_mentoria_mentor on mentorias (mentor_id);
create index if not exists idx_mentoria_afilhado on mentorias (afilhado_id);
create index if not exists idx_mentoria_trilha on mentorias (trilha_id);
-- Um afilhado só pode ter 1 mentoria ativa por vez.
create unique index if not exists uq_mentoria_afilhado_ativa
  on mentorias (afilhado_id)
  where status = 'ativa';

-- ---------------------------------------------------------------------
-- SEED — Trilhas (Base Obrigatória + 10 técnicas)
-- ---------------------------------------------------------------------
insert into trilhas (slug, nome, nivel_alvo, is_base, ordem, icone) values
  ('iniciante',              'Trilha - Iniciante',                       'N0', true,  0,  'Sparkles'),
  ('analista',               'Trilha - Analista',                        'N1', false, 1,  'LineChart'),
  ('automacao',              'Trilha - Automação',                       'N1', false, 2,  'Workflow'),
  ('flutterflow',            'Trilha - FlutterFlow',                     'N1', false, 3,  'Smartphone'),
  ('ia-agentica',            'Trilha - IA Agêntica',                     'N1', false, 4,  'Bot'),
  ('kubernetes',             'Trilha - Kubernetes',                      'N1', false, 5,  'Container'),
  ('mulesoft-associate',     'Trilha - Mulesoft Associate',              'N1', false, 6,  'Plug'),
  ('mulesoft-dev1',          'Trilha - Mulesoft Dev 1',                  'N1', false, 7,  'Boxes'),
  ('qlik-replicate',         'Trilha - Qlik Replicate',                  'N1', false, 8,  'DatabaseZap'),
  ('qlik-sense-ba',          'Trilha - Qlik Sense: Business Analyst',    'N1', false, 9,  'PieChart'),
  ('salesforce-associate',   'Trilha - Salesforce Associate',            'N1', false, 10, 'Cloud')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- SEED — Módulos do Nível 0 (grade "Trilha Tech 360 / TI do Zero")
-- Vinculados à trilha base via slug 'iniciante'.
-- ---------------------------------------------------------------------
insert into modulos (trilha_id, titulo, descricao, ordem, carga_horaria)
select t.id, m.titulo, m.descricao, m.ordem, m.carga_horaria
from trilhas t
cross join (values
  (1, 'História e Evolução da TI',
      'Do ábaco às engrenagens mecânicas (Pascaline, Babbage, cartões perfurados); eras Válvulas (ENIAC) → Transistores → Circuitos Integrados → Microprocessadores.', 2),
  (2, 'O que é um Computador (Hardware vs. Software)',
      'Ciclo IPO (Entrada, Processamento, Saída, Armazenamento); anatomia: CPU, Placa-mãe, RAM, HD/SSD e periféricos.', 2),
  (3, 'Como o Computador Pensa (Lógica Elétrica e Binária)',
      'Bits (0/1) e Bytes (8 bits / 256 combinações); tradução de instruções e introdução a algoritmos.', 2),
  (4, 'Fundamentos de Lógica e Programação',
      'Algoritmo como "receita de bolo"; variáveis, constantes, tipos de dados e fluxo de execução.', 3),
  (5, 'Dados, Informações e Bancos de Dados',
      'Pirâmide do Conhecimento (Dado → Informação → Conhecimento → Inteligência); entidades, modelagem e chaves primárias/estrangeiras.', 3),
  (6, 'Avaliação de Passagem (Certificação Nível 0)',
      'Banco de questões discursivas e objetivas sobre computação e lógica; aprovação libera a escolha da Trilha Técnica do Nível 1.', 2)
) as m(ordem, titulo, descricao, carga_horaria)
where t.slug = 'iniciante'
on conflict (trilha_id, ordem) do nothing;

-- ---------------------------------------------------------------------
-- VIEW auxiliar para o Dashboard do Gestor (contagem por nível)
-- ---------------------------------------------------------------------
create or replace view vw_distribuicao_niveis as
select nivel, count(*)::int as total
from usuarios
where ativo = true
group by nivel;
