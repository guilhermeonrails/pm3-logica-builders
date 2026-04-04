document.addEventListener("DOMContentLoaded", () => {

    // --- LÓGICA DO QUIZ DE OPERADORES LÓGICOS ---
    const quizQuestions = [
        { 
            question: '<strong>Cenário:</strong> Para liberar um empréstimo, o banco exige que o cliente tenha [Renda alta] <strong style="color:#00e676">AND</strong> [Nome limpo].<br><br>O cliente possui a renda necessária (Verdadeiro), mas está com o nome sujo no sistema (Falso). O empréstimo será aprovado?',
            options: [
                { text: 'A) Sim, empréstimo aprovado (Verdadeiro)', isCorrect: false },
                { text: 'B) Não, empréstimo recusado (Falso)', isCorrect: true },
                { text: 'C) Aprovado parcialmente', isCorrect: false }
            ],
            explanation: 'Correto! O operador AND é exigente. Se uma das duas condições é falsa (Nome sujo = Falso), o conjunto inteiro cai por água abaixo e resulta em Falso.' 
        },
        { 
            question: '<strong>Cenário:</strong> Na loja SolarTech, você ganha frete grátis se [Comprar mais de R$1000] <strong style="color:#00e676">OR</strong> [Morar em São Paulo].<br><br>Você comprou apenas uma bateria de R$300 (Falso para a 1ª condição), MAS o seu endereço de entrega é de São Paulo (Verdadeiro para a 2ª). Você ganha o frete grátis?', 
            options: [
                { text: 'A) Sim, com certeza! (Verdadeiro)', isCorrect: true },
                { text: 'B) Não, você perdeu (Falso)', isCorrect: false }
            ],
            explanation: 'Correto! O operador OR é flexível. Como a condição do local da moradia foi atendida, a exigência extra já foi superada e a regalia do frete grátis foi ativada.' 
        },
        { 
            question: '<strong>Cenário:</strong> O painel da máquina exibe um Aviso Crítico apenas se <strong style="color:#00e676">NOT</strong> [Aferição Concluída].<br><br>A aferição do aparelho está confirmada com sucesso (Aferição Concluída = Verdadeiro). Baseado na regra imposta, o aviso de erro crítico vai disparar na tela?', 
            options: [
                { text: 'A) Vai exibir aviso (Verdadeiro)', isCorrect: false },
                { text: 'B) Não vai exibir, máquina silenciosa (Falso)', isCorrect: true }
            ],
            explanation: 'Correto! A condição natural foi Verdadeira (aferição concluída). Porém o operador NOT tem a capacidade de inverter para Falso. Se é Falso, a notificação de problema obviamente não dispara!' 
        },
        { 
            question: '<strong>Cenário:</strong> O alarme de segurança noturno da loja dispara se ([Porta da frente foi aberta] <strong style="color:#00e676">OR</strong> [Janela dos fundos foi aberta]).<br><br>São duas da madrugada. A porta da frente está perfeitamente trancada (Falso) e a janela dos fundos também está intacta (Falso). O alarme de invasores vai disparar?', 
            options: [
                { text: 'A) Sim, ele ativará o barulho (Verdadeiro)', isCorrect: false },
                { text: 'B) Não vai disparar e continuar calmo (Falso)', isCorrect: true }
            ],
            explanation: 'Exato! O operador OR precisa no mínimo de "pelo menos um" fator positivo. Como absolutamente todas as possibilidades foram falsas, o alarme permanece inativo (Falso).' 
        },
        { 
            question: '<strong>Cenário VIP:</strong> O e-commerce garante 10% de Cashback especial se o cliente for membro Gold <strong style="color:#00e676">AND</strong> <strong style="color:#00e676">NOT</strong> [Houver devoluções em aberto na conta].<br><br>Você acabou de se tornar membro Gold (Verdadeiro) e o sistema confirma que você NUNCA fez uma devolução ali (Devoluções Ativas = Falso). O Cashback entra na sua conta?', 
            options: [
                { text: 'A) Sim, vai entrar na fatura! (Verdadeiro)', isCorrect: true },
                { text: 'B) Não, foi barrado no final. (Falso)', isCorrect: false }
            ],
            explanation: 'Cravou! Temos [Gold = Verdadeiro]. O fator das devoluções era Falso, mas o NOT transformou em Verdadeiro. No final das contas as duas métricas tornaram-se Verdadeiras! E já sabemos como o AND adora quando tudo fica Verdadeiro juntos, não é?! Cashback neles!' 
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    const quizValueEl = document.getElementById("quiz-value");
    const quizCounterEl = document.getElementById("quiz-counter");
    const quizFeedbackEl = document.getElementById("quiz-feedback");
    const quizContainer = document.getElementById("quiz-container");
    const quizOptionsContainer = document.getElementById("quiz-options-container");
    const quizEnd = document.getElementById("quiz-end");
    const quizScoreEl = document.getElementById("quiz-score");
    const restartBtn = document.getElementById("btn-restart-quiz");

    function loadQuestion() {
        if (currentQuestionIndex >= quizQuestions.length) {
            endQuiz();
            return;
        }

        const q = quizQuestions[currentQuestionIndex];
        quizValueEl.innerHTML = q.question;
        quizCounterEl.textContent = currentQuestionIndex + 1;
        
        quizFeedbackEl.style.display = "none";
        quizOptionsContainer.innerHTML = '';
        
        q.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "quiz-btn";
            btn.style.width = "100%";
            btn.style.maxWidth = "600px";
            btn.style.padding = "1rem";
            btn.style.fontSize = "1.1rem";
            btn.style.textAlign = "left";
            btn.style.marginBottom = "0.5rem";
            btn.innerHTML = opt.text;
            
            btn.addEventListener("click", () => handleAnswer(opt.isCorrect, btn, q.explanation));
            quizOptionsContainer.appendChild(btn);
        });
    }

    function handleAnswer(isCorrect, clickedBtn, explanation) {
        const allBtns = document.querySelectorAll(".quiz-btn");
        allBtns.forEach(b => {
            b.disabled = true;
            b.style.cursor = "not-allowed";
            if(b !== clickedBtn) b.style.opacity = "0.4";
        });

        quizFeedbackEl.style.display = "block";

        if (isCorrect) {
            score++;
            quizFeedbackEl.style.backgroundColor = "rgba(0, 230, 118, 0.15)";
            quizFeedbackEl.style.border = "1px solid #00e676";
            quizFeedbackEl.innerHTML = `✅ <strong style="color:#00e676;">EXCELENTE!</strong><br><span style="font-size: 1rem; font-weight: normal; margin-top:0.8rem; display:block; line-height: 1.5;">${explanation}</span>`;
            clickedBtn.style.backgroundColor = "#00e676";
            clickedBtn.style.color = "#000";
            clickedBtn.style.border = "2px solid #00e676";
        } else {
            quizFeedbackEl.style.backgroundColor = "rgba(255, 23, 68, 0.15)";
            quizFeedbackEl.style.border = "1px solid #ff1744";
            quizFeedbackEl.innerHTML = `❌ <strong style="color:#ff1744;">NÃO FOI DESSA VEZ!</strong><br><span style="font-size: 1rem; font-weight: normal; margin-top:0.8rem; display:block; line-height: 1.5;">O raciocínio correto era:<br>${explanation}</span>`;
            clickedBtn.style.backgroundColor = "#ff1744";
            clickedBtn.style.color = "#000";
            clickedBtn.style.border = "2px solid #ff1744";
        }

        setTimeout(() => {
            currentQuestionIndex++;
            loadQuestion();
        }, 5000); 
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
        restartBtn.addEventListener("click", restartQuiz);
        loadQuestion(); 
    }
});
