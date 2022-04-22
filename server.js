/* 
    SETTING UP 
*/
// Require http module
const http = require('http');

// Require minimist module
// Use minimist to process one argument `--port=` on the command line after `node server.js`.
const args = require('minimist')(process.argv.slice(2));

// Require Express.js
const express = require('express');
const app = express();

// Define allowed argument name 'port'.
args['port'];

// Define a const `port` using the argument from the command line.
const port = args.port || process.env.PORT || 3000;


/* 
    COIN FUNCTIONS 
*/
// Coin flip
function coinFlip() {
    return (Math.floor(Math.random() * 2) == 0) ? "heads" : "tails";
}

// Coin flips
function coinFlips(flips) {
    let results = [];
    for (let i = 0; i < flips; i++) {
      results.push(coinFlip());
    }
    return results;
}

// Count flips
function countFlips(array) {
    const result = {
      tails: 0,
      heads: 0
    };
    if (array.length == 1) {
      if (array[0] ==  "heads") {
         return { heads: 1 };
      }
      else {
        return { tails: 1 };
      }
    }
    else {
      for (let i = 0; i < array.length; i++) {
        if (array[i] ==  "heads") {
          result.heads++;
        }
        else {
          result.tails++;
        }
      }
    }
    return result;
}

// Flip a coin
function flipACoin(call) {
  let flip = coinFlip();
  const result = {
    call: call,
    flip: flip,
    result: ((flip == call) ? "win" : "lose")
  };
  return result;
}


/* 
    ENDPOINTS 
*/
// Define check endpoint
app.get('/app/', (req, res) => {
    // Respond with status 200
        res.statusCode = 200;
    // Respond with status message "OK"
        res.statusMessage = 'OK';
        res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
        res.end(res.statusCode+ ' ' +res.statusMessage)
});

// Define flip endpoint
app.get('/app/flip/', (req, res) => {
	res.status(200).json({'flip': coinFlip()});
});

// Define number endpoint
app.get('/app/flips/:number', (req, res) => {
    const flips = coinFlips(req.params.number);
	res.status(200).json( {'raw' : flips, 'summary' : countFlips(flips)});
});

// Define heads endpoint
app.get('/app/flip/call/heads', (req, res) => {
	const flip = flipACoin('heads');
    res.status(200).json({ 'call' : flip.call, 'flip': flip.flip, 'result': flip.result});
});

// Define tails endpoint
app.get('/app/flip/call/tails', (req, res) => {
	const flip = flipACoin('tails');
    res.status(200).json({ 'call' : flip.call, 'flip': flip.flip, 'result': flip.result});
});


/* 
    SERVER 
*/
// Start an app server
app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%', port))
});

// Default response for any other request
app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')
});