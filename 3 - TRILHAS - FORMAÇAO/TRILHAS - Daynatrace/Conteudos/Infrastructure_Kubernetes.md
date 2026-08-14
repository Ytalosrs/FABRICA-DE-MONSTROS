# GUIA DE ESTUDOS: INFRASTRUCTURE & KUBERNETES
**Certificação Dynatrace Associate**

---

## 1. Smartscape® - As 5 Camadas Topológicas
1. **Application Layer (Topo):** Web e Mobile Apps, Monitores Sintéticos.
2. **Service Layer:** Endpoints de API, Web Services, chamadas DB.
3. **Process Group Layer:** JVMs, processos Node.js, Contêineres, Pods.
4. **Host Layer:** VMs, servidores físicos, nós K8s.
5. **Data Center Layer (Base):** Regiões de nuvem, data centers locais.

---

## 2. Modos do OneAgent
- **Full-Stack Monitoring:** Observabilidade completa (código + infraestrutura + RUM + PurePath®).
- **Infrastructure Monitoring:** Métricas de SO e contêineres sem injeção em código nem PurePath®.

---

## 3. Kubernetes & Dynatrace Operator (`DynaKube`)
- **`CloudNativeFullStack` (Recomendado):** Utiliza **CSI Driver** e Webhook de Admissão para injetar o OneAgent nos contêineres sem necessidade de reinicializar os nós.
- **ActiveGate no K8s:** Conecta à API Server do Kubernetes para consultar `kube-state-metrics` (Deployments, Quotas, Namespaces) e capturar eventos como `OOMKilled` e `CrashLoopBackOff`.

---

## 4. Questões Resolvidos
- **O que significa `K8S_OOM_KILLED`?** O contêiner do Pod estourou o limite de memória (*Memory Limit*) configurado no manifesto, sendo encerrado pelo Kernel do SO.