document.addEventListener("DOMContentLoaded", () => {
    // Adiciona métodos de listas do Python ao Array do JS para fins didáticos
    Array.prototype.append = function(item) {
        this.push(item);
    };
    Array.prototype.remove = function(item) {
        let idx = this.indexOf(item);
        if(idx !== -1) this.splice(idx, 1);
        else throw new Error("x not in list");
    };
    Array.prototype.insert = function(idx, item) {
        this.splice(idx, 0, item);
    };
    Array.prototype.count = function(item) {
        return this.filter(x => x === item).length;
    };
    Array.prototype.index = function(item) {
        let idx = this.indexOf(item);
        if(idx === -1) throw new Error("x not in list");
        return idx;
    };
    Array.prototype.clear = function() {
        this.length = 0;
    };
    const originalPop = Array.prototype.pop;
    Array.prototype.pop = function(idx) {
        if (this.length === 0) throw new Error("pop from empty list");
        if (idx !== undefined) return this.splice(idx, 1)[0];
        return originalPop.call(this);
    };

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
                // Transpilador de Python com suporte a identação para fins didáticos
                let jsLines = [];
                let indentLevel = 0;
                let lines = code.split('\n');

                for (let i = 0; i < lines.length; i++) {
                    let rawLine = lines[i];
                    if (rawLine.trim() === '') continue;
                    
                    let line = rawLine.trim();
                    
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
                        jsLines.push(`outputs.push(${inner});`);
                    } else if (line.includes('=') && !line.includes('==') && !line.includes('!=') && !line.includes('>=') && !line.includes('<=')) {
                        if (line.match(/^(var|let|const)\s/)) {
                            jsLines.push(line + ';');
                        } else {
                            jsLines.push('var ' + line + ';');
                        }
                    } else {
                        jsLines.push(line + ';');
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
                    const len = (x) => {
                        if (x !== null && x !== undefined && x.length !== undefined) return x.length;
                        throw new Error("Objeto não tem len()");
                    };
                    try {
                        ${fakePythonEnv}
                    } catch(err) {
                        return err.message || "Erro de sintaxe no código. Verifique as aspas, variáveis não criadas ou pontuação.";
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
