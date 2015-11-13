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
		this.socket.on("order", this.order.bind(this));
	};

	Controller.$inject = ["$scope", "$http"];

	Controller.prototype.getBuyOrders = function(result) {
		this.buyOrders = result.data;
	}

	Controller.prototype.getSellOrders = function(result) {
		this.sellOrders = result.data;
	}

	Controller.prototype.getTrades = function(result) {
		this.trades = result.data;
	}

	Controller.prototype.connect = function() {
		console.log("connect");
	}

	Controller.prototype.trade = function(trade) {
		this.$scope.$apply((function() {
			trade = JSON.parse(trade);
			this.trades && this.trades.push(trade);
		}).bind(this));
	}

	Controller.prototype.order = function(order) {
		this.$scope.$apply((function() {
			order = JSON.parse(order);
			if(order.direction === 1) {
				this.buyOrders && this.buyOrders.push(order);
			} else if(order.direction === -1) {
				this.sellOrders && this.sellOrders.push(order);
			}
		}).bind(this));
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
