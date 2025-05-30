// Seleciona todos os botões do jogo
const buttons = document.querySelectorAll('.button');

// Array de cores para ambos os níveis 
const colors = [
  { name: 'cinza', css: 'silver' },
  { name: 'vermelho', css: 'red' },
  { name: 'azul', css: 'blue' },
  { name: 'amarelo', css: 'yellow' },
  { name: 'verde', css: 'green' },
  { name: 'laranja', css: 'orange' },
  { name: 'roxo', css: 'purple' },
  { name: 'rosa', css: 'pink' },
  { name: 'salmão', css: 'salmon' },
  { name: 'marrom', css: 'brown' }
];

//======================== VARIAVEIS ======================== //

// Variáveis do Nível 1 
const sequence = [];
let playerSequence = [];
let round = 0;
let currentStep = 0;
let gameOver = false;
let sequencePlaying = false;
let playerName = '';

// Variáveis do Nível 2 
let finalPhase = 0; 
const finalPhasesTotal = 10;
let finalCorrectColor = '';

// ======================== FUNÇÕES  ======================== //

// Função auxiliar para exibir um indicador de nível dinâmico e colorido
function showLevelIndicator(message, callback) {
  const levelIndicator = document.getElementById('levelIndicator');
  levelIndicator.textContent = message;
  levelIndicator.style.display = 'block';
  levelIndicator.style.opacity = 1;
  setTimeout(() => {
    levelIndicator.style.opacity = 0;
    setTimeout(() => {
      levelIndicator.style.display = 'none';
      if (callback) callback();
    }, 1000);
  }, 2000);
}

// ======================== INÍCIO DO JOGO ======================== //

// Inicia o jogo ao clicar em "Iniciar Jogo"
document.getElementById('startButton').addEventListener('click', () => {
  playerName = document.getElementById('playerName').value;
  if (playerName.trim() !== '') {
    document.querySelector('.input-container').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'flex';
    document.getElementById('playerDisplay').textContent = `Jogador: ${playerName}`;
    
    if (!sessionStorage.getItem('tutorialShown')) {
      showTutorial();
      sessionStorage.setItem('tutorialShown', 'true');
    } else {
      nextRound();
    }
  } else {
    alert('Por favor, digite seu nome.');
  }
});

// ======================== NÍVEL 1: JOGO DE MEMÓRIA ======================== //

// Inicia a próxima rodada do jogo
function nextRound() {
  let randomButton;
  do {
    randomButton = Math.floor(Math.random() * colors.length);
  } while (sequence.includes(randomButton));
  sequence.push(randomButton);
  round++;
  currentStep = 0;
  if (round === 1) {
    showLevelIndicator("NÍVEL 1", playSequence);
  } else {
    playSequence();
  }
}

// Exibe a sequência de cores para o jogador memorizar
function playSequence() {
  document.getElementById('message').textContent = `Fase ${round}`;
  sequencePlaying = true;
  let i = 0;
  const interval = setInterval(() => {
    if (i >= sequence.length) {
      clearInterval(interval);
      sequencePlaying = false;
      return;
    }
    const button = buttons[sequence[i]];
    const color = colors[sequence[i]].css;
    button.style.backgroundColor = color;
    setTimeout(() => {
      button.style.backgroundColor = '';
      button.classList.remove('active');
    }, 500);
    i++;
  }, 1000);
}

// Verifica a jogada do jogador
function checkPlayerMove(index) {
  if (sequencePlaying) return;
  const button = buttons[index];
  const color = colors[index].css;
  button.style.backgroundColor = color;
  button.classList.add('active');
  
  if (sequence[currentStep] === index) {
    currentStep++;
    if (currentStep === sequence.length) {
      currentStep = 0;
      playerSequence = [];
      setTimeout(() => {
        buttons.forEach(button => {
          button.classList.remove('active');
          button.style.backgroundColor = '';
        });
        if (round < 10) {
          nextRound();
        } else {
          transitionToFinalLevel();
        }
      }, 1000);
    }
  } else {
    gameOver = true;
    showGameOverMessage();
  }
}

// Mensagem quandi jogador erra sequência
function showGameOverMessage() {
  const confirmation = confirm('Tente Novamente!! Deseja reiniciar o jogo? (Ok para Voltar ao nivel 1, Cancelar para voltar à tela inicial)');
  if (confirmation) {
    resetGame(false);
  } else {
    resetGame(true);
  }
}

