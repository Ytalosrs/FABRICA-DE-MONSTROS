# GUIA DE ESTUDOS: DYNATRACE QUERY LANGUAGE (DQL)
**Certificação Dynatrace Associate**

---

## 1. Visão Geral e Arquitetura Grail™
A **Dynatrace Query Language (DQL)** é a linguagem de consulta potente e flexível desenvolvida para explorar, analisar e transformar dados armazenados no **Grail™** — o data lakehouse causal e sem esquema da Dynatrace.

- **Estrutura em Pipeline:** As consultas DQL utilizam o operador de pipe (`|`). O resultado do comando à esquerda serve de entrada direta para o comando à direita.
- **Sem Esquema na Escrita (Schema-on-Read):** Os dados são gravados sem necessidade de esquemas pré-definidos. A estrutura e extração de campos ocorrem no momento da consulta com comandos como `parse`.
- **Modelagem de Dados Unificada:** Unifica Logs, Métricas, Eventos, Spans (Traces), BizEvents e Entidades de infraestrutura em uma única linguagem coerente.

> 📌 **Dica Essencial para o Exame:**  
> A ordem das etapas no pipeline impacta drasticamente a performance. Sempre aplique o comando `filter` o mais cedo possível na query para reduzir o volume de dados processados nos estágios posteriores (como `summarize` ou `sort`).

---

## 2. Comandos Fundamentais da Sintaxe DQL

| Comando | Descrição | Exemplo Curto |
| :--- | :--- | :--- |
| `fetch` | Carrega os dados de uma tabela/fonte específica (logs, events, dt.entity.host, metrics). | `fetch logs` |
| `filter` | Filtra registros com base em uma ou mais condições lógicas. | `filter loglevel == "ERROR"` |
| `fields` | Seleciona, projeta ou renomeia os campos que serão exibidos no resultado final. | `fields timestamp, content, host.name` |
| `fieldsAdd` | Adiciona novos campos calculados sem remover os campos existentes. | `fieldsAdd duration_sec = duration / 1000` |
| `fieldsRemove` | Remove campos específicos do conjunto de resultados. | `fieldsRemove raw_payload` |
| `summarize` | Agrupa e consolida dados usando funções de agregação (`count`, `avg`, `max`, `min`, `sum`). | `summarize count(), by: {status}` |
| `sort` | Ordena os resultados em ordem ascendente (`asc`) ou descendente (`desc`). | `sort timestamp desc` |
| `limit` | Restringe o número máximo de registros retornados. | `limit 50` |
| `parse` | Extrai dados estruturados de strings não estruturadas (ex: mensagens de log). | `parse content, "LD 'status=' INT:code"` |
| `makeTimeseries` | Gera séries temporais agregadas para gráficos e dashboards. | `makeTimeseries count(), by: {loglevel}` |
| `lookup` | Realiza cruzamento/enriquecimento de dados entre duas tabelas/fontes. | `lookup [fetch dt.entity.host], sourceField:host_id` |

---

## 3. Principais Fontes de Dados (Tables / Data Types)
No DQL, o comando `fetch` inicia a consulta indicando qual tipo de dado será analisado:
- `fetch logs`: Acessa registros de logs coletados por OneAgent ou coletores. Campos comuns: `status`, `loglevel`, `content`, `host.name`, `process.technology`.
- `fetch events`: Acessa eventos do sistema, alertas, problemas (Davis® AI), alterações de configuração e eventos customizados.
- `fetch metrics`: Consulta dados de métricas numéricas. Exemplo: `fetch metrics, timeframe: -1h | filter metric.key == "dt.host.cpu.usage"`.
- `fetch dt.entity.<tipo>`: Acessa dados topológicos e metadados de entidades monitoradas (`dt.entity.host`, `dt.entity.service`).
- `fetch bizevents`: Consulta eventos de negócios (Business Events) para análise de processos operacionais.
- `fetch spans`: Acessa dados de rastreamento distribuído (Traces/OpenTelemetry).

