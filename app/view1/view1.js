"use strict";

angular.module("myApp.view1", ["ngRoute"])

.config(["$routeProvider", function($routeProvider) {
  $routeProvider.when("/view1", {
    templateUrl: "view1/view1.html",
    controller: "View1Ctrl",
		controllerAs : "controller"
  });
}])

.controller("View1Ctrl", (function() {
	var Controller =  function Controller($scope, $http) {
		this.$scope = $scope;

		var baseUrl = "./";
		$http.get(baseUrl + "order?direction=1").then(this.getBuyOrders.bind(this));
		$http.get(baseUrl + "order?direction=-1").then(this.getSellOrders.bind(this));
		$http.get(baseUrl + "trade").then(this.getTrades.bind(this));

		this.socket = io("localhost:8000");
		this.socket.on("connect", this.connect.bind(this));
		this.socket.on("trade", this.trade.bind(this));
		this.socket.on("orderChanged", this.orderChanged.bind(this));
	};

	Controller.$inject = ["$scope", "$http"];

	Controller.prototype.getBuyOrders = function(result) {
		this.buyOrders = new SortedList(result.data, this.getOrderComparison(true));
	}

	Controller.prototype.getSellOrders = function(result) {
		this.sellOrders = new SortedList(result.data, this.getOrderComparison(false));
	}

	Controller.prototype.getTrades = function(result) {
		this.trades = result.data;
	}

	Controller.prototype.placeOrder = function() {
		console.log("place");
	}

	Controller.prototype.connect = function() {
		console.log("connect");
	}

	Controller.prototype.trade = function(trade) {
		this.$scope.$apply((function() {
			trade = JSON.parse(trade);
			this.trades && this.trades.unshift(trade);
		}).bind(this));
	}

	Controller.prototype.orderChanged = function(order) {
		this.$scope.$apply((function() {
			var orderList;
			order = JSON.parse(order);
			if(order.direction === 1) {
				orderList = this.buyOrders;
			} else if(order.direction === -1) {
				orderList = this.sellOrders;
			}
			if(orderList) {
				if(order.size === 0) {
					orderList.remove(order);
				} else {
					orderList.insert(order);
				}
			}
		}).bind(this));
	}

	Controller.prototype.getOrderComparison = function(buy) {
		return function(order1, order2) {
			var result;
			if(buy) {
				result = order1.price - order2.price;
			} else {
				result = order2.price - order1.price;
			}
			return -(result || order1.time - order2.time);
		};
	}


	return Controller;
})())

.directive("orderList", function() {
	return {
		restrict: "E",
		templateUrl: "view1/orderList.html",
		scope: {
			title: "@",
			orders: "="
		}
	}
});
