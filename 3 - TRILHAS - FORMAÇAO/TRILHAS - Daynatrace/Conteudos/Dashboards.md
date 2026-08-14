# GUIA DE ESTUDOS: DYNATRACE DASHBOARDS
**Certificação Dynatrace Associate**

---

## 1. Visão Geral dos Dashboards no Dynatrace
Os Dashboards na plataforma Dynatrace desempenham um papel crítico na observabilidade, oferecendo visualizações em tempo real sobre a saúde, performance e disponibilidade de aplicações, infraestruturas e processos de negócios. Com a evolução baseada no Grail™, os dashboards modernos são impulsionados por DQL.

- **Objetivo:** Centralizar indicadores-chave de desempenho (KPIs) e métricas de SLO para equipes SRE, Operações e Negócios.
- **Plataforma Modern vs Classic:** Os painéis modernos usam a app 'Dashboards' nativa baseada em DQL, enquanto o ambiente Classic utiliza widgets pré-configurados e seletores de métricas.

---

## 2. Tipos de Visualização e Casos de Uso

| Tipo de Visualização | Casos de Uso Principais | Sintaxe DQL Recomendada |
| :--- | :--- | :--- |
| **Line Chart (Linha)** | Evolução temporal de métricas contínuas (ex: uso de CPU, tempo de resposta). | `makeTimeseries avg(dt.host.cpu.usage), interval: 5m` |
| **Area Chart (Área)** | Tendências acumuladas e volume proporcional ao longo do tempo. | `makeTimeseries count(), by: {loglevel}, interval: 5m` |
| **Bar Chart (Barras)** | Comparação discreta entre categorias ou agrupamentos. | `summarize total = count(), by: {status} \| sort total desc` |
| **Single Value** | Exibição de um único KPI numérico em destaque (ex: Disponibilidade %, Total de Requisições). | `summarize count()` ou `avg(duration)` |
| **Table (Tabela)** | Listagem detalhada de registros, logs de erros ou top entidades. | `fetch logs \| fields timestamp, loglevel, content \| limit 50` |
| **Pie / Donut Chart** | Proporção de partes em relação a um todo. | `summarize count(), by: {http.status_code}` |
| **Honeycomb (Favos)** | Visualização do status e saúde de um grande número de entidades simultaneamente. | `fetch dt.entity.host \| fields id, entity.name, status` |

---

## 3. Construção de Visualizações via DQL

> ⚠️ **Regra de Ouro para a Prova:**  
> Se o objetivo for gerar um gráfico de linha contínuo no tempo, NUNCA use `summarize` com agrupamento por timestamp. A forma correta e nativa é utilizar `makeTimeseries`.

---

## 4. Variáveis Dinâmicas nos Dashboards
Permitem que os usuários filtrem os dados de todo o painel interativamente (ex: selecionar um ambiente ou host específico) sem editar o código DQL.

**Exemplo de Query com Variável Dinâmica:**
```dql
// Variável $selected_host configurada no Dashboard
fetch logs, from: now() - 2h
| filter host.name == $selected_host
| filter loglevel == "ERROR"
| fields timestamp, content, process.technology
```

---

## 5. Compartilhamento, Permissões e Gestão
- **Privacidade por Padrão:** Um dashboard recém-criado é privado e visível apenas para o criador (*Owner*).
- **Controle de Acesso:** Modo de Exibição (*View mode*) permite interagir com filtros; Modo de Edição (*Edit mode*) permite alterar tiles.
- **Exportação/Importação:** Podem ser exportados e importados no formato **JSON**, facilitando o versionamento via IaC.

---

## 6. Questões e Cenários Resolvidos

### Questão: Visualizando 50 Servidores sem Poluição
**Cenário:** Visualizar a % de uso de memória de 50 servidores sem poluir a tela com 50 linhas em um gráfico.  
**Resposta Correta:** Utilizar um gráfico do tipo **Honeycomb (Favos)** ou uma Tabela ordenada por consumo.

---

## 7. Checklist Final de Preparação
- [ ] **`makeTimeseries` vs `summarize`:** Sabe quando usar um para gráficos temporais e outro para tabelas estáticas.
- [ ] **Escolha do Tile:** Conhece o uso de Honeycomb para grande volume de infraestrutura.
- [ ] **Variáveis:** Sabe como declarar e reutilizar variáveis de filtro dinâmico no DQL.
- [ ] **Exportação JSON:** Conhece a exportação em formato JSON para IaC.