---

## 4. Agregações e Séries Temporais (`summarize` vs `makeTimeseries`)

### A. O Comando `summarize`
Condensa os registros em tabelas de resumo sem eixo temporal contínuo. Ideal para tabelas e KPIs consolidados.

```dql
fetch logs, from: now() - 24h
| filter loglevel == "ERROR"
| summarize total_erros = count(), countDistinct(host.name), by: {status, k8s.namespace.name}
| sort total_erros desc
| limit 10
```

### B. O Comando `makeTimeseries`
Aloca os dados em partições de tempo (buckets/bins) para plotagem de gráficos de linha, área e barras temporais.

```dql
fetch logs, from: now() - 2h
| filter loglevel in ["ERROR", "WARN"]
| makeTimeseries quantidade = count(), by: {loglevel}, interval: 5m
```

> 📌 **Diferença Chave para a Prova:**  
> - `summarize` gera uma tabela tabular sem eixo de tempo contínuo.  
> - `makeTimeseries` obrigatoriamente divide o tempo em intervalos (ex: `interval: 5m`) e preenche lacunas temporais, sendo a escolha correta para gráficos de linha temporal nos Dashboards.

---

## 5. Parsing de Dados com Pattern Matching
O comando `parse` permite extrair variáveis de mensagens não estruturadas no campo `content`:
- **`LD` (Line Data):** Captura qualquer caractere até o próximo delimitador indicado.
- **`INT` / `DOUBLE`:** Captura números inteiros ou decimais.
- **`WORD`:** Captura uma palavra individual (sem espaços).
- **`IP` / `TIMESTAMP`:** Matchers específicos para endereços IP e carimbos de data/hora.

**Exemplo Prático:**
```dql
fetch logs, from: now() - 1h
| parse content, " 'IP=' IP:client_ip ' User=' WORD:username ' ResponseTime=' INT:response_time_ms 'ms' "
| filter response_time_ms > 200
| fields timestamp, client_ip, username, response_time_ms
```

---

## 6. Funções Úteis e Operadores Lógicos
- **Funções de String:** `concat(a, b)`, `lower(str)`, `upper(str)`, `contains(str, search)`, `matchesRegex(str, pattern)`.
- **Funções de Condição e Nulos:** `if(cond, val_true, val_false)`, `coalesce(val1, val2)`, `isNull(val)`, `isNotNull(val)`.
- **Funções de Tempo:** `now() - 7d`, `toTimestamp()`, `formatTimestamp()`.

---

## 7. Exercícios Resolvidos no Estilo da Prova

### Questão 1: Identificação de Erros Críticos por Serviço
**Cenário:** Listar os 5 serviços que mais geraram logs com nível `SEVERE` ou `FATAL` nas últimas 6 horas.
```dql
fetch logs, from: now() - 6h
| filter loglevel in ["SEVERE", "FATAL"]
| summarize total = count(), by: {dt.entity.service}
| sort total desc
| limit 5
```

### Questão 2: Enriquecimento de Dados com Lookup
**Cenário:** Trazer o nome amigável do host (`entity.name`) em uma consulta de logs que contém apenas `host.id`.
```dql
fetch logs, from: now() - 1h
| filter isNotNull(host.id)
| lookup [fetch dt.entity.host], sourceField: host.id, lookupField: id, prefix: "host_info."
| fields timestamp, content, host_info.entity.name
```

---

## 8. Checklist Final de Preparação
- [ ] **Case Sensitivity:** Palavras-chave DQL são *case-insensitive*, mas valores de strings e campos JSON são *case-sensitive*.
- [ ] **Filtragem Inicial:** Sempre coloque o `filter` logo após o `fetch`.
- [ ] **`fields` vs `fieldsAdd`:** `fields` substitui a lista de campos exibidos; `fieldsAdd` apenas acrescenta novas colunas.
- [ ] **Uso de `limit`:** O comando `limit` deve vir ao final da query, após a ordenação (`sort`).