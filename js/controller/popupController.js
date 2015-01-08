var priceDropApp = angular.module('priceDropApp', []);

priceDropApp.controller('PopupController',['$scope', function ($scope) {
	storage.getCollection('priceDropFlipkartData', function(data) {
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
		priceChecker.check(key, new FlipkartModel(), 'priceDropFlipkartData', function (priceChangeInfo) {
			if(!priceChangeInfo.isNull()) {
				storage.getCollection('priceDropFlipkartData', function(data) {
					$scope.$apply(function () {
						$scope.data = data;
					});
				});
			}
		});
	};
	
	$scope.hasPriceReduced = function(data) {
		var len = data.priceChangeInfo.length;
		
		if(len > 0) {
			var priceChangeInfo = data.priceChangeInfo[len-1];
			
			if(priceChangeInfo.priceInfo.mainPrice < 0) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};
}]);