
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
    //pontosDeControle = clampingBspline(pontosDeControle);
    /*
    if (document.getElementById('clamped').checked) {
        pontosDeControle = clampingBspline(pontosDeControle);
    }

    if (document.getElementById('closed').checked) {
        pontosDeControle = closedBspline(pontosDeControle);
    }*/


    let nSegmentos = 1;
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
        let [zA, zB, zC, zD] = [
            pontosDeControle[i - 1][2], 
            pontosDeControle[i][2], 
            pontosDeControle[i + 1][2], 
            pontosDeControle[i + 2][2]
        ];
        
        let a3 = (-xA + 3 * (xB - xC) + xD) / 6; 
        let b3 = (-yA + 3 * (yB - yC) + yD) / 6;
        let c3 = (-zA + 3 * (zB - zC) + zD) / 6;

        let a2 = (xA - 2 * xB + xC) / 2;
        let b2 = (yA - 2 * yB + yC) / 2;
        let c2 = (zA - 2 * zB + zC) / 2;
        
        let a1 = (xC - xA) / 2;
        let b1 = (yC - yA) / 2;
        let c1 = (zC - zA) / 2;

        let a0 = (zA + 4 * xB + xC) / 6;
        let b0 = (yA + 4 * yB + yC) / 6;
        let c0 = (zA + 4 * zB + zC) / 6;
        
        

        for (let j = 0; j <= nSegmentos; j++) {
            let t = j / nSegmentos;
            let x = ((a3 * t + a2) * t + a1) * t + a0;
            let y = ((b3 * t + b2) * t + b1) * t + b0;
            let z = ((c3 * t + c2) * t + c1) * t + c0;
            pontosDaCurva.push([x, y, z]);
        }
    }

    return pontosDaCurva;
}

function createGridBspline(gridSRUPontosControle){
    let gridBspline = [];
    let auxPontosDeControle = [];
    let lengthI = gridSRUPontosControle.length;
    let lengthJ = gridSRUPontosControle[0].length;
    //PARA N
    // PEGAR OS INDICES PARA LINHAS
    for (let i = 1; i < lengthI-1; i++) {
        auxPontosDeControle = [];
        for (let j = 0; j < lengthJ; j++) {
            auxPontosDeControle.push(gridSRUPontosControle[i][j]);
        }
        console.log('Pontos de controle',auxPontosDeControle);

        let pontosCurva = calculateBspline(auxPontosDeControle);
        console.log('Pontos da curva',pontosCurva);
        
        gridBspline.push(calculateBspline(auxPontosDeControle));
    }
    console.log("grid ",gridBspline);
    
    return gridBspline;
}


const matrix = [
    [
      [0, 10, 0],
      [3.3333333333333335, 10, 0],
      [6.666666666666667, 10, 0],
      [10, 10, 0]
    ],
    [
      [0, 11.666666666666666, 0],
      [3.3333333333333335, 11.666666666666666, 0],
      [6.666666666666667, 11.666666666666666, 0],
      [10, 11.666666666666666, 0]
    ],
    [
      [0, 13.333333333333332, 0],
      [3.3333333333333335, 13.333333333333332, 0],
      [6.666666666666667, 13.333333333333332, 0],
      [10, 13.333333333333332, 0]
    ],
    [
      [0, 15, 0],
      [3.3333333333333335, 15, 0],
      [6.666666666666667, 15, 0],
      [10, 15, 0]
    ],
    [
      [0, 16.666666666666668, 0],
      [3.3333333333333335, 16.666666666666668, 0],
      [6.666666666666667, 16.666666666666668, 0],
      [15, 16.666666666666668, 0]
    ]
  ];
  
console.log('Matriz',matrix);

let gridBspline = createGridBspline(matrix);

