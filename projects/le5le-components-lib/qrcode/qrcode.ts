const QRErrorCorrectionLevel: any = {
  L: 1,
  M: 0,
  Q: 3,
  H: 2
};

const QRMaskPattern = {
  PATTERN000: 0,
  PATTERN001: 1,
  PATTERN010: 2,
  PATTERN011: 3,
  PATTERN100: 4,
  PATTERN101: 5,
  PATTERN110: 6,
  PATTERN111: 7
};

const QRMode: any = {
  // tslint:disable-next-line:no-bitwise
  MODE_NUMBER: 1 << 0,
  // tslint:disable-next-line:no-bitwise
  MODE_ALPHA_NUM: 1 << 1,
  // tslint:disable-next-line:no-bitwise
  MODE_8BIT_BYTE: 1 << 2,
  // tslint:disable-next-line:no-bitwise
  MODE_KANJI: 1 << 3
};

export class QRMath {
  EXP_TABLE: any[] = new Array(256);
  LOG_TABLE: any[] = new Array(256);

  constructor() {
    for (let i = 0; i < 8; i += 1) {
      // tslint:disable-next-line:no-bitwise
      this.EXP_TABLE[i] = 1 << i;
    }
    for (let i = 8; i < 256; i += 1) {
      // tslint:disable-next-line:no-bitwise
      this.EXP_TABLE[i] =
        // tslint:disable-next-line:no-bitwise
        this.EXP_TABLE[i - 4] ^
        this.EXP_TABLE[i - 5] ^
        this.EXP_TABLE[i - 6] ^
        this.EXP_TABLE[i - 8];
    }
    for (let i = 0; i < 255; i += 1) {
      this.LOG_TABLE[this.EXP_TABLE[i]] = i;
    }
  }

  glog(n: number): any {
    if (n < 1) {
      throw new Error('glog(' + n + ')');
    }

    return this.LOG_TABLE[n];
  }

  gexp(n: number): any {
    while (n < 0) {
      n += 255;
    }

    while (n >= 256) {
      n -= 255;
    }

    return this.EXP_TABLE[n];
  }
}

export class QrPolynomial {
  _num: any[];
  qrMath: QRMath = new QRMath();

  constructor(num: any, shift: any) {
    this.init(num, shift);
  }

  init(num: any, shift: any) {
    // tslint:disable-next-line:triple-equals
    if (typeof num.length == 'undefined') {
      throw new Error(num.length + '/' + shift);
    }

    let offset = 0;
    // tslint:disable-next-line:triple-equals
    while (offset < num.length && num[offset] == 0) {
      offset += 1;
    }
    this._num = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i += 1) {
      this._num[i] = num[i + offset];
    }
  }

  getAt(index: number): any {
    return this._num[index];
  }

  getLength(): number {
    return this._num.length;
  }

  multiply(e: any) {
    // tslint:disable-next-line:prefer-const
    let num = new Array(this.getLength() + e.getLength() - 1);
    for (let i = 0; i < this.getLength(); i += 1) {
      for (let j = 0; j < e.getLength(); j += 1) {
        // tslint:disable-next-line:no-bitwise
        num[i + j] ^= this.qrMath.gexp(
          this.qrMath.glog(this.getAt(i)) + this.qrMath.glog(e.getAt(j))
        );
      }
    }

    this.init(num, 0);
  }

  mod(e: any) {
    if (this.getLength() - e.getLength() < 0) {
      return;
    }

    const ratio =
      this.qrMath.glog(this.getAt(0)) - this.qrMath.glog(e.getAt(0));

    const num = new Array(this.getLength());
    for (let i = 0; i < this.getLength(); i += 1) {
      num[i] = this.getAt(i);
    }

    for (let i = 0; i < e.getLength(); i += 1) {
      // tslint:disable-next-line:no-bitwise
      num[i] ^= this.qrMath.gexp(this.qrMath.glog(e.getAt(i)) + ratio);
    }

    // recursive call
    this.init(num, 0);
    this.mod(e);
  }
}

