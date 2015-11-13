var http = require("http");
var serveStatic = require('serve-static');
var connect = require("connect");
var connectRoute = require("connect-route");
var url = require("url");

var OrderBook = require("./OrderBook");
var OrderPlacer = require("./OrderPlacer");

var orderBook = new OrderBook();
var orderPlacer = new OrderPlacer(orderBook, "./server/messages.csv");

var app = connect();
app.use(serveStatic("app"));

app.use(connectRoute(function(router) {
	router.get("/order", function(request, response) {
		var query = parseQuery(request);
		var body;
		if(query.direction) {
			if(query.direction === "1") {
				body = JSON.stringify(orderBook.buyOrders);
			} else if(query.direction === "-1") {
				body = JSON.stringify(orderBook.sellOrders);
			}
		}
		if(!body) {
			body = JSON.stringify(orderBook.buyOrders.concat(orderBook.sellOrders));
		}
		response.end(body);
	});
}))
app.listen(8000);

function parseQuery(request) {
	return url.parse(request.url, true).query;
}
