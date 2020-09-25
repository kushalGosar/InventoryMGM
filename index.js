const calculate = require("./calc");

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
  main(d.toString().trim());
});

function main(data) {
  let input = data.split(":");

  if (input.length === 6) {
    let glovesObj = {
      country: input[0],
      passport: ValidatePassport(input[1]),
      quant: input[2] === "Gloves" ? input[3] : input[5]
    };
    let maskObj = {
      country: input[0],
      passport: ValidatePassport(input[1]),
      quant: input[2] === "Gloves" ? input[5] : input[3]
    };

    let resultGloves = calculate("gloves", glovesObj);
    let resultMasks = calculate("mask", maskObj);
 
    if (resultGloves.cost && resultMasks.cost) {
      console.log(
        resultGloves.cost +
          resultMasks.cost +
          resultMasks.quant +
          resultGloves.quant
      );
    } else {
      console.log("OUT_OF_STOCK:100:100:100:50");
    }
  } else {
    let glovesObj = {
      country: input[0],
      passport: null,
      quant: input[1] === "Gloves" ? input[2] : input[4]
    };
    let maskObj = {
      country: input[0],
      passport: null,
      quant: input[1] === "Gloves" ? input[4] : input[2]
    };
    let resultGloves = calculate("gloves", glovesObj);
    let resultMasks = calculate("mask", maskObj);
    if (resultGloves.cost && resultMasks.cost) {
      console.log(
        resultGloves.cost +
          resultMasks.cost +
          resultMasks.quant +
          resultGloves.quant
      );
    } else {
      console.log("OUT_OF_STOCK:100:100:100:50");
    }
  }
}

function ValidatePassport(name) {
  if (/[B]{1}[0-9]{3}[a-zA-Z]{2}[a-zA-Z0-9]{7}/gm.test(name) === true) {
    return "UK";
  } else if (/[A]{1}[a-zA-Z]{2}[a-zA-Z0-9]{9}/gm.test(name) === true) {
    return "Germany";
  } else {
    return null;
  }
}
