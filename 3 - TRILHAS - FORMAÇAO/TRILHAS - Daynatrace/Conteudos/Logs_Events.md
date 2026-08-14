# GUIA DE ESTUDOS: LOGS & EVENTS
**Certificação Dynatrace Associate**

---

## 1. Log Management no Grail™
O OneAgent detecta e ingere automaticamente arquivos de log em sistemas operacionais e contêineres sem configuração manual de rotas, enriquecendo cada linha com a topologia do Smartscape® (`host.name`, `k8s.pod.name`).

---

## 2. Severidade e Hierarquia de Eventos (Event Severities)
Eventos são notificações discretas de alterações de estado que alimentam o Davis® AI.

| Categoria do Evento | Impacto / Descrição | Exemplo Prático |
| :--- | :--- | :--- |
| **AVAILABILITY (Maior Prioridade)** | Componente totalmente inacessível ou fora do ar. | Host desligado, serviço HTTP fora do ar. |
| **ERROR** | Aumento em taxas de erro ou exceções. | Taxa de HTTP 500 acima do limite. |
| **PERFORMANCE** | Degradação ou lentidão no tempo de resposta. | Aumento do tempo de resposta de 200ms para 3s. |
| **RESOURCE** | Saturação de recursos computacionais. | Memória em 98%, disco em 95%. |
| **CUSTOM_ALERT / INFO** | Alertas manuais ou eventos informativos. | Deployments, alterações de configuração. |

---

## 3. Consultando Logs e Eventos via DQL

```dql
// Consultando eventos de reinicialização de processos
fetch events, from: now() - 12h
| filter event.type == "PROCESS_RESTART"
| summarize total_restarts = count(), by: {dt.entity.host}
| sort total_restarts desc
```

---

## 4. Mascaramento de PII (Data Masking)
- **Log Processing Rules:** Regras de regex configuradas *na ingestão* para ocultar cartões de crédito, senhas e PII.
- **Importante:** Se o dado gravou bruto no Grail™ sem mascaramento na ingestão, ele permanecerá visível no histórico.