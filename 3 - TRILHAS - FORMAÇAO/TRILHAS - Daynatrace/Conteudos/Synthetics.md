# GUIA DE ESTUDOS: SYNTHETIC MONITORING
**Certificação Dynatrace Associate**

---

## 1. Visão Geral do Dynatrace Synthetic Monitoring
Simula proativamente a experiência do usuário final, testando a disponibilidade, o desempenho e a funcionalidade de aplicações web e APIs 24/7, inclusive durante horários sem tráfego real.

> 📌 **Diferença para o Exame:**  
> - **RUM (Real User Monitoring):** Passivo. Captura a navegação de usuários reais.  
> - **Synthetic Monitoring:** Proativo. Utiliza robôs/bots simulados para testar rotas e fluxos de negócios continuamente.

---

## 2. Tipos de Monitores Sintéticos

| Tipo de Monitor | Descrição e Mecanismo | Casos de Uso Recomendados |
| :--- | :--- | :--- |
| **HTTP Monitor** | Executa chamadas HTTP/HTTPS sequenciais (GET, POST, etc.). Não renderiza HTML/JS. | Testes de APIs REST/SOAP, status 200 OK e microserviços. |
| **Browser Monitor** | Abre um Chrome real (*headless*) e carrega a página web completa. | Mede carregamento de página, LCP, DOM Interactive. |
| **Browser Clickpath** | Simula um fluxo de múltiplos passos (cliques, formulários, logins). | Fluxos de negócios críticos: Login, checkout, cadastros. |

---

## 3. Localizações Sintéticas (Public vs Private)
- **Public Locations:** Mantidas pela Dynatrace em nuvens públicas (AWS, Azure, GCP) para simular o acesso global da internet.
- **Private Locations:** Instaladas na infraestrutura do cliente (intranet/data center) utilizando um **ActiveGate com a capacidade 'Synthetic Engine' habilitada**.

---

## 4. Recursos de Segurança e Alertas
- **Credential Vault:** Armazena senhas e tokens criptografados para uso em scripts de Clickpath sem expô-los em texto puro.
- **Retry Mechanism:** Re-teste automático imediato em caso de falha para evitar falsos positivos por oscilações de rede.

---

## 5. Questões Resolvidas
- **Qual monitor escolher para APIs JSON rápidas?** **HTTP Monitor**, por ser mais leve e econômico.
- **Como monitorar sistemas de folha de pagamento internos sem internet?** Criando uma **Private Synthetic Location** via ActiveGate na rede interna.