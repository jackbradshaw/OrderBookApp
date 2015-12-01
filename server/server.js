var http = require("http");
var serveStatic = require("serve-static");
var connect = require("connect");
var connectRoute = require("connect-route");
var url = require("url");
var socketIo = require("socket.io");

var OrderBook = require("./OrderBook");
var OrderPlacer = require("./OrderPlacer");

var orderBook = new OrderBook(orderChanged, tradeMade);
var orderPlacer = new OrderPlacer(orderBook, "./server/messages.csv");

var app = connect();
app.use(serveStatic("app"));
app.use(serveStatic("node_modules/socket.io/node_modules/socket.io-client"));

app.use(connectRoute(function(router) {
	router.get("/order", getOrders);
	router.get("/trade", getTrades);
}));

var server = http.createServer(app);
var io = socketIo(server);
io.on("connection", function(socket){
  socket.on("event", function(data){});
  socket.on("disconnect", function(){});
});

server.listen(8000);

function parseQuery(request) {
	return url.parse(request.url, true).query;
}

function getOrders(request, response) {
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
}

function getTrades(request, response) {
	response.end(JSON.stringify(orderBook.trades));
}

function orderChanged(order) {
	io.emit("orderChanged", JSON.stringify(order));
}

function tradeMade(trade) {
	io.emit("trade", JSON.stringify(trade));
}
