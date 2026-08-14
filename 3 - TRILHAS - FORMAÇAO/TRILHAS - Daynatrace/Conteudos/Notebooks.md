# GUIA DE ESTUDOS: DYNATRACE NOTEBOOKS
**Certificação Dynatrace Associate**

---

## 1. O que são Dynatrace Notebooks?
Dynatrace Notebooks é uma ferramenta interativa e colaborativa baseada em documentos que permite explorar, analisar e visualizar dados de observabilidade do Grail™. Semelhante ao Jupyter Notebooks, combina código DQL, gráficos, explicações em Markdown e blocos executáveis.

> 📌 **Diferença Chave para o Exame Associate:**  
> - **Dashboards:** Servem para monitoramento contínuo em tempo real de KPIs e métricas padronizadas.  
> - **Notebooks:** Servem para investigação ad-hoc, análise de causa-raiz (RCA), experimentação de DQL e documentação colaborativa (*playbooks/post-mortems*).

---

## 2. Tipos de Seções (Sections) em um Notebook

| Tipo de Seção | Descrição e Funcionalidade | Casos de Uso Principais |
| :--- | :--- | :--- |
| **DQL Query Section** | Executa consultas DQL diretas no Grail. Suporta tabelas, gráficos de linhas, área, barras, etc. | Extração de dados de logs, cálculo de métricas e tendências. |
| **Markdown Section** | Bloco de texto formatado (títulos, negrito, listas, links, tabelas Markdown). | Introdução de relatórios, contextos de incidentes, instruções de playbooks. |
| **Code / Execution Section** | Scripts e automações em linguagens suportadas (JavaScript/TypeScript/AppEngine). | Rotinas de remediação, chamadas de API externas ou acionamento de Workflows. |

---

## 3. Casos de Uso Principais do Notebooks
1. **Investigação de Incidentes e Causa-Raiz (RCA):** Cruzamento de logs, métricas e traces em um único documento interativo.
2. **Relatórios Post-Mortem e Runbooks Operacionais:** Documentação da linha do tempo do evento e consolidação das queries de diagnóstico.
3. **Prototipagem de Queries DQL:** Validação e teste de consultas antes de levá-las para Dashboards ou Alertas.

---

## 4. Recursos Interativos e Integrações
- **Timeframe Global e Local:** Seletor global no topo, mas cada seção DQL pode sobrescrever o período com `from/to`.
- **Fetch & Pivot Direto:** Permite clicar em valores de uma tabela para disparar novos filtros DQL automaticamente.
- **Conversão para Dashboard:** Seções DQL podem ser convertidas diretamente em tiles de um Dashboard permanente.

---

## 5. Questões Resolvidas de Exame

### Questão: Escolha de Ferramenta para Post-Mortem
**Cenário:** Criar um relatório com texto explicativo, gráficos de consumo de CPU no momento da falha e lista de logs de exceção.  
**Resposta Correta:** **Dynatrace Notebooks**, por mesclar Markdown com consultas DQL interativas em um único documento.

---

## 6. Checklist Final
- [ ] **Notebook vs Dashboard:** Entende a diferença entre análise ad-hoc e monitoramento contínuo.
- [ ] **Seções:** Conhece o papel das seções DQL, Markdown e Executáveis.
- [ ] **Conversão:** Sabe pinar/converter seções DQL de Notebooks para Dashboards.
- [ ] **Persistência de Dados:** Compreende como salvar estados de resultados para análises históricas.