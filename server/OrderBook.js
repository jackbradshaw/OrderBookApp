var Trade = require("./Trade");

var SELL_ORDER_DIRECTION = -1;
var BUY_ORDER_DIRECTION = 1;
var LIMIT_ORDER_TYPE = 1;

var OrderBook = function OrderBook(orderPlaced, tradeMade) {
	this.buyOrders = [];
	this.sellOrders = [];
	this.trades = [];
	this.orderPlaced = orderPlaced;
	this.tradeMade = tradeMade;
};

OrderBook.prototype.placeOrder = function(order) {
	var orders;
	var passiveOrders;
	if(order.type !== LIMIT_ORDER_TYPE) return;
	if(order.direction === SELL_ORDER_DIRECTION) {
		orders = this.sellOrders;
		passiveOrders = this.buyOrders;
	} else if(order.direction === BUY_ORDER_DIRECTION) {
		orders = this.buyOrders;
		passiveOrders = this.sellOrders;
	} else {
		throw new Error("Unrecognised direction: " + direction);
	}

	if(passiveOrders) {
		while(order.size > 0 && passiveOrders.length > 0 && this.matches(order, passiveOrders[0])) {
			this.trade(order, passiveOrders[0]);
			if(passiveOrders[0].size === 0) {
				passiveOrders.shift();
			}
		}
	}
	if(order.size !== 0) {
		orders.push(order);
		orders.sort(this.sort);
		this.orderPlaced && this.orderPlaced(order);
	}
};

OrderBook.prototype.sort  = function(order1, order2) {
	var result;
	if(order1.direction === BUY_ORDER_DIRECTION) {
		result = order2.price - order1.price;
	} else {
		result = order1.price - order2.price
	}
	return result || order1.time - order2.time;
}

OrderBook.prototype.matches = function(order1, order2) {
	if(order1.direction === BUY_ORDER_DIRECTION) {
		buyOrder = order1;
		sellOrder = order2;
	} else {
		buyOrder = order2;
		sellOrder = order1;
	}
	return buyOrder.price > sellOrder.price;
}

OrderBook.prototype.trade = function(order, passiveOrder) {
	size = Math.min(order.size, passiveOrder.size);
	order.size -= size;
	passiveOrder.size -= size;
	var trade = new Trade(passiveOrder.price, size);
	this.trades.push(trade);
	this.tradeMade && this.tradeMade(trade);
}

module.exports = OrderBook;
