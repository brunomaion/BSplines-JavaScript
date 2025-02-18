
function closedBspline(pontosDeControle) {
    // Repete os primeiros pontos no final para fechar a curva
    let extendedpontosDeControle = [
        ...pontosDeControle,
        pontosDeControle[0], // Repete o primeiro ponto no final
        pontosDeControle[1], // Repete o segundo ponto no final
        pontosDeControle[2]  // Repete o terceiro ponto no final (dependendo do grau da B-spline)
    ];
    return extendedpontosDeControle;
}

function clampingBspline(pontosDeControle) {
    let extendedpontosDeControle = [
        pontosDeControle[0], pontosDeControle[0], // Repete o primeiro ponto
        ...pontosDeControle,
        pontosDeControle[pontosDeControle.length - 1], pontosDeControle[pontosDeControle.length - 1] // Repete o último ponto
    ];
    return extendedpontosDeControle;
}
function calculateBspline(pontosDeControle) {
    pontosDeControle = clampingBspline(pontosDeControle);
    /*
    if (document.getElementById('clamped').checked) {
        pontosDeControle = clampingBspline(pontosDeControle);
    }

    if (document.getElementById('closed').checked) {
        pontosDeControle = closedBspline(pontosDeControle);
    }*/


    let nSegmentos = 2;
    let pontosDaCurva = [];

    for (let i = 1; i < pontosDeControle.length - 2; i++) {
        let [xA, xB, xC, xD] = [
            pontosDeControle[i - 1][0], 
            pontosDeControle[i][0], 
            pontosDeControle[i + 1][0], 
            pontosDeControle[i + 2][0]
        ];
        let [yA, yB, yC, yD] = [
            pontosDeControle[i - 1][1], 
            pontosDeControle[i][1], 
            pontosDeControle[i + 1][1], 
            pontosDeControle[i + 2][1]
        ];
        
        let a3 = (-xA + 3 * (xB - xC) + xD) / 6, b3 = (-yA + 3 * (yB - yC) + yD) / 6;
        let a2 = (xA - 2 * xB + xC) / 2, b2 = (yA - 2 * yB + yC) / 2;
        let a1 = (xC - xA) / 2, b1 = (yC - yA) / 2;
        let a0 = (xA + 4 * xB + xC) / 6, b0 = (yA + 4 * yB + yC) / 6;
        
        

        for (let j = 0; j <= nSegmentos; j++) {
            let t = j / nSegmentos;
            let x = ((a3 * t + a2) * t + a1) * t + a0;
            let y = ((b3 * t + b2) * t + b1) * t + b0;
            pontosDaCurva.push([x, y]);
        }
    }

    return pontosDaCurva;
}

// LIMPA A TELA E OS PONTOS DE CONTROLE
document.addEventListener('keydown', (event) => {
    if (event.key === 'c' || event.key === 'C') {
        const canvas = document.getElementById('viewport');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        curva.pontosDeControle = [];
    }
});


class Curva {
    constructor() {
        this.pontosDeControle = [];
        this.canvas = document.getElementById('viewport');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.addEventListener('click', (event) => this.addPoint(event));
    }

    addPoint(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.pontosDeControle.push([x, y]);
        this.drawPontosControle();
        this.drawCurve();
        console.log(this.pontosDeControle);
        
    }

    drawPontosControle() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'red';
        this.pontosDeControle.forEach(ponto => {
            this.ctx.beginPath();
            this.ctx.arc(ponto[0], ponto[1], 3, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }

    drawCurve() {
        if (this.pontosDeControle.length < 4) return;
        let pontosCurva = calculateBspline(this.pontosDeControle);
        this.ctx.beginPath();
        this.ctx.moveTo(pontosCurva[0], pontosCurva[1]);
        for (let i = 1; i < pontosCurva.length; i++) {
            this.ctx.lineTo(pontosCurva[i][0], pontosCurva[i][1]);
        }
        this.ctx.stroke();
        console.log(pontosCurva);
        
    }
}

const curva = new Curva();
