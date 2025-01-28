const X = [100, 200, 300, 400, 500];
const Y = [100, 200, 150, 100, 200];
const TotMarks = X.length; // Número total de pontos na curva

const canvas = document.getElementById('bsplineCanvas');
const ctx = canvas.getContext('2d');


X.forEach((x, index) => {
    const y = Y[index];
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
});

let i = 0;

while (i + 3 < TotMarks) { // TotMarks = número total de pontos na curva
    let RangeX = Math.abs(X[i + 2] - X[i + 1]);
    let RangeY = Math.abs(Y[i + 2] - Y[i + 1]);
    let Step = (RangeX > RangeY) ? 1.0 / RangeX : 1.0 / RangeY;

    for (let t = 0; t <= 1; t += Step) {
        // Fórmula da Curva de Bézier cúbica
        let x = (
            ((-1 * Math.pow(t, 3) + 3 * Math.pow(t, 2) - 3 * t + 1) * X[i]) +
            ((3 * Math.pow(t, 3) - 6 * Math.pow(t, 2) + 0 * t + 4) * X[i + 1]) +
            ((-3 * Math.pow(t, 3) + 3 * Math.pow(t, 2) + 3 * t + 1) * X[i + 2]) +
            ((Math.pow(t, 3) + 0 * Math.pow(t, 2) + 0 * t + 0) * X[i + 3])
        ) / 6;

        let y = (
            ((-1 * Math.pow(t, 3) + 3 * Math.pow(t, 2) - 3 * t + 1) * Y[i]) +
            ((3 * Math.pow(t, 3) - 6 * Math.pow(t, 2) + 0 * t + 4) * Y[i + 1]) +
            ((-3 * Math.pow(t, 3) + 3 * Math.pow(t, 2) + 3 * t + 1) * Y[i + 2]) +
            ((Math.pow(t, 3) + 0 * Math.pow(t, 2) + 0 * t + 0) * Y[i + 3])
        ) / 6;

        if (t === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    i++;
}
ctx.stroke();