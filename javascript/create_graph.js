var xmlHttp = new XMLHttpRequest();

function setExchangeNames(name) {
  this.name = name;
  this.y = [];
}

function requestData(symbol) {
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      var data = JSON.parse(xmlHttp.responseText);
      createGraph(data);
    }
  };
  xmlHttp.open( "GET", 'http://localhost:5002/server?params='+ symbol, true ); // false for synchronous request
  xmlHttp.send();
}

function fetchSymbol() {
  xmlHttp.open( "GET", 'http://localhost:5002/server', false ); // false for synchronous request
  xmlHttp.send();
  var symbol = JSON.parse(xmlHttp.response);
  return symbol
}

function selectSymbol() {
  setTimeout(selectSymbol, 5000);
  var elem = document.getElementById('exchange_symbols');
  if(elem.value != 'None') {
    var selected_symbol = elem.value;
    var symbol = fetchSymbol();
    for(i = 0; i < symbol.length; i++) {
      if(symbol[i] == selected_symbol) {
          requestData(selected_symbol)
      }
    }
  }
}

function createXAxis(data, exchange_names) {
  x_coordinates = [];
  x_coordinates.push('x')
  for(i = 0; i < exchange_names.length; i++) {
    var array = data['bids'][exchange_names[i]]
    console.log(array)
    for(j = 0; j < array.length; j++) {
      console.log(array[j][0])
      x_coordinates.push(array[j][0])
    }
  }
  return(x_coordinates)
}

function createYAxis(type, data, exchange_names) {
  y_coordinates = [];
  for(i = 0; i < exchange_names.length; i++) {
    temp = [];
    var array = data[type][exchange_names[i]]
    temp.push(exchange_names[i])
    for(j = 0; j < array.length; j++) {
      temp.push(array[j][1])
    }
    y_coordinates.push(temp)
  }
  return(y_coordinates)
}

function createGraph(data) {
  var exchange_names = Object.keys(data['bids']);
  var index = exchange_names.indexOf('total');
  if (index > -1) {
    exchange_names.splice(index, 1);
  }
  var x = createXAxis(data, exchange_names);
  console.log(x);
  var y_asks = createYAxis('asks', data, exchange_names);
  y_asks = Object.values(y_asks)
  var y_bids = createYAxis('bids', data, exchange_names);
  console.log(y_bids)

  chart = c3.generate({
    bindto: '#asksGraph',
    data: {
      columns: y_asks,
      types: {
        binance: 'area',
        kraken: 'area',
        kucoin: 'area',
        bittrex: 'area'
      }
    },
    axis: {
     x: {
         tick: {
             count: 4,
         }
     }
    },
    point: {
      show: false
    }
  });

  chart = c3.generate({
    bindto: '#bidsGraph',
    data: {
      columns: y_bids,
      types: {
        binance: 'area',
        kraken: 'area',
        kucoin: 'area',
        bittrex: 'area'
      }
    },
    axis: {
     x: {
         tick: {
             count: 4,
         }
     }
    },
    point: {
      show: false
    }
  });
}
