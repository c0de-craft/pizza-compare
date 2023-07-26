const fs = require('fs');
const path = require('path');

// Read the pizzas.json file
let rawData = fs.readFileSync(path.join(__dirname, 'pizzas.json'));
let pizzas = JSON.parse(rawData);

// Re-calculate pricePerCm2 for each pizza
pizzas.forEach(pizza => {
  let radius = pizza.diameter / 2;
  let area = Math.PI * radius * radius;
  pizza.pricePerCm2 = (pizza.price / area).toFixed(4); // now rounding to 4 decimal places
});

// Write the updated data back to pizzas.json
let updatedData = JSON.stringify(pizzas, null, 2);
fs.writeFileSync(path.join(__dirname, 'pizzas.json'), updatedData);