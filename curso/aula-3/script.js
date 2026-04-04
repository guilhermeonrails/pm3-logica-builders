document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("python-simulator");
    const resultBox = document.getElementById("resultado");
    const outputConsole = document.getElementById("output-console");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            let code = document.getElementById("code-input").value;
            resultBox.style.display = "block";
            outputConsole.innerHTML = ""; // Clear console

            try {
                // Muito básico "Transpilador" de Python falso para Javascript
                // para fins estritamente educacionais e simples
                
                // 1. Array para segurar todos os prints
                let outputs = [];
                
                let fakePythonEnv = code
                    // Troca print() para colocar no array
                    .replace(/print\s*\((.*?)\)/g, 'outputs.push($1);')
                    
                    // Transforma if condicao: em if (condicao) {
                    .replace(/if\s+(.*?):/g, 'if ($1) {')
                    
                    // Tratamento grosseiro para else: -> } else {
                    .replace(/else\s*:/g, '} else {')
                    
                    // Conversão de variaveis snake_case sem var/let
                    // Vamos tentar rodar solto, o JS de fundo aceita declaracao "implicita" 
                    // em escopo global (sem strict mode) se formos usar eval
                    
                    // Remover indentacao desnecessaria para o eval() do JS
                    .replace(/    /g, '')
                    .replace(/\t/g, '');

                // Fecha as chaves que foram abertas pelos ifs/elses na nossa versão rudimentar
                let absOpens = (fakePythonEnv.match(/\{/g) || []).length;
                let absCloses = (fakePythonEnv.match(/\}/g) || []).length;
                while (absOpens > absCloses) {
                    fakePythonEnv += '\n}';
                    absCloses++;
                }

                // O Eval rudimentar
                let executor = new Function(`
                    let outputs = [];
                    try {
                        ${fakePythonEnv}
                    } catch(err) {
                        return "Erro de sintaxe no código. Verifique as aspas, variáveis não criadas ou pontuação.";
                    }
                    return outputs.join("\\n");
                `);

                let result = executor();
                
                if (result === "") {
                    // Sem print
                    outputConsole.innerHTML = "<span style='color: var(--text-gray);'>[Executou sem erros, mas não houve nenhum <code>print()</code>]</span>";
                } else {
                    outputConsole.innerText = result;
                }

            } catch (err) {
                console.error(err);
                outputConsole.innerHTML = "<span style='color: #ff1744;'>Erro na compilação didática. Tente comandos mais simples!</span>";
            }
        });
    }
});
