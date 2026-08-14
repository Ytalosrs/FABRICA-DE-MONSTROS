# 🏆 Guia de Estudos Completo: Certificação Dynatrace Associate

Bem-vindo ao repositório de preparação para a certificação **Dynatrace Associate**. Este projeto reúne guias práticos, conceitos fundamentais, exemplos de sintaxe DQL, questões resolvidas no estilo da prova e checklists para revisão rápida.

---

## 📚 Sumário dos Módulos de Estudo

O conteúdo está dividido em **12 módulos principais**, cobrindo 100% do escopo exigido no exame:

| # | Módulo de Estudo | Tópicos Cobertos | Arquivo |
| :---: | :--- | :--- | :---: |
| **01** | **DQL (Dynatrace Query Language)** | Pipeline (`\|`), `fetch`, `filter`, `summarize`, `makeTimeseries`, `parse` e `lookup`. | [`01_DQL.md`](./01_DQL_Dynatrace_Associate.md) |
| **02** | **Dashboards** | Tiles de visualização, gráficos temporais, variáveis dinâmicas no DQL e IaC (JSON). | [`02_Dashboards.md`](./02_Dashboards_Dynatrace_Associate.md) |
| **03** | **Dynatrace Notebooks** | Análise ad-hoc, investigação de causa-raiz (RCA), post-mortems e blocos interativos. | [`03_Notebooks.md`](./03_Notebooks_Dynatrace_Associate.md) |
| **04** | **Distributed Tracing (PurePath®)** | Instrumentação sem código, W3C Trace Context, Spans, `fetch spans` e OpenTelemetry. | [`04_Tracing.md`](./04_Distributed_Tracing_Dynatrace_Associate.md) |
| **05** | **Synthetic Monitoring** | HTTP/Browser Monitors, Clickpaths, Public/Private Locations (ActiveGate) e Credential Vault. | [`05_Synthetics.md`](./05_Synthetics_Dynatrace_Associate.md) |
| **06** | **Real User Monitoring (RUM)** | Injeção da tag JS (`ruxitagentjs`), User Actions, cálculo do Apdex e Session Replay. | [`06_RUM.md`](./06_RUM_User_Experience_Dynatrace_Associate.md) |
| **07** | **Logs & Events** | Descoberta automática de logs, hierarquia de severidade de eventos e mascaramento de PII. | [`07_Logs_Events.md`](./07_Logs_Events_Dynatrace_Associate.md) |
| **08** | **Metrics & Data Explorer** | Metric Keys, agregações (`avg`, `sum`, $P_{95}$), `makeTimeseries` e Metric Expressions. | [`08_Metrics.md`](./08_Metrics_Data_Explorer_Dynatrace_Associate.md) |
| **09** | **Workflows & Automation** | AutomationEngine, Triggers (Event/Schedule Cron), expressões `{{ event() }}` e Auto-Remediation. | [`09_Workflows.md`](./09_Workflows_Automation_Dynatrace_Associate.md) |
| **10** | **Business Events (BizEvents)** | Observabilidade de negócios no Grail™, captura sem código via OneAgent, Ingest API e DQL. | [`10_BizEvents.md`](./10_Business_Events_Dynatrace_Associate.md) |
| **11** | **Infrastructure & Kubernetes** | Smartscape®, Dynatrace Operator, `DynaKube` (`CloudNativeFullStack`), API Server e ActiveGate. | [`11_K8s.md`](./11_Infrastructure_Kubernetes_Dynatrace_Associate.md) |
| **12** | **Segurança & Privacidade** | Mascaramento de SQL/PII, Davis® Security Score (DSS), RVA, RAP e Management Zones. | [`12_Seguranca.md`](./12_Seguranca_Dynatrace_Associate.md) |

---

## 🎯 Pilares Críticos para a Prova

### 1. DQL & Grail™
* **Pipeline:** Utilização do operador `|` para passar o resultado de uma instrução como entrada para a seguinte.
* **Filtre Cedo:** Sempre posicione o comando `filter` logo após o `fetch` para otimizar o consumo de dados.
* **`makeTimeseries` vs `summarize`:**
  * Use **`makeTimeseries`** (com `interval:`) para gráficos de linha/área temporais contínuos nos Dashboards.
  * Use **`summarize`** para tabelas consolidadas, KPIs ou agregados estáticos.

### 2. Smartscape® & Davis® AI
* **As 5 Camadas Topológicas (de baixo para cima):**
  1. *Data Center Layer*
  2. *Host Layer*
  3. *Process Group Layer*
  4. *Service Layer*
  5. *Application Layer*
* **Determinismo Causal:** O Davis® AI utiliza o grafo do Smartscape® para mapear dependências e isolar a **causa-raiz exata**, eliminando tempestades de alertas.

### 3. Regra de Ouro do Apdex (RUM)
* **Satisfeito ($T$):** Tempo $\le T$
* **Tolerante:** Tempo entre $T$ e $4T$
* **Frustrado:** Tempo $> 4T$ **OU** se a ação gerar qualquer **ERRO** (exceção JavaScript ou erro HTTP 5xx), independentemente da velocidade de carregamento.

### 4. Coleta & Agentes
* **OneAgent:** Agente único com instrumentação em tempo de execução no nível de bytecode (*sem alteração no código da aplicação*).
* **ActiveGate:** Proxy concentrador criptografado, coletor para APIs de nuvem (AWS/Azure/GCP) e executor de *Private Synthetic Locations*.
* **Kubernetes:** Modo recomendado do `DynaKube`: **`CloudNativeFullStack`** (utiliza CSI Driver e Webhook de admissão).

---

## 📊 Dicas para a Realização da Prova

* **Case Sensitivity:** Palavras-chave DQL são *case-insensitive* (`FETCH`, `fetch`), mas nomes de campos e valores em strings/JSON são *case-sensitive*.
* **Leitura Atenta de Cenários:** Atente-se a palavras-chave no enunciado (ex: "tempo real", "sem alteração de código", "proativo" vs "passivo").
* **Uso dos Checklists:** Revise o checklist ao final de cada arquivo `.md` antes do dia da prova.

---

*Bons estudos e sucesso na conquista da certificação Dynatrace Associate! 🚀*