export class QRUtil {
  PATTERN_POSITION_TABLE: any[][] = [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170]
  ];
  G15 = (1 << 10) |
  (1 << 8) |
  (1 << 5) |
  (1 << 4) |
  (1 << 2) |
  (1 << 1) |
  (1 << 0);
  G18 = (1 << 12) |
  (1 << 11) |
  (1 << 10) |
  (1 << 9) |
  (1 << 8) |
  (1 << 5) |
  (1 << 2) |
  (1 << 0);
  G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

  constructor() {}

  getBCHDigit(data: number): number {
    let digit = 0;
    while (data != 0) {
      digit += 1;
      data >>>= 1;
    }
    return digit;
  }

  getBCHTypeInfo(data: number): number {
    let d: number = data << 10;
    while (this.getBCHDigit(d) - this.getBCHDigit(this.G15) >= 0) {
      d ^= this.G15 << (this.getBCHDigit(d) - this.getBCHDigit(this.G15));
    }
    return ((data << 10) | d) ^ this.G15_MASK;
  }

  getBCHTypeNumber(data: number): number {
    let d = data << 12;
    while (this.getBCHDigit(d) - this.getBCHDigit(this.G18) >= 0) {
      d ^= this.G18 << (this.getBCHDigit(d) - this.getBCHDigit(this.G18));
    }
    return (data << 12) | d;
  }

  getPatternPosition(typeNumber: number): any[] {
    return this.PATTERN_POSITION_TABLE[typeNumber - 1];
  }

  getMaskFunction(maskPattern: number): any {
    switch (maskPattern) {
      case QRMaskPattern.PATTERN000:
        return function(i: any, j: any) {
          return (i + j) % 2 == 0;
        };
      case QRMaskPattern.PATTERN001:
        return function(i: any, j: any) {
          return i % 2 == 0;
        };
      case QRMaskPattern.PATTERN010:
        return function(i: any, j: any) {
          return j % 3 == 0;
        };
      case QRMaskPattern.PATTERN011:
        return function(i: any, j: any) {
          return (i + j) % 3 == 0;
        };
      case QRMaskPattern.PATTERN100:
        return function(i: any, j: any) {
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
        };
      case QRMaskPattern.PATTERN101:
        return function(i: any, j: any) {
          return (i * j) % 2 + (i * j) % 3 == 0;
        };
      case QRMaskPattern.PATTERN110:
        return function(i: any, j: any) {
          return ((i * j) % 2 + (i * j) % 3) % 2 == 0;
        };
      case QRMaskPattern.PATTERN111:
        return function(i: any, j: any) {
          return ((i * j) % 3 + (i + j) % 2) % 2 == 0;
        };

      default:
        throw new Error('bad maskPattern:' + maskPattern);
    }
  }

  getErrorCorrectPolynomial(errorCorrectLength: number): QrPolynomial {
    const a: QrPolynomial = new QrPolynomial([1], 0);
    const qrMath: QRMath = new QRMath();
    for (let i = 0; i < errorCorrectLength; i += 1) {
      a.multiply(new QrPolynomial([1, qrMath.gexp(i)], 0));
    }
    return a;
  }

  getLengthInBits(mode: number, type: number): number {
    if (1 <= type && type < 10) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 10;
        case QRMode.MODE_ALPHA_NUM:
          return 9;
        case QRMode.MODE_8BIT_BYTE:
          return 8;
        case QRMode.MODE_KANJI:
          return 8;
        default:
          throw new Error('mode:' + mode);
      }
    } else if (type < 27) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 12;
        case QRMode.MODE_ALPHA_NUM:
          return 11;
        case QRMode.MODE_8BIT_BYTE:
          return 16;
        case QRMode.MODE_KANJI:
          return 10;
        default:
          throw new Error('mode:' + mode);
      }
    } else if (type < 41) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 14;
        case QRMode.MODE_ALPHA_NUM:
          return 13;
        case QRMode.MODE_8BIT_BYTE:
          return 16;
        case QRMode.MODE_KANJI:
          return 12;
        default:
          throw new Error('mode:' + mode);
      }
    } else {
      throw new Error('type:' + type);
    }
  }

  getLostPoint(qrcode: QrCode): number {
    const moduleCount: number = qrcode.getModuleCount();
    let lostPoint = 0;

    // LEVEL1
    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount; col += 1) {
        let sameCount = 0;
        const dark = qrcode.isDark(row, col);

        for (let r = -1; r <= 1; r += 1) {
          if (row + r < 0 || moduleCount <= row + r) {
            continue;
          }

          for (let c = -1; c <= 1; c += 1) {
            if (col + c < 0 || moduleCount <= col + c) {
              continue;
            }

            if (r == 0 && c == 0) {
              continue;
            }

            if (dark == qrcode.isDark(row + r, col + c)) {
              sameCount += 1;
            }
          }
        }

        if (sameCount > 5) {
          lostPoint += 3 + sameCount - 5;
        }
      }
    }

    // LEVEL2
    for (let row = 0; row < moduleCount - 1; row += 1) {
      for (let col = 0; col < moduleCount - 1; col += 1) {
        let count = 0;
        if (qrcode.isDark(row, col)) {
          count += 1;
        }
        if (qrcode.isDark(row + 1, col)) {
          count += 1;
        }
        if (qrcode.isDark(row, col + 1)) {
          count += 1;
        }
        if (qrcode.isDark(row + 1, col + 1)) {
          count += 1;
        }
        if (count == 0 || count == 4) {
          lostPoint += 3;
        }
      }
    }

    // LEVEL3
    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount - 6; col += 1) {
        if (
          qrcode.isDark(row, col) &&
          !qrcode.isDark(row, col + 1) &&
          qrcode.isDark(row, col + 2) &&
          qrcode.isDark(row, col + 3) &&
          qrcode.isDark(row, col + 4) &&
          !qrcode.isDark(row, col + 5) &&
          qrcode.isDark(row, col + 6)
        ) {
          lostPoint += 40;
        }
      }
    }

    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount - 6; row += 1) {
        if (
          qrcode.isDark(row, col) &&
          !qrcode.isDark(row + 1, col) &&
          qrcode.isDark(row + 2, col) &&
          qrcode.isDark(row + 3, col) &&
          qrcode.isDark(row + 4, col) &&
          !qrcode.isDark(row + 5, col) &&
          qrcode.isDark(row + 6, col)
        ) {
          lostPoint += 40;
        }
      }
    }

    // LEVEL4
    let darkCount = 0;
    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount; row += 1) {
        if (qrcode.isDark(row, col)) {
          darkCount += 1;
        }
      }
    }

    const ratio =
      Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
    lostPoint += ratio * 10;

    return lostPoint;
  }
}

