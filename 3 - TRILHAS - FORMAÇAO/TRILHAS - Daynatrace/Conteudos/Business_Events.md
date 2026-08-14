# GUIA DE ESTUDOS: BUSINESS EVENTS (BIZEVENTS)
**Certificação Dynatrace Associate**

---

## 1. O que são Business Events (BizEvents)?
Transformam telemetria técnica em dados operacionais de negócios em tempo real (ex: pedidos efetuados, PIX realizados, logins) armazenados na tabela `bizevents` do Grail™.

---

## 2. Métodos de Captura

| Método | Mecanismo | Caso de Uso |
| :--- | :--- | :--- |
| **OneAgent BizEvent Capture** | Extrai dados de payload HTTP (JSON/XML) ou métodos no servidor sem alterar código. | Compras em e-commerce, geração de boletos no backend. |
| **Ingest API HTTP** | Envio de JSONs estruturados via POST para `/api/v2/bizevents/ingest`. | Sistemas legados, ESBs, barramentos de integração. |
| **RUM JS API** | Disparado via JS no navegador (`dtrum.sendBizEvent()`). | Cliques em botões de conversão e eventos de frontend. |

---

## 3. Campos Padrão Obrigatórios
- **`event.type`:** Define o tipo da transação (ex: `com.loja.checkout`).
- **`event.provider`:** Identifica o sistema de origem (ex: `checkout-service`).

---

## 4. Consulta DQL
```dql
fetch bizevents, from: now() - 24h
| filter event.type == "com.loja.checkout.sucesso"
| summarize total_vendas = count(), faturamento = sum(amount), by: {currency}
```

---

## 5. Questões Resolvidas
- **É preciso alterar o código para capturar valores em APIs Java?** Não, o **OneAgent Business Event Capture** extrai o campo do payload HTTP automaticamente.