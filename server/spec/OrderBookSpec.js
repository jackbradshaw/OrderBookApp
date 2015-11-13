var OrderBook = require("../OrderBook");
var Order = require("../Order");

describe("OrderBook", function() {

	var orderBook;
	
	beforeEach(function() {
		orderBook = new OrderBook();
	});

	it("should add a buy order", function() {
		orderBook.placeOrder(new Order("1234", 1, "1234", 10, 100, 1));
		expect(orderBook.buyOrders.length).toBe(1);
		expect(orderBook.sellOrders.length).toBe(0);
	});

	it("should add a sell order", function() {
		orderBook.placeOrder(new Order("1234", 1, "1234", 10, 100, -1));
		expect(orderBook.buyOrders.length).toBe(0);
		expect(orderBook.sellOrders.length).toBe(1);
	});

	it("should match a buy order with sell orders", function() {
		var buyOrder = new Order("1234", 1, "1234", 10, 100, 1);
		var sellOrder1 = new Order("1234", 1, "1234", 8, 80, -1);
		var sellOrder2 = new Order("1234", 1, "1234", 1, 80, -1);

		orderBook.placeOrder(sellOrder1);
		orderBook.placeOrder(sellOrder2);
		orderBook.placeOrder(buyOrder);

		expect(orderBook.trades.length).toBe(2);
		expect(orderBook.buyOrders.length).toBe(1);
		expect(orderBook.sellOrders.length).toBe(0);

		expect(orderBook.buyOrders[0].price).toBe(100);
		expect(orderBook.buyOrders[0].size).toBe(1);
	});

	it("should order buy orders in price-time priority", function() {
		var order1 = new Order("1", 1, "1234", 10, 100, 1);
		var order2 = new Order("2", 1, "1234", 10, 200, 1);
		var order3 = new Order("3", 1, "1234", 10, 200, 1);

		orderBook.placeOrder(order3);
		orderBook.placeOrder(order1);
		orderBook.placeOrder(order2);

		expect(orderBook.buyOrders[0]).toBe(order2);
		expect(orderBook.buyOrders[1]).toBe(order3);
		expect(orderBook.buyOrders[2]).toBe(order1);
	});

	it("should order sell orders in price-time priority", function() {
		var order1 = new Order("1", 1, "1234", 10, 100, -1);
		var order2 = new Order("2", 1, "1234", 10, 200, -1);
		var order3 = new Order("3", 1, "1234", 10, 200, -1);

		orderBook.placeOrder(order3);
		orderBook.placeOrder(order1);
		orderBook.placeOrder(order2);

		expect(orderBook.sellOrders[0]).toBe(order1);
		expect(orderBook.sellOrders[1]).toBe(order2);
		expect(orderBook.sellOrders[2]).toBe(order3);
	})
});
