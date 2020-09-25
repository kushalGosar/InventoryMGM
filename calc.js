const calculate = (product, input) => {
  let dbData = {
    gloves: [
      {
        country: "UK",
        stock: 100,
        price: 100,
        transportCost: 400,
        quantity: 10,
        discount: 20
      },
      {
        country: "Germany",
        stock: 50,
        price: 150,
        transportCost: 400,
        quantity: 10,
        discount: 20
      }
    ],

    mask: [
      {
        country: "UK",
        stock: 100,
        price: 65,
        transportCost: 400,
        quantity: 10,
        discount: 20
      },
      {
        country: "Germany",
        stock: 100,
        price: 100,
        transportCost: 400,
        quantity: 10,
        discount: 20
      }
    ]
  };
  let data = dbData[product];
  let productCount = data.reduce((a, b) => {
    return a + b.stock;
  }, 0);
  if (productCount > input.quant) {
    data.forEach(element => {
      if (element.country === input.country) {
        element.minPrice = element.price;
      } else {
        if (element.country === input.passport) {
          element.minPrice =
            (element.price * element.quantity +
              (element.transportCost * (100-element.discount)) / 100) /
            element.quantity;
        } else {
          element.minPrice =
            (element.price * element.quantity + element.transportCost) /
            element.quantity;
        }
      }
    });

    data.sort((a, b) => {
      return a.minPrice - b.minPrice;
    });
    let capacity = input.quant;
    let cost = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i].country === input.country) {
        if (data[i].stock > capacity) {
          cost = cost + capacity * data[i].minPrice;
          data[i].stock = data[i].stock - capacity;
          capacity = 0;
        } else {
          cost = cost + data[i].stock * data[i].minPrice;
          capacity = capacity - data[i].stock;
          data[i].stock = 0;
        }
      } else {
        let fullTrans = Math.floor(capacity / data[i].quantity);
        if (fullTrans && data[i].stock > fullTrans * data[i].quantity) {
          cost = cost + fullTrans * data[i].quantity * data[i].minPrice;
          capacity = capacity - fullTrans * data[i].quantity;
          data[i].stock = data[i].stock - fullTrans * data[i].quantity;
        } else if (fullTrans && data[i].stock < fullTrans * data[i].quantity) {
          let value = Math.floor(data[i].stock/data[i].quantity)*data[i].quantity
          cost = cost + value * data[i].minPrice;
          capacity = capacity - value;
          data[i].stock = data[i].stock - value;
        }
      }
    }
    let min = [];

    if (capacity) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].country === input.country && data[i].stock > 0) {
          let obj = {
            minCost: capacity * data[i].price,
            country: data[i].country
          };
          min.push(obj);
        } else {
          if (data[i].country === input.passport) {
            if (data[i].stock > 0) {
              let obj = {
                minCost:
                  capacity * data[i].price +
                  (data[i].transportCost * (100-data[i].discount)) / 100,
                country: data[i].country
              };
              min.push(obj);
            }
          } else {
            if (data[i].stock > 0) {
              let obj = {
                minCost: capacity * data[i].price + data[i].transportCost,
                country: data[i].country
              };
              min.push(obj);
            }
          }
        }
      }
      min = min.sort((a, b) => {
        return a.minCost - b.minCost;
      });
    }

    let resultCost = min.length > 0 ? cost + min[0].minCost : cost;

    if (min.length > 0) {
      data.filter(e => {
        if (e.country === min[0].country) {
          e.stock = e.stock - capacity;
        }
      });
    }

    let result = "";
    data.filter(e => {
      result = result + ":" + e.stock;
    });
    return { cost: resultCost, quant: result };
  } else {
    let result = "";
    data.filter(e => {
      result = result + ":" + e.stock;
    });
    return { cost: null, quant: result };
  }
};

module.exports = calculate;
