# GUIA DE ESTUDOS: WORKFLOWS & AUTOMATION
**Certificação Dynatrace Associate**

---

## 1. Dynatrace Workflows & AutomationEngine
Plataforma de orquestração *no-code/low-code* que conecta observabilidade do Grail™, inteligência do Davis® AI e ferramentas de terceiros (Slack, Jira, ServiceNow, Ansible, K8s) para remediação automática (*auto-remediation*).

---

## 2. Componentes e Triggers

| Componente | Mecanismo e Função | Exemplos |
| :--- | :--- | :--- |
| **Event-Based Trigger** | Disparado em tempo real na criação/fechamento de problemas Davis®. | Problemas de disponibilidade, alertas filtrados por DQL. |
| **Schedule-Based Trigger** | Execução temporal agendada. | Expressões Cron, relatórios diários às 08:00. |
| **Manual / Webhook Trigger** | Disparado sob demanda ou via API HTTP POST. | Integrações com sistemas externos. |

---

## 3. Passagem de Contexto e Variáveis
- **`{{ event() }}`:** Acessa os metadados do evento/problema de origem (ex: `{{ event()['dt.entity.host'] }}`).
- **`{{ result('nome_task') }}`:** Reutiliza o payload de retorno de uma tarefa executada anteriormente no fluxo.

---

## 4. Questões Resolvidas
- **Qual trigger usar para relatórios diários agendados?** **Schedule-Based Trigger** com expressão Cron.
- **Qual a vantagem da Auto-Remediation?** Redução do MTTR (*Mean Time to Repair*) fecho do ciclo de correção sem intervenção humana manual.