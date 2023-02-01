const validateSnils = (snils: string): boolean | string => {
  //   const error = {};
  var result = false;
  if (typeof snils === "number") {
    snils = snils.toString();
  } else if (typeof snils !== "string") {
    snils = "";
  }
  if (!snils.length) {
    // error.code = 1;
    // error.message =
    return "СНИЛС пуст";
  } else if (/[^0-9]/.test(snils)) {
    // error.code = 2;
    // error.message = "СНИЛС может состоять только из цифр";
    return "СНИЛС может состоять только из цифр";
  } else if (snils.length !== 11) {
    // error.code = 3;
    // error.message = "СНИЛС может состоять только из 11 цифр";
    return "СНИЛС может состоять только из 11 цифр";
  } else {
    var sum = 0;
    for (var i = 0; i < 9; i++) {
      sum += parseInt(snils[i]) * (9 - i);
    }
    var checkDigit = 0;
    if (sum < 100) {
      checkDigit = sum;
    } else if (sum > 101) {
      checkDigit = parseInt(sum % 101);
      if (checkDigit === 100) {
        checkDigit = 0;
      }
    }
    if (checkDigit === parseInt(snils.slice(-2))) {
      result = true;
    } else {
      //   error.code = 4;
      //   error.message = "Неправильное контрольное число";
      return "Неправильное контрольное число";
    }
  }
  return result;
};

const validateInn = (inn: string): boolean | string => {
  var result = false;
  if (typeof inn === "number") {
    inn = inn.toString();
  } else if (typeof inn !== "string") {
    inn = "";
  }
  if (!inn.length) {
    // error.code = 1;
    // error.message = "ИНН пуст";
    return "ИНН пуст";
  } else if (/[^0-9]/.test(inn)) {
    // error.code = 2;
    // error.message = "ИНН может состоять только из цифр";
    return "ИНН может состоять только из цифр";
  } else if ([10, 12].indexOf(inn.length) === -1) {
    // error.code = 3;
    // error.message = "ИНН может состоять только из 10 или 12 цифр";
    return "ИНН может состоять только из 10 или 12 цифр";
  } else {
    var checkDigit = function (inn, coefficients) {
      var n = 0;
      for (var i in coefficients) {
        n += coefficients[i] * inn[i];
      }
      return parseInt((n % 11) % 10);
    };
    switch (inn.length) {
      case 10:
        var n10 = checkDigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
        if (n10 === parseInt(inn[9])) {
          result = true;
        }
        break;
      case 12:
        var n11 = checkDigit(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
        var n12 = checkDigit(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
        if (n11 === parseInt(inn[10]) && n12 === parseInt(inn[11])) {
          result = true;
        }
        break;
    }
    if (!result) {
      //   error.code = 4;
      //   error.message = "Неправильное контрольное число";
      return "Неправильное контрольное число";
    }
  }
  return result;
};

export { validateSnils, validateInn };
