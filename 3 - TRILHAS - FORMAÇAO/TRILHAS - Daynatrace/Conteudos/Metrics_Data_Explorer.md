# GUIA DE ESTUDOS: METRICS & DATA EXPLORER
**Certificação Dynatrace Associate**

---

## 1. O que são Métricas no Dynatrace?
Séries temporais numéricas (*time series data*) identificadas por uma **Metric Key** (ex: `dt.host.cpu.usage`) e enriquecidas com dimensões. Consultáveis no Grail™ via `fetch metrics`.

---

## 2. Tipos de Agregação no Data Explorer

| Agregação | Comportamento | Caso de Uso |
| :--- | :--- | :--- |
| `avg` | Valor médio no período. | Uso contínuo de CPU ou Memória. |
| `max` / `min` | Picos ou vales extremos. | Picos de latência ou uso máximo de disco. |
| `sum` | Acúmulo numérico no intervalo. | Volume total de bytes ou requisições. |
| `count` | Quantidade de amostras. | Frequência de amostragem. |
| `percentile` ($P_{90}/P_{95}$) | Valor abaixo do qual cai a % das amostras. | Análise de SLO/SLA ignorando outliers. |

---

## 3. Consultas DQL de Métricas

```dql
// Série temporal para gráfico de linhas
fetch metrics, from: now() - 2h
| filter metric.key == "dt.host.cpu.usage"
| makeTimeseries cpu_media = avg(value), by: {dt.entity.host}, interval: 5m
```

> 📌 **Regra de Ouro:**  
> Use `makeTimeseries` com `interval:` para gráficos de linha temporal e `summarize` para tabelas consolidadas.

---

## 4. Questões Resolvidas
- **Qual agregação escolher para SLO de latência?** **Percentil ($P_{95}$)**, pois desconsidera outliers e reflete a experiência da maioria dos usuários.