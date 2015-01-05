var priceDropApp = angular.module('priceDropApp', []);

priceDropApp.factory('storageService', function() {
	  return storage;
});

priceDropApp.controller('PopupController',['$scope', 'storageService', function ($scope, storageService) {
	storageService.getCollection('priceDropFlipkartData', function(data) {
		$scope.$apply(function () {
			$scope.data = data;
		});
	});
}]);

//document.addEventListener('DOMContentLoaded', function () {
//		chrome.storage.sync.get('priceDropFlipkartData', function (data) {
//			console.log(data);
//			var map = data['priceDropFlipkartData'];
//			for(var key in map) {
//				if(map.hasOwnProperty(key)) {
//					flipkart.successCallback(map[key], null, null);
//				}
//			}
//		});
//	});
//
//var flipkart = {
//		successCallback : function success(data, textStatus, jqXHR) {
//				
//				var allPrices = new PriceInfo();
//				allPrices.mainPrice = data.priceInfo.mainPrice;
//				allPrices.exchangePrice = data.priceInfo.exchangePrice;
//				allPrices.otherPrices = data.priceInfo.otherPrices;
//				
//				var details = data.details;
//				$("#flipkart-list")[0].innerHTML += details.name + "<br>";
//
//				if(!allPrices.isNull()) {
//					if(allPrices.exchangePrice != null) {
//						$("#flipkart-list")[0].innerHTML += "Original Price: " + allPrices.mainPrice + "<br />";
//						$("#flipkart-list")[0].innerHTML += "Exchange Price: " + allPrices.exchangePrice + "<br />";
//					} else {
//						$("#flipkart-list")[0].innerHTML += "Main Price: " + allPrices.mainPrice + "<br />";
//					}
//					
//					if(allPrices.otherPrices.length != 0) {
//						$("#flipkart-list")[0].innerHTML += "Other Prices : <br/>";
//						for(var i=0; i<allPrices.otherPrices.length; i++) {
//							$("#flipkart-list")[0].innerHTML += allPrices.otherPrices[i] + "<br />";
//						}
//					}
//				}
//				$("#flipkart-list")[0].innerHTML += '-------------------------------------------------<br>';
//			}
//};
