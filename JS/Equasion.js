'use strict';
/**
 * Для читаемости, где p и q - точки прямой
 */
const p_n = 0;
const q_n = 1;

function MultiplyMatrix(A,B)
{
    var rowsA = A.length, colsA = A[0].length,
        rowsB = B.length, colsB = B[0].length,
        C = [];
    if (colsA != rowsB) return false;
    for (var i = 0; i < rowsA; i++) C[ i ] = [];
    for (var k = 0; k < colsB; k++)
     { for (var i = 0; i < rowsA; i++)
        { var t = 0;
          for (var j = 0; j < rowsB; j++) t += A[ i ][j]*B[j][k];
          C[ i ][k] = t;
        }
     }
    return C;
}

function DegToRad(degrees) {
    return degrees * (Math.PI / 180);
}

class LineEquasion {    
    constructor (p, q) {
        /*  Матрица прямой, заданная как векторное пр-ве 2-х точек:
            |i   j   k|
            |x1  y1  1|
            |x2  y2  1|
        */
        this.mat = [[p.x, p.y, 1],
                    [q.x, q.y, 1]];
        /** Флаг деления на ноль */
        var divByZeroOccured = false;
        /** Значения A, B, C для вывода в общую форму */
        var a = 0, b = 0, c = 0;
        /** Поле с общей формой */
        var eq_str = this.toString();
        var norm_required = false;
    }

    transfer (d) {
        let transf_matr = [[1  , 0  , 0],
                           [0  , 1  , 0],
                           [d.x, d.y, 1]];
        return MultiplyMatrix(this.mat, transf_matr);
    }

    scale (scale_parms) {
        let scale_matr =  [[scale_parms.a  , 0  , 0],
                           [0  , scale_parms.d  , 0],
                           [0  ,        0  ,      1]];
        return MultiplyMatrix(this.mat, scale_matr);
    }

    rotate (angle) {
        let radAngle = DegToRad(angle);
        let rot_matr =  [[ parseFloat(Math.cos(radAngle)), parseFloat(Math.sin(radAngle))  , 0],
                           [parseFloat(-Math.sin(radAngle)), parseFloat(Math.cos(radAngle)) , 0],
                           [0                  ,                  0  , 1]];
        return MultiplyMatrix(this.mat, rot_matr);
    }

    static absMatr(matr) {
        if (matr instanceof Array) {
            let absArr = [[], [], []];
            for (let i = 0; i < matr.length; i++) {
                for (let j = 0; j < matr[i].length; j++) {
                    absArr[i][j] = Math.abs(matr[i][j]);
                }
            }
            return absArr;
        }
        return false;
    }

    coversion_wrapper (event) {
        if (pendingConversion != null) {
            let width = svgPanel.getAttribute('width');
            let height = svgPanel.getAttribute('height');
            switch (pendingConversion) {
                case "transfer":
                    let dest_x = prompt("Введите новую координату Х:");
                    let dest_y = prompt("Введите новую координату Y:");
                    if ((dest_x > width || dest_x < 1) || (dest_y > height || dest_y < 1)) {
                        alert("Пожалуйста, введите корректные данные!")
                        return;
                    }
                    var diff = {
                        x: dest_x - this.center.x,
                        y: dest_y - this.center.y
                    };
                    this.mat = this.eq.transfer(diff);
                    break;
                case "scale":
                    let scale_x = prompt("Масштаб относительно оси Х:");
                    let scale_y = prompt("Масштаб относительно оси Y:");
                    if ((scale_x <= 0) || (scale_y <= 0)) {
                        alert("Пожалуйста, введите корректные данные!")
                        return;
                    }
                    var scale_parms = {
                        a: scale_x,
                        d: scale_y
                    };
                    this.mat = this.eq.scale(scale_parms);
                    ;
                    break;
                case "rotate":
                    let angle = prompt("Введите угол поворота в градусах:");
                    // if ((angle > 360) || (angle < -360)) {
                    //     alert("Пожалуйста, введите корректные данные!")
                    //     return;
                    // }
                    let lineLength = Line.getDist(this.refPoints[0], this.refPoints[1]);
                    this.mat = this.eq.rotate(angle);
                    var begPoint = {
                        x: mat[p_n][0],
                        y: mat[p_n][1]
                    };
                    var endPoint = {
                        x: mat[q_n][0],
                        y: mat[q_n][1]
                    };
                    if (begPoint.)
                    break;
                case "mirror":
        
                    break;
                case "project":
    
                    break;
            
                default:
                    break;
            }
            let mat = this.mat;
            this.x1 = mat[p_n][0];
            this.y1 = mat[p_n][1];
            this.x2 = mat[q_n][0];
            this.y2 = mat[q_n][1];
            this.updateRefPointsCoords();
            drawPanel.style.cursor = "default";
            pendingConversion = null;
            instruments[0].click();
        }
    }

