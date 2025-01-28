class Point2D {
  constructor(x, y) {
      this.x = x;
      this.y = y;
  }
}

class Bspline {
  constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext("2d");
      this.pontosDeControle = [];
      this.ready = false;
      this.rWidth = 10.0;
      this.rHeight = 7.5;
      this.centerX = this.canvas.width / 2;
      this.centerY = this.canvas.height / 2;
      this.pixelSize = Math.max(this.rWidth / this.canvas.width, this.rHeight / this.canvas.height);
      
      this.canvas.addEventListener("mousedown", (e) => this.addPoint(e));
      window.addEventListener("keydown", () => this.finalize());
  }

  addPoint(evt) {
      let x = this.fx(evt.offsetX);
      let y = this.fy(evt.offsetY);
      if (this.ready) {
          this.pontosDeControle = [];
          this.ready = false;
      }
      this.pontosDeControle.push(new Point2D(x, y));
      this.draw();
  }

  finalize() {
      if (this.pontosDeControle.length >= 4) this.ready = true;
      this.draw();
  }

  draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.strokeRect(this.iX(-this.rWidth / 2), this.iY(this.rHeight / 2), this.canvas.width, this.canvas.height);
      
      this.pontosDeControle.forEach((p, i) => {
          this.ctx.fillRect(this.iX(p.x) - 2, this.iY(p.y) - 2, 4, 4);
          if (i > 0) {
              this.ctx.beginPath();
              this.ctx.moveTo(this.iX(this.pontosDeControle[i - 1].x), this.iY(this.pontosDeControle[i - 1].y));
              this.ctx.lineTo(this.iX(p.x), this.iY(p.y));
              this.ctx.stroke();
          }
      });

      if (this.ready) this.drawBspline();
  }

  drawBspline() {
    let m = 50; // Número de segmentos
    let n = this.pontosDeControle.length;
    if (n < 2) return;
    // Criar pontos extras para clamping (repetindo o primeiro e último pontos)
    let extendedpontosDeControle = [
        this.pontosDeControle[0], this.pontosDeControle[0], // Repete o primeiro ponto
        ...this.pontosDeControle,
        this.pontosDeControle[n - 1], this.pontosDeControle[n - 1] // Repete o último ponto
    ];

    this.ctx.beginPath();
    let curvas = [];
    for (let i = 1; i < extendedpontosDeControle.length - 2; i++) {
        let pontosDaCurva = [];
        let [xA, xB, xC, xD] = [
            extendedpontosDeControle[i - 1].x, 
            extendedpontosDeControle[i].x, 
            extendedpontosDeControle[i + 1].x, 
            extendedpontosDeControle[i + 2].x
        ];
        let [yA, yB, yC, yD] = [
            extendedpontosDeControle[i - 1].y, 
            extendedpontosDeControle[i].y, 
            extendedpontosDeControle[i + 1].y, 
            extendedpontosDeControle[i + 2].y
        ];

        let a3 = (-xA + 3 * (xB - xC) + xD) / 6, b3 = (-yA + 3 * (yB - yC) + yD) / 6;
        let a2 = (xA - 2 * xB + xC) / 2, b2 = (yA - 2 * yB + yC) / 2;
        let a1 = (xC - xA) / 2, b1 = (yC - yA) / 2;
        let a0 = (xA + 4 * xB + xC) / 6, b0 = (yA + 4 * yB + yC) / 6;

        for (let j = 0; j <= m; j++) {
            let t = j / m;
            let x = ((a3 * t + a2) * t + a1) * t + a0;
            let y = ((b3 * t + b2) * t + b1) * t + b0;
            pontosDaCurva.push(x, y);
            if (j === 0 && i === 1) this.ctx.moveTo(this.iX(x), this.iY(y));
            else this.ctx.lineTo(this.iX(x), this.iY(y));
        }
        curvas.push(pontosDaCurva);
        
    }
    this.ctx.stroke();
    }


  iX(x) { return Math.round(this.centerX + x / this.pixelSize); }
  iY(y) { return Math.round(this.centerY - y / this.pixelSize); }
  fx(x) { return (x - this.centerX) * this.pixelSize; }
  fy(y) { return (this.centerY - y) * this.pixelSize; }
}

document.addEventListener("DOMContentLoaded", () => new Bspline("viewport"));
