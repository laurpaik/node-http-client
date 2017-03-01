'use strict';

const http = require('http');

// if there's an argument use that, or default to get, set to uppercase
const method = (process.argv[2] || 'get').toUpperCase();

// turn the data into a JSON string with key value pairings
const data = JSON.stringify({
  key: 'value',
});

// defines the headers using data
const headers = {
  'Content-Type': 'application/json',
  'Content-Length': data.length,
};

const sendData = ['POST', 'PATCH'].some(e => e === method);

// defines different parts of the url
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/upload',
  method,
};

if (sendData) {
  options.headers = headers;
}

// ^ everything up there is definitional

// this promise starts the request object (const request)
// defines everything and then calls request
new Promise((resolve, reject) => {
  // this data only available inside request
  // when you make the request, it's configured with the options, then a response happens
  // node starts a request and automatically makes a response object and throws it in the callback function
  // you just have to define what the response object is
  // request object =/= request, response object =/= response
  // request object defines what request should be, doesn't happen until .end is called (line 69 ayy)
  // response object is where we tell node what code to run when we get a response back
  // we're calling http.request and defining response... options here is an argument (see global scope)
  const request = http.request(options, (response) => { // response is a parameter
    let data = '';
    response.setEncoding('utf8');
    response.on('error', reject);
    // when the response gets data, add the chunks to the request data
    // this is basically what you do when chunks of data come back
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      resolve(data);
    });
  });

  request.on('error', reject);

  // here data is the data from the global scope
  // it writes the body if sendData happens
  if (sendData) {
    request.write(data);
  }

  // this is when the request actually gets sent
  request.end(); // analogous to xhr.send in browser-xml-http-request
}).then(console.log).catch(console.error);
// in the .then, data is the request 'data', not the global data
