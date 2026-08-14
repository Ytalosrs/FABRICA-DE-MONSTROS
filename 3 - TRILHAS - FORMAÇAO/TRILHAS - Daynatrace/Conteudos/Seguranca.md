# GUIA DE ESTUDOS: SEGURANÇA E PRIVACIDADE
**Certificação Dynatrace Associate**

---

## 1. Proteção e Mascaramento de Dados (PII / GDPR)
- **SQL Bind Parameters:** Substitui valores de queries SQL por `?` no OneAgent antes do envio.
- **RUM & Session Replay:** Máscaras ativas por padrão no cliente (`Mask all input fields`) para ocultar digitações de senhas e cartões.
- **Log Processing Redaction:** Regras regex no pipeline de ingestão do Grail™ para ocultar PII.

---

## 2. Dynatrace Application Security
- **Davis® Security Score (DSS):** Ajusta o risco teórico do CVSS considerando o contexto real de execução em memória, se a aplicação é exposta à internet e se acessa banco de dados.
- **RVA (Runtime Vulnerability Analytics):** Detecção de bibliotecas vulneráveis em tempo de execução.
- **RAP (Runtime Application Protection):** Bloqueio ativo de ataques em tempo de execução (SQL Injection, Command Injection).

---

## 3. IAM e Management Zones
- **Management Zones:** Segregação lógica que restringe a visibilidade de equipes por tags, ambientes e namespaces.

---

## 4. Questões Resolvidas
- **Por que o DSS difere do CVSS 10.0?** Porque o DSS leva em conta o risco real no ambiente (ex: se o servidor não está exposto à internet, o score diminui).