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
}]);