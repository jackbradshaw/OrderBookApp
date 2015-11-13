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
		var baseUrl = "./";
		$http.get(baseUrl + "order?direction=1").then(this.getBuyOrders.bind(this));
		$http.get(baseUrl + "order?direction=-1").then(this.getSellOrders.bind(this));
		$http.get(baseUrl + "trade").then(this.getTrades.bind(this));
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
