var fs = require("fs");
var Order = require("./Order");

var OrderPlacer = function OrderPlacer(orderBook, orderFile) {
	this.orderBook = orderBook;
	this.orders = fs.readFileSync(orderFile, {
		encoding: "utf-8"
	})
		.split("\n")
	//	.slice(0, 1000)
		.map(function(line) {
			var messageItems = line.split(",");

			return new Order(
				this.time = parseFloat(messageItems.shift()),
				this.type = parseInt(messageItems.shift()),
				this.id = messageItems.shift(),
				this.size = parseFloat(messageItems.shift()),
				this.price = parseFloat(messageItems.shift()),
				this.direction = parseInt(messageItems.shift()));
		});

		this.scheduleOrder();
};

OrderPlacer.prototype.scheduleOrder = function(time) {
	setTimeout(this.timeout.bind(this), time || 0, this);
}

OrderPlacer.prototype.timeout = function() {
	var order = this.orders.shift();
	if(order) {
		this.orderBook.placeOrder(order);
		var nextOrder = this.orders[this.orders.length - 1];
		nextOrder && this.scheduleOrder(nextOrder.time - order.time);
	}
}

module.exports = OrderPlacer;
