const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();

let pizzas = [];

// Use EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname));

// Use body-parser and cookie-parser as middleware
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/', function (req, res) {
  if (fs.existsSync('pizzas.json')) {
    pizzas = JSON.parse(fs.readFileSync('pizzas.json', 'utf8'));
  }
  pizzas.sort((a, b) => parseFloat(a.pricePerCm2) - parseFloat(b.pricePerCm2));

  res.render('index', {
    pizzas: pizzas
  });
});

app.post('/addPizza', function (req, res) {
  let diameter = parseFloat(req.body.diameter);
  let price = parseFloat(req.body.price);
  let name = req.body.name;
  let company = req.body.company;
  let area = calculatePizzaArea(diameter)
  let pricePerCm2 = calculatePricePerCm2(price, area)

  let newPizza = {
    name: name,
    company: company,
    diameter: diameter,
    price: price,
    area: area,
    pricePerCm2: pricePerCm2.toFixed(4)
  };


  if (fs.existsSync('pizzas.json')) {
    pizzas = JSON.parse(fs.readFileSync('pizzas.json', 'utf8'));
  }

  pizzas.push(newPizza);

  fs.writeFileSync('pizzas.json', JSON.stringify(pizzas), 'utf8');

  res.redirect('/');
});


app.post('/updatePizza/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (pizzas[index]) {
    const newPizza = req.body;
    newPizza.area = calculatePizzaArea(newPizza.diameter);
    newPizza.pricePerCm2 = calculatePricePerCm2(newPizza.price, newPizza.area);
    pizzas[index] = newPizza;
    fs.writeFileSync('pizzas.json', JSON.stringify(pizzas));
    res.redirect('/');
  } else {
    res.status(404).send('Pizza not found');
  }
});

app.listen(3000, function () {
  console.log('Pizza app listening on port 3000!');
});

function calculatePizzaArea(diameter) {
  const radius = diameter / 2;
  const area = Math.PI * Math.pow(radius, 2);
  return area;
}

function calculatePricePerCm2(price, area) {
  const pricePerCm2 = price / area;
  return pricePerCm2;
}