export class QRRSBlock {
  RS_BLOCK_TABLE: any[][] = [
    // L
    // M
    // Q
    // H

    // 1
    [1, 26, 19],
    [1, 26, 16],
    [1, 26, 13],
    [1, 26, 9],

    // 2
    [1, 44, 34],
    [1, 44, 28],
    [1, 44, 22],
    [1, 44, 16],

    // 3
    [1, 70, 55],
    [1, 70, 44],
    [2, 35, 17],
    [2, 35, 13],

    // 4
    [1, 100, 80],
    [2, 50, 32],
    [2, 50, 24],
    [4, 25, 9],

    // 5
    [1, 134, 108],
    [2, 67, 43],
    [2, 33, 15, 2, 34, 16],
    [2, 33, 11, 2, 34, 12],

    // 6
    [2, 86, 68],
    [4, 43, 27],
    [4, 43, 19],
    [4, 43, 15],

    // 7
    [2, 98, 78],
    [4, 49, 31],
    [2, 32, 14, 4, 33, 15],
    [4, 39, 13, 1, 40, 14],

    // 8
    [2, 121, 97],
    [2, 60, 38, 2, 61, 39],
    [4, 40, 18, 2, 41, 19],
    [4, 40, 14, 2, 41, 15],

    // 9
    [2, 146, 116],
    [3, 58, 36, 2, 59, 37],
    [4, 36, 16, 4, 37, 17],
    [4, 36, 12, 4, 37, 13],

    // 10
    [2, 86, 68, 2, 87, 69],
    [4, 69, 43, 1, 70, 44],
    [6, 43, 19, 2, 44, 20],
    [6, 43, 15, 2, 44, 16],

    // 11
    [4, 101, 81],
    [1, 80, 50, 4, 81, 51],
    [4, 50, 22, 4, 51, 23],
    [3, 36, 12, 8, 37, 13],

    // 12
    [2, 116, 92, 2, 117, 93],
    [6, 58, 36, 2, 59, 37],
    [4, 46, 20, 6, 47, 21],
    [7, 42, 14, 4, 43, 15],

    // 13
    [4, 133, 107],
    [8, 59, 37, 1, 60, 38],
    [8, 44, 20, 4, 45, 21],
    [12, 33, 11, 4, 34, 12],

    // 14
    [3, 145, 115, 1, 146, 116],
    [4, 64, 40, 5, 65, 41],
    [11, 36, 16, 5, 37, 17],
    [11, 36, 12, 5, 37, 13],

    // 15
    [5, 109, 87, 1, 110, 88],
    [5, 65, 41, 5, 66, 42],
    [5, 54, 24, 7, 55, 25],
    [11, 36, 12, 7, 37, 13],

    // 16
    [5, 122, 98, 1, 123, 99],
    [7, 73, 45, 3, 74, 46],
    [15, 43, 19, 2, 44, 20],
    [3, 45, 15, 13, 46, 16],

    // 17
    [1, 135, 107, 5, 136, 108],
    [10, 74, 46, 1, 75, 47],
    [1, 50, 22, 15, 51, 23],
    [2, 42, 14, 17, 43, 15],

    // 18
    [5, 150, 120, 1, 151, 121],
    [9, 69, 43, 4, 70, 44],
    [17, 50, 22, 1, 51, 23],
    [2, 42, 14, 19, 43, 15],

    // 19
    [3, 141, 113, 4, 142, 114],
    [3, 70, 44, 11, 71, 45],
    [17, 47, 21, 4, 48, 22],
    [9, 39, 13, 16, 40, 14],

    // 20
    [3, 135, 107, 5, 136, 108],
    [3, 67, 41, 13, 68, 42],
    [15, 54, 24, 5, 55, 25],
    [15, 43, 15, 10, 44, 16],

    // 21
    [4, 144, 116, 4, 145, 117],
    [17, 68, 42],
    [17, 50, 22, 6, 51, 23],
    [19, 46, 16, 6, 47, 17],

    // 22
    [2, 139, 111, 7, 140, 112],
    [17, 74, 46],
    [7, 54, 24, 16, 55, 25],
    [34, 37, 13],

    // 23
    [4, 151, 121, 5, 152, 122],
    [4, 75, 47, 14, 76, 48],
    [11, 54, 24, 14, 55, 25],
    [16, 45, 15, 14, 46, 16],

    // 24
    [6, 147, 117, 4, 148, 118],
    [6, 73, 45, 14, 74, 46],
    [11, 54, 24, 16, 55, 25],
    [30, 46, 16, 2, 47, 17],

    // 25
    [8, 132, 106, 4, 133, 107],
    [8, 75, 47, 13, 76, 48],
    [7, 54, 24, 22, 55, 25],
    [22, 45, 15, 13, 46, 16],

    // 26
    [10, 142, 114, 2, 143, 115],
    [19, 74, 46, 4, 75, 47],
    [28, 50, 22, 6, 51, 23],
    [33, 46, 16, 4, 47, 17],

    // 27
    [8, 152, 122, 4, 153, 123],
    [22, 73, 45, 3, 74, 46],
    [8, 53, 23, 26, 54, 24],
    [12, 45, 15, 28, 46, 16],

    // 28
    [3, 147, 117, 10, 148, 118],
    [3, 73, 45, 23, 74, 46],
    [4, 54, 24, 31, 55, 25],
    [11, 45, 15, 31, 46, 16],

    // 29
    [7, 146, 116, 7, 147, 117],
    [21, 73, 45, 7, 74, 46],
    [1, 53, 23, 37, 54, 24],
    [19, 45, 15, 26, 46, 16],

    // 30
    [5, 145, 115, 10, 146, 116],
    [19, 75, 47, 10, 76, 48],
    [15, 54, 24, 25, 55, 25],
    [23, 45, 15, 25, 46, 16],

    // 31
    [13, 145, 115, 3, 146, 116],
    [2, 74, 46, 29, 75, 47],
    [42, 54, 24, 1, 55, 25],
    [23, 45, 15, 28, 46, 16],

    // 32
    [17, 145, 115],
    [10, 74, 46, 23, 75, 47],
    [10, 54, 24, 35, 55, 25],
    [19, 45, 15, 35, 46, 16],

    // 33
    [17, 145, 115, 1, 146, 116],
    [14, 74, 46, 21, 75, 47],
    [29, 54, 24, 19, 55, 25],
    [11, 45, 15, 46, 46, 16],

    // 34
    [13, 145, 115, 6, 146, 116],
    [14, 74, 46, 23, 75, 47],
    [44, 54, 24, 7, 55, 25],
    [59, 46, 16, 1, 47, 17],

    // 35
    [12, 151, 121, 7, 152, 122],
    [12, 75, 47, 26, 76, 48],
    [39, 54, 24, 14, 55, 25],
    [22, 45, 15, 41, 46, 16],

    // 36
    [6, 151, 121, 14, 152, 122],
    [6, 75, 47, 34, 76, 48],
    [46, 54, 24, 10, 55, 25],
    [2, 45, 15, 64, 46, 16],

    // 37
    [17, 152, 122, 4, 153, 123],
    [29, 74, 46, 14, 75, 47],
    [49, 54, 24, 10, 55, 25],
    [24, 45, 15, 46, 46, 16],

    // 38
    [4, 152, 122, 18, 153, 123],
    [13, 74, 46, 32, 75, 47],
    [48, 54, 24, 14, 55, 25],
    [42, 45, 15, 32, 46, 16],

    // 39
    [20, 147, 117, 4, 148, 118],
    [40, 75, 47, 7, 76, 48],
    [43, 54, 24, 22, 55, 25],
    [10, 45, 15, 67, 46, 16],

    // 40
    [19, 148, 118, 6, 149, 119],
    [18, 75, 47, 31, 76, 48],
    [34, 54, 24, 34, 55, 25],
    [20, 45, 15, 61, 46, 16]
  ];
  totalCount: number;
  dataCount: number;

