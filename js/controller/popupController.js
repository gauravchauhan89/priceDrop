var priceDropApp = angular.module('priceDropApp', ['ngAnimate']);

priceDropApp.controller('PopupController',['$scope', function ($scope) {
	storage.getCollection('priceDropFlipkartData', function(data) {
		setTimeout(function () {
			console.log(data);
			$scope.$apply(function () {
				$scope.data = data;
			});
		}, 1000);
	});
	
	$scope.orderData = function (data) {
		var priceReducedData = [];
		var priceNoChangeData = [];
		
		for(var key in data) {
			if(data.hasOwnProperty(key)) {
				data[key].key = key;
				if($scope.hasMainPriceReduced(data[key])) {
					priceReducedData.push(data[key]);
				} else {
					priceNoChangeData.push(data[key]);
				}
			}
		}
		
		return priceReducedData.concat(priceNoChangeData);
	};
	
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

priceDropApp.filter('searchFilter', function () {
	return function (data, searchText) {
		if(searchText != null && searchText.trim() != "") {
			var result = [];
			for(var i=0;i<data.length;i++) {
				var name = data[i].details.name;
				var searchArray = searchText.split(" ");
				var matchCount = 0;
				for(var j=0; j<searchArray.length; j++) {
					if(name.toLowerCase().indexOf(searchArray[j].toLowerCase()) != -1) {
						matchCount++;
					}
				}
				if(matchCount == searchArray.length) {
					result.push(data[i]);
				}
			}
			return result;
		} else {
			return data;
		}
	};
});

priceDropApp.filter('convertHTMLEntities', function() {
    return function (text) {
    	return text.replace(/&amp;/g, '&');
    };
});