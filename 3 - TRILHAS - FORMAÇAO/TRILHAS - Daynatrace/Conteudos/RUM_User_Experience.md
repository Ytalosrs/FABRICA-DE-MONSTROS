# GUIA DE ESTUDOS: REAL USER MONITORING (RUM) & USER EXPERIENCE
**Certificação Dynatrace Associate**

---

## 1. Visão Geral do Real User Monitoring (RUM)
Captura e analisa passivamente todas as interações e transações de usuários reais em aplicações Web, Mobile e Single-Page Applications (SPAs).

- **Tag RUM JS:** Funciona através do script `ruxitagentjs`, injetado automaticamente pelo OneAgent nos servidores de aplicação suportados.
- **Erro de Frontend:** Mapeia exceções de JavaScript, falhas de requisições AJAX/XHR e códigos de erro HTTP (4xx/5xx).

---

## 2. Tipos de User Actions (Ações do Usuário)
1. **Load Action:** Navegação inicial síncrona / carregamento completo da página.
2. **XHR / Fetch Action:** Requisição assíncrona JavaScript (AJAX/Fetch) em SPAs sem recarregar a página.
3. **Custom Action:** Ação personalizada criada via API JS (`dtrum.actionName()`).

---

## 3. Métrica Apdex (Application Performance Index)
Mede a satisfação do usuário em relação aos tempos de resposta (de 0.0 a 1.0).

- **Satisfeito:** Tempo <= $T$
- **Tolerante:** Tempo entre $T$ e $4T$
- **Frustrado:** Tempo > $4T$ **OU qualquer ação que resulte em ERRO**

> ⚠️ **Regra de Ouro da Prova:**  
> QUALQUER User Action que resulte em um ERRO (como uma exceção JavaScript ou erro HTTP 500) é classificada **AUTOMATICAMENTE como FRUSTRADA**, independentemente do tempo de resposta!

---

## 4. User Sessions e Session Replay
- **Fim de Sessão:** Encerrada automaticamente após **30 minutos de inatividade**, ao atingir **200 User Actions** ou **6 horas de duração máxima**.
- **Session Replay:** Reprodução em 'vídeo' da experiência visual do usuário. Possui mascaramento automático de campos (*Privacy-by-Default*) para conformidade com LGPD/GDPR.

---

## 5. Questões Resolvidas
- **Página carregou em 0.5s mas deu erro JS:** Classificada como **Frustrada (Frustrated)**.
- **OneAgent exige alteração no HTML para RUM?** Não, o OneAgent injeta a tag JS automaticamente nas respostas HTML.