  constructor(totalCount: number, dataCount: number) {
    this.totalCount = totalCount;
    this.dataCount = dataCount;
  }

  getRsBlockTable = function(
    typeNumber: number,
    errorCorrectionLevel: number
  ): any[] {
    switch (errorCorrectionLevel) {
      case QRErrorCorrectionLevel.L:
        return this.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectionLevel.M:
        return this.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectionLevel.Q:
        return this.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectionLevel.H:
        return this.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default:
        return undefined;
    }
  };

  getRSBlocks(typeNumber: number, errorCorrectionLevel: number): any[] {
    let rsBlock: any = this.getRsBlockTable(typeNumber, errorCorrectionLevel);

    if (typeof rsBlock == 'undefined') {
      throw new Error(
        'bad rs block @ typeNumber:' +
          typeNumber +
          '/errorCorrectionLevel:' +
          errorCorrectionLevel
      );
    }

    let length = rsBlock.length / 3;
    let list: any[] = new Array();
    for (let i = 0; i < length; i += 1) {
      let count = rsBlock[i * 3 + 0];
      let totalCount = rsBlock[i * 3 + 1];
      let dataCount = rsBlock[i * 3 + 2];

      for (let j = 0; j < count; j += 1) {
        list.push(new QRRSBlock(totalCount, dataCount));
      }
    }
    return list;
  }
}

export class qrBitBuffer {
  _buffer: any[] = new Array();
  _length: number = 0;

  constructor() {}

  getBuffer(): any[] {
    return this._buffer;
  }

  getAt = function(index: number): boolean {
    let bufIndex = Math.floor(index / 8);
    return ((this._buffer[bufIndex] >>> (7 - index % 8)) & 1) == 1;
  };

  put(num: number, length: number) {
    for (let i = 0; i < length; i += 1) {
      this.putBit(((num >>> (length - i - 1)) & 1) == 1);
    }
  }

  getLengthInBits = function(): number {
    return this._length;
  };

  putBit(bit: any) {
    let bufIndex = Math.floor(this._length / 8);
    if (this._buffer.length <= bufIndex) {
      this._buffer.push(0);
    }

    if (bit) {
      this._buffer[bufIndex] |= 0x80 >>> (this._length % 8);
    }

    this._length += 1;
  }
}

let stringToBytes = function(s: any): any {
  let bytes = new Array();
  for (let i = 0; i < s.length; i += 1) {
    let c = s.charCodeAt(i);
    bytes.push(c & 0xff);
  }
  return bytes;
};

export class qr8BitByte {
  _mode = QRMode.MODE_8BIT_BYTE;
  _data: any;
  _bytes: any;

  constructor(data: any) {
    this._data = data;
    this._bytes = stringToBytes(data);
  }

  getMode = function() {
    return this._mode;
  };

  getLength(buffer: any) {
    return this._bytes.length;
  }

  write(buffer: any) {
    for (let i = 0; i < this._bytes.length; i += 1) {
      buffer.put(this._bytes[i], 8);
    }
  }
}

export class lzwTable {
  _map: any = {};
  _size: number = 0;

  constructor() {}

  add(key: any) {
    if (this.contains(key)) {
      throw new Error('dup key:' + key);
    }
    this._map[key] = this._size;
    this._size += 1;
  }

  size(): number {
    return this._size;
  }

