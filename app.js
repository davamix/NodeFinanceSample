var http = require('http');
var express = require('express');
var app = express();


function getFinance(stock){
	var getData = '';
	return new Promise((resolve, reject) => {
		http.get({
		host: 'www.google.com',
		path: '/finance/option_chain?q=' + stock + '&output=json'
	}, (response) => {
		response.on('data',(d) => {
			getData += d.toString();
		});
		
		if(response.statusCode >= 400){
			reject(Error('Stock not found: ' + stock));
		}else{
			response.on('end', next);
		}
	}).on('error', (e)=>{
		console.log(e.message);
		reject(Error('OOPS!'));
		});
		
		function next(){
			var jsonValues = JSON.stringify(getData); // the values are not JSON valid, so its needed to be stringify first
			var content = JSON.parse(jsonValues);
			var result = '';
			for (var t in content){
				result += content[t]
			} 

			resolve(result);
		}
	});
}

app.get('/stock/*', (req, res) =>{
	console.log(req.params);
	if(req.params === undefined || req.params.length == 0){
		console.log('Nothing to show');
		res.end('Nothing to show');
	}

	getFinance(req.params[0]).then((response) =>{
		res.writeHead(200,{
			'Content-Type': 'text/html'
		});

		res.end(response);
	}, (error)=>{
		console.log(error.message);
		res.end(error.message);
	});
});

// localhost:3000/stock/{stockName}
app.listen(3000, ()=>{
	console.log('Listening on port 3000');
});

