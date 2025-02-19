const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tamanhoCelula = 20;
const quantidadeCelulas = canvas.width / tamanhoCelula;

let cobra = [
    { x: 10, y: 10 }
];
let comida = { x: 15, y: 15 };
let direcaoX = 0;
let direcaoY = 0;
let pontuacao = 0;
let loopJogo;
let velocidadeJogo = 100;

function desenharJogo() {
    limparCanvas();
    moverCobra();
    verificarColisao();
    desenharCobra();
    desenharComida();
}

function limparCanvas() {
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function desenharCobra() {
    ctx.fillStyle = '#3498db';
    cobra.forEach(segmento => {
        ctx.fillRect(segmento.x * tamanhoCelula, segmento.y * tamanhoCelula, tamanhoCelula - 2, tamanhoCelula - 2);
    });
}

function desenharComida() {
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(comida.x * tamanhoCelula, comida.y * tamanhoCelula, tamanhoCelula - 2, tamanhoCelula - 2);
}

function moverCobra() {
    const cabeca = { x: cobra[0].x + direcaoX, y: cobra[0].y + direcaoY };
    cobra.unshift(cabeca);

    if (cabeca.x === comida.x && cabeca.y === comida.y) {
        pontuacao += 10;
        document.getElementById('score').textContent = `Pontuação: ${pontuacao}`;
        gerarComida();
        aumentarVelocidade();
    } else {
        cobra.pop();
    }
}

function gerarComida() {
    comida = {
        x: Math.floor(Math.random() * quantidadeCelulas),
        y: Math.floor(Math.random() * quantidadeCelulas)
    };
    
    // Garante que a comida não apareça sobre a cobra
    while (cobra.some(segmento => segmento.x === comida.x && segmento.y === comida.y)) {
        comida = {
            x: Math.floor(Math.random() * quantidadeCelulas),
            y: Math.floor(Math.random() * quantidadeCelulas)
        };
    }
}

function verificarColisao() {
    const cabeca = cobra[0];

    // Colisão com a parede
    if (cabeca.x < 0 || cabeca.x >= quantidadeCelulas || cabeca.y < 0 || cabeca.y >= quantidadeCelulas) {
        fimDeJogo();
    }

    // Colisão com o próprio corpo
    for (let i = 1; i < cobra.length; i++) {
        if (cabeca.x === cobra[i].x && cabeca.y === cobra[i].y) {
            fimDeJogo();
        }
    }
}

function fimDeJogo() {
    clearInterval(loopJogo);
    document.getElementById('final-score').textContent = pontuacao;
    document.getElementById('game-over').style.display = 'block';
}

function reiniciarJogo() {
    cobra = [{ x: 10, y: 10 }];
    direcaoX = 0;
    direcaoY = 0;
    pontuacao = 0;
    velocidadeJogo = 100;
    document.getElementById('score').textContent = 'Pontuação: 0';
    document.getElementById('game-over').style.display = 'none';
    gerarComida();
    iniciarJogo();
}

function aumentarVelocidade() {
    if (velocidadeJogo > 50) {
        velocidadeJogo -= 2;
        clearInterval(loopJogo);
        iniciarJogo();
    }
}

function manipularTecla(e) {
    const tecla = e.key;
    
    // Impede movimento na direção oposta
    if (tecla === 'ArrowLeft' && direcaoX === 0) {
        direcaoX = -1;
        direcaoY = 0;
    } else if (tecla === 'ArrowRight' && direcaoX === 0) {
        direcaoX = 1;
        direcaoY = 0;
    } else if (tecla === 'ArrowUp' && direcaoY === 0) {
        direcaoX = 0;
        direcaoY = -1;
    } else if (tecla === 'ArrowDown' && direcaoY === 0) {
        direcaoX = 0;
        direcaoY = 1;
    }
}

function iniciarJogo() {
    loopJogo = setInterval(desenharJogo, velocidadeJogo);
}

document.addEventListener('keydown', manipularTecla);
gerarComida();
iniciarJogo();