  indexOf(key: any): any {
    return this._map[key];
  }

  contains(key: any): boolean {
    return typeof this._map[key] != 'undefined';
  }
}

export class bitOutputStream {
  _out: any;
  _bitLength: number = 0;
  _bitBuffer: number = 0;

  constructor(out: any) {
    this._out = out;
  }

  write(data: any, length: number) {
    if (data >>> length != 0) {
      throw new Error('length over');
    }

    while (this._bitLength + length >= 8) {
      this._out.writeByte(0xff & ((data << this._bitLength) | this._bitBuffer));
      length -= 8 - this._bitLength;
      data >>>= 8 - this._bitLength;
      this._bitBuffer = 0;
      this._bitLength = 0;
    }

    this._bitBuffer = (data << this._bitLength) | this._bitBuffer;
    this._bitLength = this._bitLength + length;
  }

  flush() {
    if (this._bitLength > 0) {
      this._out.writeByte(this._bitBuffer);
    }
  }
}

export class byteArrayOutputStream {
  _bytes: any = new Array();

  constructor() {}

  writeByte(b: any) {
    this._bytes.push(b & 0xff);
  }

  writeShort(i: any) {
    this.writeByte(i);
    this.writeByte(i >>> 8);
  }

  writeBytes(b: any, off: any, len: number) {
    off = off || 0;
    len = len || b.length;
    for (let i = 0; i < len; i += 1) {
      this.writeByte(b[i + off]);
    }
  }

  writeString(s: any) {
    for (let i = 0; i < s.length; i += 1) {
      this.writeByte(s.charCodeAt(i));
    }
  }

  toByteArray(): any {
    return this._bytes;
  }

  toString(): string {
    let s = '';
    s += '[';
    for (let i = 0; i < this._bytes.length; i += 1) {
      if (i > 0) {
        s += ',';
      }
      s += this._bytes[i];
    }
    s += ']';
    return s;
  }
}

export class gifImage {
  _width: number;
  _height: number;
  _data: any[];
  flush: any;

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
    this._data = new Array(width * height);
  }

  write(out: any) {
    //---------------------------------
    // GIF Signature

    out.writeString('GIF87a');

    //---------------------------------
    // Screen Descriptor

    out.writeShort(this._width);
    out.writeShort(this._height);

    out.writeByte(0x80); // 2bit
    out.writeByte(0);
    out.writeByte(0);

    //---------------------------------
    // Global Color Map

    // black
    out.writeByte(0x00);
    out.writeByte(0x00);
    out.writeByte(0x00);

    // white
    out.writeByte(0xff);
    out.writeByte(0xff);
    out.writeByte(0xff);

    //---------------------------------
    // Image Descriptor

    out.writeString(',');
    out.writeShort(0);
    out.writeShort(0);
    out.writeShort(this._width);
    out.writeShort(this._height);
    out.writeByte(0);

    //---------------------------------
    // Local Color Map

    //---------------------------------
    // Raster Data

    let lzwMinCodeSize = 2;
    let raster = this.getLZWRaster(lzwMinCodeSize);

    out.writeByte(lzwMinCodeSize);

    let offset = 0;

    while (raster.length - offset > 255) {
      out.writeByte(255);
      out.writeBytes(raster, offset, 255);
      offset += 255;
    }

    out.writeByte(raster.length - offset);
    out.writeBytes(raster, offset, raster.length - offset);
    out.writeByte(0x00);

    //---------------------------------
    // GIF Terminator
    out.writeString(';');
  }

  setPixel = function(x: number, y: number, pixel: any) {
    this._data[y * this._width + x] = pixel;
  };

  getLZWRaster(lzwMinCodeSize: number) {
    let clearCode = 1 << lzwMinCodeSize;
    let endCode = (1 << lzwMinCodeSize) + 1;
    let bitLength = lzwMinCodeSize + 1;

    // Setup LZWTable
    let table = new lzwTable();

    for (let i = 0; i < clearCode; i += 1) {
      table.add(String.fromCharCode(i));
    }
    table.add(String.fromCharCode(clearCode));
    table.add(String.fromCharCode(endCode));

    let byteOut = new byteArrayOutputStream();
    let bitOut = new bitOutputStream(byteOut);

    // clear code
    bitOut.write(clearCode, bitLength);

    let dataIndex = 0;
    let s = String.fromCharCode(this._data[dataIndex]);
    dataIndex += 1;

    while (dataIndex < this._data.length) {
      let c = String.fromCharCode(this._data[dataIndex]);
      dataIndex += 1;

      if (table.contains(s + c)) {
        s = s + c;
      } else {
        bitOut.write(table.indexOf(s), bitLength);

        if (table.size() < 0xfff) {
          if (table.size() == 1 << bitLength) {
            bitLength += 1;
          }

          table.add(s + c);
        }

        s = c;
      }
    }

    bitOut.write(table.indexOf(s), bitLength);

    // end code
    bitOut.write(endCode, bitLength);

    bitOut.flush();

    return byteOut.toByteArray();
  }
}

export class base64EncodeOutputStream {
  _buffer: any = 0;
  _buflen: number = 0;
  _length: number = 0;
  _base64: string = '';

  constructor() {}

  writeEncoded = function(b: any) {
    this._base64 += String.fromCharCode(this.encode(b & 0x3f));
  };

  encode(n: number): number {
    if (n < 0) {
      // error.
    } else if (n < 26) {
      return 0x41 + n;
    } else if (n < 52) {
      return 0x61 + (n - 26);
    } else if (n < 62) {
      return 0x30 + (n - 52);
    } else if (n == 62) {
      return 0x2b;
    } else if (n == 63) {
      return 0x2f;
    }
    throw new Error('n:' + n);
  }

