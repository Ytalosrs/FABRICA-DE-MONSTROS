# GUIA DE ESTUDOS: DISTRIBUTED TRACING (PUREPATH®)
**Certificação Dynatrace Associate**

---

## 1. O que é Rastreamento Distribuído (Distributed Tracing)?
É a capacidade de acompanhar e reconstruir a jornada completa de uma requisição individual à medida que ela atravessa múltiplos microsserviços, APIs, bancos de dados, filas e infraestruturas.

- **Trace (Rastreio):** Representa a transação/requisição inteira do início ao fim.
- **Span (Trecho/Operação):** É a menor unidade de trabalho executada dentro de um Trace (ex: chamada HTTP, consulta SQL).
- **Propagação de Contexto:** Mecanismo que injeta e extrai cabeçalhos padronizados (ex: **W3C Trace Context**) para manter a continuidade do Trace entre requisições de rede.

---

## 2. Tecnologia Dynatrace PurePath®
O PurePath® é a tecnologia proprietária de rastreamento distribuído no nível de código da Dynatrace.

- **Instrumentação Automática:** O OneAgent injeta bytecode automaticamente em tempo de execução sem alteração no código-fonte.
- **Profundidade:** Captura métodos, chamadas SQL com parâmetros anonimizados, exceções e uso de CPU por thread.
- **End-to-End:** Conecta a experiência do usuário final (RUM) no navegador diretamente ao banco de dados no backend.

---

## 3. Conceitos de OpenTelemetry e Padronização W3C

| Termo / Conceito | Definição e Função | Relevância no Dynatrace |
| :--- | :--- | :--- |
| **W3C Trace Context** | Padrão HTTP contendo `traceparent` e `tracestate`. | Permite conectar traces entre diferentes tecnologias. |
| **Trace ID** | Identificador único de 128 bits da transação completa. | Unifica todos os spans da mesma requisição. |
| **Span ID** | Identificador único de 64 bits de uma operação específica. | Mapeia a hierarquia Pai/Filho (*Parent-Child*). |
| **OpenTelemetry Ingest** | Ingestão nativa OTLP no Dynatrace. | Processa Spans OTel na tabela `spans` do Grail™. |

---

## 4. Análise de Spans com DQL (`fetch spans`)

```dql
// Identificando as operações mais lentas (Server Spans)
fetch spans, from: now() - 1h
| filter span.kind == "SERVER"
| fieldsAdd duration_ms = duration / 1000000
| filter duration_ms > 500
| summarize p95 = percentile(duration_ms, 95), avg(duration_ms), by: {service.name}
| sort p95 desc
```

---

## 5. Análise Causal e Davis® AI em Traces
- **Smartscape® + PurePath®:** A IA Davis® entende a dependência exata entre microsserviços para mapear a propagação de lentidão.
- **Análise de Gargalos (Bottleneck Analysis):** Identifica se a causa é CPU, rede, lock de threads ou consulta a banco de dados.

---

## 6. Questões Resolvidas
- **Instrumentação Manual necessária?** Não. O OneAgent com PurePath® faz a instrumentação automática em nível de bytecode.
- **OpenTelemetry:** O Dynatrace consome nativamente dados OTel via protocolo OTLP e os integra ao Grail™.