// Resset das variaveis para iniciar nova fase e validação se inicia o volta para tela inicial 
function resetGame(backToStart) {
  sequence.length = 0;
  playerSequence.length = 0;
  round = 0;
  currentStep = 0;
  gameOver = false;
  sequencePlaying = false;
  finalPhase = 0;
  buttons.forEach(button => {
    button.classList.remove('active');
    button.style.backgroundColor = '';
    button.textContent = '';
  });
  document.getElementById('finalLevel').style.display = 'none';
  document.getElementById('finalLevel').classList.remove('show');
  document.getElementById('finalAnswer').value = '';
  
  if (backToStart) {
    document.querySelector('.input-container').style.display = 'flex';
    document.getElementById('gameContainer').style.display = 'none';
  } else {
    nextRound();
  }
}


//Executar video de tutoril e controlar ações do mesmo como inicio de jogo ao clicar em ok
function showTutorial() {
  const tutorial = document.getElementById('tutorial');
  const tutorialVideo = document.getElementById('tutorialVideo');
  tutorial.style.display = 'flex';
  tutorialVideo.play();
  const closeTutorialButton = document.getElementById('closeTutorialButton');
  closeTutorialButton.addEventListener('click', () => {
    tutorialVideo.pause();
    tutorialVideo.currentTime = 0;
    tutorial.style.display = 'none';
    nextRound();
  }, { once: true });
}

//Controle de botões adiciona eventos, valida e bloqueia 
buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    if (!gameOver && !sequencePlaying) {
      playerSequence.push(index);
      checkPlayerMove(index);
    }
  });
});

// ======================== NÍVEL 2: JOGO DE MEMÓRIA ======================== //
// Transição para o Nível 2
function transitionToFinalLevel() {
  buttons.forEach(button => {
    button.style.transition = "opacity 1s ease";
    button.style.opacity = 0;
  });
  setTimeout(() => {
    buttons.forEach((button, index) => {
      button.style.backgroundColor = colors[index].css;
      button.style.opacity = 1;
      button.textContent = '';
    });
    showLevelIndicator("NÍVEL 2", () => {
      finalPhase = 1; // Reinicia a fase para 1 no Nível 2
      updateFinalPhaseIndicator();
      startFinalLevel();
    });
  }, 1000);
}

// Nível 2 – Desafio Final (usando o array "colors")
function startFinalLevel() {
 setTimeout(() => {
    const targetIndex = Math.floor(Math.random() * colors.length);
    finalCorrectColor = colors[targetIndex].name;
    let otherColors = colors.filter(color => color.name !== finalCorrectColor);
    let randomWrongColor = otherColors[Math.floor(Math.random() * otherColors.length)].name;
    buttons[targetIndex].textContent = randomWrongColor;
    
    const finalDiv = document.getElementById('finalLevel');
    finalDiv.style.display = 'flex';
    finalDiv.style.opacity = 0;
    finalDiv.style.transition = "opacity 1s ease";
    setTimeout(() => {
      finalDiv.classList.add('show');
      finalDiv.style.opacity = 1 ;
    }, 10);
  }, 1000);
}

// Prepara a próxima fase do Nível 2
function transitionFinalPhase() {
  document.getElementById('finalAnswer').value = '';
  buttons.forEach(button => {
    button.style.transition = "opacity 1s ease";
    button.style.opacity = 0;
  });
  setTimeout(() => {
    buttons.forEach((button, index) => {
      button.style.backgroundColor = colors[index].css;
      button.style.opacity = 1;
      button.textContent = '';
    });
    const targetIndex = Math.floor(Math.random() * colors.length);
    finalCorrectColor = colors[targetIndex].name;
    let otherColors = colors.filter(color => color.name !== finalCorrectColor);
    let randomWrongColor = otherColors[Math.floor(Math.random() * otherColors.length)].name;
    buttons[targetIndex].textContent = randomWrongColor;
  }, 1000);
}

function updateFinalPhaseIndicator() {
  document.getElementById('finalPhaseIndicator').textContent = `Fase ${finalPhase}`;
}

// Verifica se o jogador respondeu corretamente
function checkFinalAnswer() {
  const userAnswer = document.getElementById('finalAnswer').value.trim().toLowerCase();
  if (userAnswer === finalCorrectColor.toLowerCase()) {
    finalPhase++;
    if (finalPhase <= finalPhasesTotal) {
      updateFinalPhaseIndicator();
      transitionFinalPhase();
    }
    if (finalPhase > finalPhasesTotal) {
      showLevelIndicator("Você venceu!", () => {
        resetGame(true);
      });
    }
  } else {
    alert("Resposta incorreta. Tente Novamente!! O jogo sera reiniciado");
    resetGame(true);
  }
}
// Adiciona evento para verificar resposta no Nível 2
document.getElementById('submitFinalAnswer').addEventListener('click', checkFinalAnswer);
