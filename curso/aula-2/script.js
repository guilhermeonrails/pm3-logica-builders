document.addEventListener("DOMContentLoaded", () => {
    // --- LÓGICA DO IDENTIFICADOR DE DADOS (Seção 4) ---
    const testerForm = document.getElementById("type-tester-form");
    const resultBox = document.getElementById("resultado");
    const logValor = document.getElementById("log-valor");
    const logTipo = document.getElementById("log-tipo");

    if (testerForm) {
        testerForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const rawValue = document.getElementById("dado-input").value.trim();

            resultBox.style.display = "block";
            resultBox.className = "simulator-result success"; 

            logValor.textContent = `"${rawValue}"`;

            let typeLabel = "String (str)"; 

            const lowerValue = rawValue.toLowerCase();

            if (lowerValue === "true" || lowerValue === "false" || lowerValue === "verdadeiro" || lowerValue === "falso") {
                typeLabel = "Booleano (bool)";
            }
            else if (rawValue.match(/^\d{4}-\d{2}-\d{2}$/) || rawValue.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                typeLabel = "Data (date)";
            }
            else if (/^-?\d+$/.test(rawValue)) {
                typeLabel = "Inteiro (int)";
            }
            else if (/^-?\d+[\.,]\d+$/.test(rawValue)) {
                typeLabel = "Decimal (float)";
            }

            logTipo.innerHTML = `<span style="color: #00e676;">${typeLabel}</span>`;
        });
    }

    // --- LÓGICA DO QUIZ INTERATIVO (Seção 5) ---
    const quizQuestions = [
        { display: '"25"', expected: 'str', explanation: 'Estava entre aspas, então o computador lê como texto (String) independentemente de ter número.' },
        { display: '15.99', expected: 'float', explanation: 'É um número com separador de casas decimais.' },
        { display: 'false', expected: 'bool', explanation: 'É uma palavra especial predefinida para denotar um valor lógico (Falso).' },
        { display: '100', expected: 'int', explanation: 'É um número inteiro puro, sem frações ou pontos decimais.' },
        { display: '"true"', expected: 'str', explanation: 'Atenção! Está entre aspas, então o computador perde a mágica booleana e tenta ler apenas o texto literal.' },
        { display: '2023-10-15', expected: 'date', explanation: 'Formato padrão em sistemas (ISO) para representar Data.' },
        { display: '0', expected: 'int', explanation: 'O zero solitário continua sendo um número inteiro normal.' },
        { display: '"SolarTech"', expected: 'str', explanation: 'Qualquer palavra ou caracteres contidos em aspas sempre será lido como String.' },
        { display: '0.00', expected: 'float', explanation: 'Apesar de equivaler matematicamente a zero, o fato de ter casas demarcadas transforma o dado em fluxo de Decimal.' },
        { display: '"2024-12-01"', expected: 'str', explanation: 'Pegadinha comum! Embora aos nossos olhos seja uma data (ano-mês-dia), as aspas instruem o computador a considerar que você mandou apenas letras soltas (String).' }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    const quizValueEl = document.getElementById("quiz-value");
    const quizCounterEl = document.getElementById("quiz-counter");
    const quizFeedbackEl = document.getElementById("quiz-feedback");
    const quizContainer = document.getElementById("quiz-container");
    const quizEnd = document.getElementById("quiz-end");
    const quizScoreEl = document.getElementById("quiz-score");
    const quizBtns = document.querySelectorAll(".quiz-btn");
    const restartBtn = document.getElementById("btn-restart-quiz");

    function loadQuestion() {
        if (currentQuestionIndex >= quizQuestions.length) {
            endQuiz();
            return;
        }

        const q = quizQuestions[currentQuestionIndex];
        quizValueEl.textContent = q.display;
        quizCounterEl.textContent = currentQuestionIndex + 1;
        
        quizFeedbackEl.style.display = "none";
        
        quizBtns.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
        });
    }

    function endQuiz() {
        quizContainer.style.display = "none";
        quizEnd.style.display = "block";
        quizScoreEl.textContent = score;
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        quizEnd.style.display = "none";
        quizContainer.style.display = "block";
        loadQuestion();
    }

    if (quizContainer) {
        quizBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                if(btn.disabled) return;

                quizBtns.forEach(b => {
                    b.disabled = true;
                    b.style.cursor = "not-allowed";
                    if(b !== btn) b.style.opacity = "0.4";
                });

                const selectedType = btn.getAttribute("data-type");
                const currentQ = quizQuestions[currentQuestionIndex];

                quizFeedbackEl.style.display = "block";

                if (selectedType === currentQ.expected) {
                    score++;
                    quizFeedbackEl.style.backgroundColor = "rgba(0, 230, 118, 0.15)";
                    quizFeedbackEl.style.border = "1px solid #00e676";
                    quizFeedbackEl.innerHTML = `✅ <strong>Correto!</strong><br><span style="font-size: 1rem; font-weight: normal; margin-top:0.5rem; display:block;">${currentQ.explanation}</span>`;
                } else {
                    quizFeedbackEl.style.backgroundColor = "rgba(255, 23, 68, 0.15)";
                    quizFeedbackEl.style.border = "1px solid #ff1744";
                    quizFeedbackEl.innerHTML = `❌ <strong>Incorreto!</strong><br><span style="font-size: 1rem; font-weight: normal; margin-top:0.5rem; display:block;">${currentQ.explanation}</span>`;
                }

                setTimeout(() => {
                    currentQuestionIndex++;
                    loadQuestion();
                }, 4000);
            });
        });

        restartBtn.addEventListener("click", restartQuiz);
        loadQuestion(); 
    }
});
