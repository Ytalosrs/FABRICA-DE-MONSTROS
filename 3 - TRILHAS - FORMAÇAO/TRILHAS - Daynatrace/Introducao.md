# 🎓 Introdução à Certificação Dynatrace Associate

## 📌 Visão Geral do Exame
A certificação **Dynatrace Associate** é o primeiro marco na jornada de certificações oficiais da Dynatrace. Ela valida o conhecimento prático e conceitual sobre como implementar, navegar, analisar e operar a plataforma de observabilidade Dynatrace.

Esta certificação é projetada para engenheiros de software, especialistas em observabilidade, arquitetos de nuvem, SREs e profissionais de operações que utilizam o Dynatrace no dia a dia para monitorar aplicações, infraestruturas e experiências de usuários.

---

## 🎯 Objetivos de Aprendizado
Para ser aprovado no exame, o candidato deve demonstrar domínio nos seguintes pilares centrais:

1. **Grail™ & DQL (Dynatrace Query Language):**
   - Compreensão da arquitetura *Schema-on-Read*.
   - Construção de pipelines de consulta utilizando `fetch`, `filter`, `summarize`, `makeTimeseries`, `parse` e `lookup`.
   - Criação de tabelas e gráficos temporais.

2. **Topologia & Davis® AI:**
   - As 5 camadas do **Smartscape®** (*Data Center, Host, Process Group, Service, Application*).
   - Como a inteligência artificial Davis® analisa dependências causais para determinar a causa-raiz (*Root Cause Analysis*).

3. **Arquitetura de Coleta (OneAgent & ActiveGate):**
   - Modos de operação do OneAgent (*Full-Stack*, *Infrastructure*, *Discovery*).
   - Papel do ActiveGate (proxy, roteamento de tráfego, monitoramento sintético privado e integração com APIs de nuvem).

4. **Experiência do Usuário (RUM & Synthetics):**
   - Monitoramento passivo de usuários reais (RUM), cálculo de **Apdex** e *Session Replay*.
   - Monitoramento sintético proativo (*HTTP Monitors*, *Browser Monitors*, *Clickpaths*).

5. **Métricas, Logs, Eventos e Traces (PurePath®):**
   - Leitura de rastreamento distribuído sem código via **PurePath®** e **OpenTelemetry**.
   - Gerenciamento e parsing de logs no Grail™.
   - Entendimento dos níveis de severidade de eventos (*AVAILABILITY*, *ERROR*, *PERFORMANCE*, *RESOURCE*).

6. **Automação & Segurança:**
   - Criação de visualizações interativas com **Dashboards** e **Notebooks**.
   - Orquestração sem código via **Workflows** e *AutomationEngine*.
   - Mascaramento de dados sensíveis (PII / LGPD / GDPR) e *Davis® Security Score* (DSS).

---

## 📊 Estrutura e Formato da Prova

| Característica | Detalhe |
| :--- | :--- |
| **Formato** | Questões de múltipla escolha e múltipla seleção |
| **Número de Questões** | Aproximadamente 60 a 70 questões |
| **Tempo Limite** | 100 a 120 minutos |
| **Nota de Corte** | Geralmente 70% a 75% de acertos |
| **Modalidade** | Online e supervisionado (Proctored) |
| **Pré-requisitos** | Nenhum oficial, mas recomenda-se experiência prática com a plataforma |

---

## 💡 Dicas Principais para Preparação

* **Pratique a sintaxe DQL:** Muitas questões exigem a interpretação correta de queries ou a identificação do operador correto para cada cenário (`makeTimeseries` vs `summarize`).
* **Entenda as regras de negócios:** Lembre-se da regra de ouro do Apdex (qualquer erro de JavaScript ou HTTP 5xx classifica a ação como *Frustrada*).
* **Decore as camadas do Smartscape®:** Saiba exatamente o que reside em cada uma das 5 camadas topológicas.
* **Estude o ciclo do Kubernetes:** Compreenda o papel do *Dynatrace Operator* e do modo `CloudNativeFullStack` do *DynaKube*.