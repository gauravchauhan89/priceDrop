var priceDropApp = angular.module('priceDropApp', []);

priceDropApp.controller('PopupController',['$scope', function ($scope) {
	storage.getCollection('priceDropFlipkartData', function(data) {
		console.log(data);
		$scope.$apply(function () {
			$scope.data = data;
		});
	});
	
	$scope.remove = function (key) {
		storage.removeFromCollection('priceDropFlipkartData', key, function () {
			storage.getCollection('priceDropFlipkartData', function(data) {
				$scope.$apply(function () {
					$scope.data = data;
				});
			});
		});
	};
	
	$scope.checkPriceChange = function (key) {
		priceChecker.check(key, new FlipkartModel(), 'priceDropFlipkartData', function (priceChangeInfo, oldValue) {
			if(!priceChangeInfo.isNull()) {
				storage.getCollection('priceDropFlipkartData', function(data) {
					$scope.$apply(function () {
						$scope.data = data;
					});
				});
			}
		});
	};
	
	$scope.hasMainPriceReduced = function(data) {
		var len = data.priceChangeInfo.length;
		
		if(len > 0) {
			var priceChangeInfo = data.priceChangeInfo[len-1];
			
			if(priceChangeInfo.priceInfo.mainPrice < 0) {
				return 1;
			} else if(priceChangeInfo.priceInfo.exchangePrice < 0) {
				return 2;
			} else if(priceChangeInfo.priceInfo.otherPrice < 0) {
				return 3;
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	};
	
	$scope.hasMainPriceIncreased = function(data) {
		var len = data.priceChangeInfo.length;
		
		if(len > 0) {
			var priceChangeInfo = data.priceChangeInfo[len-1];
			
			if(priceChangeInfo.priceInfo.mainPrice > 0) {
				return 1;
			}
		} else {
			return 0;
		}
	};
}]);