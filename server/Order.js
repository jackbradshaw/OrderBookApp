var Order = function Order(time, type, id, size, price, direction) {
	this.time = time;
	this.type = type;
	this.id = id;
	this.size = size;
	this.price = price;
	this.direction = direction;
}

module.exports = Order;