  writeByte(n: number) {
    this._buffer = (this._buffer << 8) | (n & 0xff);
    this._buflen += 8;
    this._length += 1;

    while (this._buflen >= 6) {
      this.writeEncoded(this._buffer >>> (this._buflen - 6));
      this._buflen -= 6;
    }
  }

  flush() {
    if (this._buflen > 0) {
      this.writeEncoded(this._buffer << (6 - this._buflen));
      this._buffer = 0;
      this._buflen = 0;
    }

    if (this._length % 3 != 0) {
      // padding
      let padlen = 3 - this._length % 3;
      for (let i = 0; i < padlen; i += 1) {
        this._base64 += '=';
      }
    }
  }

  toString = function() {
    return this._base64;
  };
}

export class base64DecodeInputStream {
  _str: string;
  _pos: number = 0;
  _buffer: any = 0;
  _buflen: any = 0;

  constructor(str: string) {
    this._str = str;
  }

  read(): any {
    while (this._buflen < 8) {
      if (this._pos >= this._str.length) {
        if (this._buflen == 0) {
          return -1;
        }
        throw new Error('unexpected end of file./' + this._buflen);
      }

      let c = this._str.charAt(this._pos);
      this._pos += 1;

      if (c == '=') {
        this._buflen = 0;
        return -1;
      } else if (c.match(/^\s$/)) {
        // ignore if whitespace.
        continue;
      }

      this._buffer = (this._buffer << 6) | this.decode(c.charCodeAt(0));
      this._buflen += 6;
    }

    let n = (this._buffer >>> (this._buflen - 8)) & 0xff;
    this._buflen -= 8;
    return n;
  }

  decode(c: any): any {
    if (0x41 <= c && c <= 0x5a) {
      return c - 0x41;
    } else if (0x61 <= c && c <= 0x7a) {
      return c - 0x61 + 26;
    } else if (0x30 <= c && c <= 0x39) {
      return c - 0x30 + 52;
    } else if (c == 0x2b) {
      return 62;
    } else if (c == 0x2f) {
      return 63;
    } else {
      throw new Error('c:' + c);
    }
  }
}

export class CreateImgTag {
  gif: gifImage;
  img: string = '';

  constructor(width: number, height: number, getPixel: any, alt: any) {
    this.gif = new gifImage(width, height);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        this.gif.setPixel(x, y, getPixel(x, y));
      }
    }

    let b = new byteArrayOutputStream();
    this.gif.write(b);

    let base64 = new base64EncodeOutputStream();
    let bytes = b.toByteArray();
    for (let i = 0; i < bytes.length; i += 1) {
      base64.writeByte(bytes[i]);
    }
    base64.flush();
    this.img += '<img';
    this.img += '\u0020src="';
    this.img += 'data:image/gif;base64,';
    this.img += base64;
    this.img += '"';
    this.img += '\u0020width="';
    this.img += width;
    this.img += '"';
    this.img += '\u0020height="';
    this.img += height;
    this.img += '"';
    if (alt) {
      this.img += '\u0020alt="';
      this.img += alt;
      this.img += '"';
    }
    this.img += '/>';
  }
}

export class QrCode {
  PAD0: number = 0xec;
  PAD1: number = 0x11;
  _typeNumber: number;
  _errorCorrectionLevel: number;
  _moduleCount: number = 0;
  _dataCache: any;
  _dataList: any[] = [];
  qrUtil: QRUtil = new QRUtil();
  _modules: any[][];
  constructor(typeNumber: number, errorCorrectionLevel: string) {
    this._typeNumber = typeNumber;
    this._errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
  }

  setModules(moduleCount: number) {
    this._modules = new Array(moduleCount);
    for (let row = 0; row < moduleCount; row += 1) {
      this._modules[row] = new Array(moduleCount);
      for (let col = 0; col < moduleCount; col += 1) {
        this._modules[row][col] = null;
      }
    }
  }

  makeImpl(test: any, maskPattern: any) {
    this._moduleCount = this._typeNumber * 4 + 17;
    this.setModules(this._moduleCount);
    this.setupPositionProbePattern(0, 0);
    this.setupPositionProbePattern(this._moduleCount - 7, 0);
    this.setupPositionProbePattern(0, this._moduleCount - 7);
    this.setupPositionAdjustPattern();
    this.setupTimingPattern();
    this.setupTypeInfo(test, maskPattern);

    if (this._typeNumber >= 7) {
      this.setupTypeNumber(test);
    }

    if (this._dataCache == null) {
      this._dataCache = this.createData(
        this._typeNumber,
        this._errorCorrectionLevel,
        this._dataList
      );
    }

    this.mapData(this._dataCache, maskPattern);
  }

