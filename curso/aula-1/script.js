document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("intake-form");
    const resultBox = document.getElementById("resultado");
    const logTrigger = document.getElementById("log-trigger");
    const logRouter = document.getElementById("log-router");
    const logAction = document.getElementById("log-action");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const titulo = document.getElementById("titulo").value;
        const tipo = document.getElementById("tipo").value;

        // Reset classes
        resultBox.style.display = "block";
        resultBox.className = "simulator-result";

        // Simulating the Trigger
        logTrigger.innerHTML = `<strong>Novo Form recebido:</strong> "${titulo}"`;

        // Simulating the Router (Decisão)
        setTimeout(() => {
            if (tipo === "residencial-baixo") {
                logRouter.innerHTML = `Identificado como <span class="highlight">Residencial Simples</span>. Caminho: Vendas Rápidas / Autoatendimento.`;
                logAction.innerHTML = `🛒 <strong style="color:#d50000">Disparando e-mail com link do Kit Solar Padrão e inserindo lead na automação da SolarTech.</strong>`;
                resultBox.classList.add("error"); // Usando a mesma classe por motivos de reutilização de design
            } else if (tipo === "residencial-alto") {
                logRouter.innerHTML = `Identificado como <span class="highlight">Residencial Alto Padrão</span>. Caminho: Vendedor Consultor.`;
                logAction.innerHTML = `📞 <strong style="color:#ffab00">Criando negócio no Hubspot e enviando alerta para corretor regional agendar visita técnica.</strong>`;
                resultBox.classList.add("warning");
            } else if (tipo === "corporativo") {
                logRouter.innerHTML = `Identificado como <span class="highlight">Projeto Corporativo B2B</span>. Caminho: Engenharia de Projetos.`;
                logAction.innerHTML = `📐 <strong style="color:#008738">Abrindo Board de pré-projeto no Trello e acionando Engenheiro Sênior no Slack para dimensionamento técnico.</strong>`;
                resultBox.classList.add("success");
            }
        }, 500); // Small delay to simulate processing
    });
});
