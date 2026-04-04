document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("python-simulator");
    const resultBox = document.getElementById("resultado");
    const outputConsole = document.getElementById("output-console");

    if (form) {
        // Inicializa o CodeMirror (Syntax Highlighting) no textarea
        let editor = null;
        const codeInput = document.getElementById("code-input");
        if (codeInput && typeof CodeMirror !== "undefined") {
            editor = CodeMirror.fromTextArea(codeInput, {
                mode: "python",
                theme: "dracula",
                lineNumbers: true,
                indentUnit: 4,
                viewportMargin: Infinity
            });
        }

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            let code = editor ? editor.getValue() : codeInput.value;
            resultBox.style.display = "block";
            outputConsole.innerHTML = ""; // Clear console

            try {
                // Transpilador de Python rudimentar
                let jsLines = [];
                let indentLevel = 0;
                let lines = code.split('\n');

                for (let i = 0; i < lines.length; i++) {
                    let rawLine = lines[i];
                    if (rawLine.trim() === '') continue;
                    
                    let line = rawLine.trim();
                    
                    // Transforma append pra lists
                    line = line.replace(/\.append\s*\(/g, '.push(');
                    
                    let leadingSpaceStr = rawLine.match(/^\s*/)[0];
                    let spaces = 0;
                    for (let c of leadingSpaceStr) {
                        if (c === '\t') spaces += 4;
                        else spaces += 1;
                    }

                    // Fechar blocos caso a identação tenha diminuído
                    while (indentLevel > spaces) {
                        jsLines.push('}');
                        indentLevel -= 4;
                    }

                    if (line.startsWith('if') && line.endsWith(':')) {
                        let cond = line.substring(2, line.length - 1).trim();
                        jsLines.push(`if (${cond}) {`);
                        indentLevel += 4;
                    } else if (line === 'else:') {
                        jsLines.push(`else {`);
                        indentLevel += 4;
                    } else if (line.startsWith('print(')) {
                        let inner = line.substring(6, line.length - 1);
                        // Suporte para formatação caso coloquem aspas ao redor: print("nome") -> JS tb entende
                        jsLines.push(`outputs.push(${inner});`);
                    } else if (line.includes('=') && !line.includes('==') && !line.includes('!=') && !line.includes('>=') && !line.includes('<=')) {
                        // Verifica se está tentando criar um dicionário
                        let leftSide = line.split('=')[0].trim();
                        let appendSemi = (line.endsWith('{') || line.endsWith(',')) ? '' : ';';
                        
                        if (line.match(/^(var|let|const)\s/)) {
                            jsLines.push(line + appendSemi);
                        } else if (leftSide.includes('[') || leftSide.includes('.')) {
                            // Atualização de chave de dicionário, ex: painel["preco"] = 1200
                            jsLines.push(line + appendSemi);
                        } else {
                            jsLines.push('var ' + line + appendSemi);
                        }
                    } else {
                        let appendSemi = (line.endsWith('{') || line.endsWith('}') || line.endsWith(',')) ? '' : ';';
                        jsLines.push(line + appendSemi); // ex: linha solta
                    }
                }

                while (indentLevel > 0) {
                    jsLines.push('}');
                    indentLevel -= 4;
                }

                let fakePythonEnv = jsLines.join('\n');

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