    updateEquasionByPoints (p, q) {
        this.mat[p_n][0] = p.x;
        this.mat[p_n][1] = p.y;
        this.mat[q_n][0] = q.x;
        this.mat[q_n][1] = q.y;
    }

    normalize () {
        if (this.C == 0) {
            /** Нормализация не удалась, выводим в ненормализованном виде */
            this.divByZeroOccured = true;
            this.a = this.A;
            this.b = this.B;
            this.c = this.C;
            return;
        }
        this.a = this.A / this.C;
        this.b = this.B / this.C;
        this.c = 1;
    }

    toString () {
        if (this.norm_required) {
            this.normalize();
        }
        else {
            this.a = this.A;
            this.b = this.B;
            this.c = this.C;
        }
        let outStr, xSign, ySign, zSign;
        if (this.divByZeroOccured == true || !this.norm_required) {
            this.divByZeroOccured = false;
            xSign = this.a + "x ";
            if (this.b < 0) {
                ySign = "- " + Math.abs(this.b);
            }
            else {
                ySign = "+ " + this.b;
            }
            ySign += "y ";
            if (this.c < 0) {
                zSign = "- " + Math.abs(this.c);
            }
            else {
                zSign = "+ " + this.c;
            }
        }
        else {
            xSign = this.a.toFixed(5) + "x ";
            if (this.b < 0) {
                ySign = "- " + Math.abs(this.b.toFixed(5));
            }
            else {
                ySign = "+ " + this.b.toFixed(5);
            }
            ySign += "y ";
            zSign = "+ " + this.c;
        }
        outStr = xSign + ySign + zSign;
        this.eq_str = outStr;
        return outStr;
    }


    get A () {
        let mat = this.mat;
        return mat[p_n][1] * mat[q_n][2] - mat[p_n][2] * mat[q_n][1];
    }

    get B () {
        let mat = this.mat;
        return mat[p_n][0] * mat[q_n][2] - mat[p_n][2] * mat[q_n][0];
    }

    get C () {
        let mat = this.mat;
        return mat[p_n][0] * mat[q_n][1] - mat[p_n][1] * mat[q_n][0];
    }
    
    set A (val) {
        this._A = val;
    }

    set B (val) {
        this._B = val;
    }

    set C (val) {
        this._C = val;
    }
    
}


var isConverter = function(element) {
    if (element.alt == currentInstrument.alt){
        currentConversion = element;
        return true;
    }
    return false;
}

for (let i = 0; i < transferTools.length; i++) {
    transferTools[i].addEventListener('click', function () {
        drawPanel.style.cursor = "crosshair";
        switch (transferTools[i].alt) {
            case "Перемещение":
                pendingConversion = "transfer";
                break;
            case "Масштабирование":
                pendingConversion = "scale";
                break;
            case "Вращение":
                pendingConversion = "rotate";
                break;
            case "Зеркалирование":
                pendingConversion = "mirror";
                break;
            case "Проецирование":
                pendingConversion = "project";
                break;
        
            default:
                break;
        }
    })
}