  setupPositionProbePattern = function(row: number, col: number) {
    for (let r = -1; r <= 7; r += 1) {
      if (row + r <= -1 || this._moduleCount <= row + r) {
        continue;
      }

      for (let c = -1; c <= 7; c += 1) {
        if (col + c <= -1 || this._moduleCount <= col + c) {
          continue;
        }

        if (
          (0 <= r && r <= 6 && (c == 0 || c == 6)) ||
          (0 <= c && c <= 6 && (r == 0 || r == 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4)
        ) {
          this._modules[row + r][col + c] = true;
        } else {
          this._modules[row + r][col + c] = false;
        }
      }
    }
  };

  getBestMaskPattern(): number {
    let minLostPoint: number = 0;
    let pattern: number = 0;
    for (let i = 0; i < 8; i += 1) {
      this.makeImpl(true, i);
      let lostPoint = this.qrUtil.getLostPoint(this);
      if (i == 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint;
        pattern = i;
      }
    }
    return pattern;
  }

  setupTimingPattern() {
    for (let r = 8; r < this._moduleCount - 8; r += 1) {
      if (this._modules[r][6] != null) {
        continue;
      }
      this._modules[r][6] = r % 2 == 0;
    }

    for (let c = 8; c < this._moduleCount - 8; c += 1) {
      if (this._modules[6][c] != null) {
        continue;
      }
      this._modules[6][c] = c % 2 == 0;
    }
  }

  setupPositionAdjustPattern() {
    let pos = this.qrUtil.getPatternPosition(this._typeNumber);
    for (let i = 0; i < pos.length; i += 1) {
      for (let j = 0; j < pos.length; j += 1) {
        let row = pos[i];
        let col = pos[j];

        if (this._modules[row][col] != null) {
          continue;
        }

        for (let r = -2; r <= 2; r += 1) {
          for (let c = -2; c <= 2; c += 1) {
            if (r == -2 || r == 2 || c == -2 || c == 2 || (r == 0 && c == 0)) {
              this._modules[row + r][col + c] = true;
            } else {
              this._modules[row + r][col + c] = false;
            }
          }
        }
      }
    }
  }

  setupTypeNumber(test: any) {
    let bits = this.qrUtil.getBCHTypeNumber(this._typeNumber);
    for (let i = 0; i < 18; i += 1) {
      let mod = !test && ((bits >> i) & 1) == 1;
      this._modules[Math.floor(i / 3)][i % 3 + this._moduleCount - 8 - 3] = mod;
    }

    for (let i = 0; i < 18; i += 1) {
      let mod = !test && ((bits >> i) & 1) == 1;
      this._modules[i % 3 + this._moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
    }
  }

  setupTypeInfo(test: any, maskPattern: any) {
    let data = (this._errorCorrectionLevel << 3) | maskPattern;
    let bits = this.qrUtil.getBCHTypeInfo(data);

    // vertical
    for (let i = 0; i < 15; i += 1) {
      let mod = !test && ((bits >> i) & 1) == 1;
      if (i < 6) {
        this._modules[i][8] = mod;
      } else if (i < 8) {
        this._modules[i + 1][8] = mod;
      } else {
        this._modules[this._moduleCount - 15 + i][8] = mod;
      }
    }

    // horizontal
    for (let i = 0; i < 15; i += 1) {
      let mod = !test && ((bits >> i) & 1) == 1;

      if (i < 8) {
        this._modules[8][this._moduleCount - i - 1] = mod;
      } else if (i < 9) {
        this._modules[8][15 - i - 1 + 1] = mod;
      } else {
        this._modules[8][15 - i - 1] = mod;
      }
    }

    // fixed module
    this._modules[this._moduleCount - 8][8] = !test;
  }

  mapData(data: any, maskPattern: any) {
    let inc = -1;
    let row = this._moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;
    let maskFunc = this.qrUtil.getMaskFunction(maskPattern);

    for (let col = this._moduleCount - 1; col > 0; col -= 2) {
      if (col == 6) {
        col -= 1;
      }
      while (true) {
        for (let c = 0; c < 2; c += 1) {
          if (this._modules[row][col - c] == null) {
            let dark = false;
            if (byteIndex < data.length) {
              dark = ((data[byteIndex] >>> bitIndex) & 1) == 1;
            }

            let mask = maskFunc(row, col - c);
            if (mask) {
              dark = !dark;
            }

            this._modules[row][col - c] = dark;
            bitIndex -= 1;

            if (bitIndex == -1) {
              byteIndex += 1;
              bitIndex = 7;
            }
          }
        }

        row += inc;
        if (row < 0 || this._moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  }

  createBytes(buffer: any, rsBlocks: any): any {
    let offset = 0;
    let maxDcCount = 0;
    let maxEcCount = 0;
    let dcdata = new Array(rsBlocks.length);
    let ecdata = new Array(rsBlocks.length);
    for (let r = 0; r < rsBlocks.length; r += 1) {
      let dcCount = rsBlocks[r].dataCount;
      let ecCount = rsBlocks[r].totalCount - dcCount;

      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);

      dcdata[r] = new Array(dcCount);

      for (let i = 0; i < dcdata[r].length; i += 1) {
        dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
      }
      offset += dcCount;

      let rsPoly = this.qrUtil.getErrorCorrectPolynomial(ecCount);
      let rawPoly = new QrPolynomial(dcdata[r], rsPoly.getLength() - 1);
      rawPoly.mod(rsPoly);
      ecdata[r] = new Array(rsPoly.getLength() - 1);
      for (let i = 0; i < ecdata[r].length; i += 1) {
        let modIndex = i + rawPoly.getLength() - ecdata[r].length;
        ecdata[r][i] = modIndex >= 0 ? rawPoly.getAt(modIndex) : 0;
      }
    }

    let totalCodeCount = 0;
    for (let i = 0; i < rsBlocks.length; i += 1) {
      totalCodeCount += rsBlocks[i].totalCount;
    }

    let data = new Array(totalCodeCount);
    let index = 0;

    for (let i = 0; i < maxDcCount; i += 1) {
      for (let r = 0; r < rsBlocks.length; r += 1) {
        if (i < dcdata[r].length) {
          data[index] = dcdata[r][i];
          index += 1;
        }
      }
    }

    for (let i = 0; i < maxEcCount; i += 1) {
      for (let r = 0; r < rsBlocks.length; r += 1) {
        if (i < ecdata[r].length) {
          data[index] = ecdata[r][i];
          index += 1;
        }
      }
    }

    return data;
  }

  createData(
    typeNumber: number,
    errorCorrectionLevel: number,
    dataList: any
  ): any {
    let rsBlocks = new QRRSBlock(typeNumber, errorCorrectionLevel).getRSBlocks(
      typeNumber,
      errorCorrectionLevel
    );
    let buffer: qrBitBuffer = new qrBitBuffer();
    for (let i = 0; i < dataList.length; i += 1) {
      let data = dataList[i];
      buffer.put(data.getMode(), 4);
      buffer.put(
        data.getLength(),
        this.qrUtil.getLengthInBits(data.getMode(), typeNumber)
      );
      data.write(buffer);
    }

    // calc num max data.
    let totalDataCount = 0;
    for (let i = 0; i < rsBlocks.length; i += 1) {
      totalDataCount += rsBlocks[i].dataCount;
    }

    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw new Error(
        'code length overflow. (' +
          buffer.getLengthInBits() +
          '>' +
          totalDataCount * 8 +
          ')'
      );
    }

    // end code
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }

    // padding
    while (buffer.getLengthInBits() % 8 != 0) {
      buffer.putBit(false);
    }

    // padding
    while (true) {
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(this.PAD0, 8);

      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(this.PAD1, 8);
    }

    return this.createBytes(buffer, rsBlocks);
  }

  addData(data: any) {
    let newData: qr8BitByte = new qr8BitByte(data);
    this._dataList.push(newData);
    this._dataCache = null;
  }

  isDark(row: number, col: number): any {
    if (
      row < 0 ||
      this._moduleCount <= row ||
      col < 0 ||
      this._moduleCount <= col
    ) {
      throw new Error(row + ',' + col);
    }
    return this._modules[row][col];
  }

  getModuleCount(): number {
    return this._moduleCount;
  }

  make() {
    this.makeImpl(false, this.getBestMaskPattern());
  }

  createTableTag(cellSize: number, margin: any): string {
    cellSize = cellSize || 2;
    margin = typeof margin == 'undefined' ? cellSize * 4 : margin;

    let qrHtml: string = '';

    qrHtml += '<table style="';
    qrHtml += ' border-width: 0px; border-style: none;';
    qrHtml += ' border-collapse: collapse;';
    qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
    qrHtml += '">';
    qrHtml += '<tbody>';

    for (let r = 0; r < this.getModuleCount(); r += 1) {
      qrHtml += '<tr>';
      for (let c = 0; c < this.getModuleCount(); c += 1) {
        qrHtml += '<td style="';
        qrHtml += ' border-width: 0px; border-style: none;';
        qrHtml += ' border-collapse: collapse;';
        qrHtml += ' padding: 0px; margin: 0px;';
        qrHtml += ' width: ' + cellSize + 'px;';
        qrHtml += ' height: ' + cellSize + 'px;';
        qrHtml += ' background-color: ';
        qrHtml += this.isDark(r, c) ? '#000000' : '#ffffff';
        qrHtml += ';';
        qrHtml += '"/>';
      }
      qrHtml += '</tr>';
    }
    qrHtml += '</tbody>';
    qrHtml += '</table>';

    return qrHtml;
  }

  createSvgTag(cellSize: number, margin: any): string {
    cellSize = cellSize || 2;
    margin = typeof margin == 'undefined' ? cellSize * 4 : margin;
    let size = this.getModuleCount() * cellSize + margin * 2;
    let c: any,
      mc: any,
      r: any,
      mr: any,
      qrSvg: string = '',
      rect: any;

    rect =
      'l' +
      cellSize +
      ',0 0,' +
      cellSize +
      ' -' +
      cellSize +
      ',0 0,-' +
      cellSize +
      'z ';

    qrSvg += '<svg';
    qrSvg += ' width="' + size + 'px"';
    qrSvg += ' height="' + size + 'px"';
    qrSvg += ' xmlns="http://www.w3.org/2000/svg"';
    qrSvg += '>';
    qrSvg += '<path d="';

    for (r = 0; r < this.getModuleCount(); r += 1) {
      mr = r * cellSize + margin;
      for (c = 0; c < this.getModuleCount(); c += 1) {
        if (this.isDark(r, c)) {
          mc = c * cellSize + margin;
          qrSvg += 'M' + mc + ',' + mr + rect;
        }
      }
    }

    qrSvg += '" stroke="transparent" fill="black"/>';
    qrSvg += '</svg>';

    return qrSvg;
  }

  createImgTag(cellSize: number, margin: any): any {
    cellSize = cellSize || 2;
    margin = typeof margin == 'undefined' ? cellSize * 4 : margin;

    let size = this.getModuleCount() * cellSize + margin * 2;
    let min = margin;
    let max = size - margin;

    let _this = this;
    let imgTag: CreateImgTag = new CreateImgTag(
      size,
      size,
      function(x: any, y: any) {
        if (min <= x && x < max && min <= y && y < max) {
          let c = Math.floor((x - min) / cellSize);
          let r = Math.floor((y - min) / cellSize);
          return _this.isDark(r, c) ? 0 : 1;
        } else {
          return 1;
        }
      },
      null
    );
    return imgTag.img;
  }
}
