var priceDropApp = angular.module('priceDropApp', ['ngAnimate','angularUtils.directives.dirPagination']);

priceDropApp.controller('PopupController',['$scope', function ($scope) {
	$scope.productsPerPage = 3;
	storage.getCollection(flipkartDataKey, function(data) {
		setTimeout(function () {
			console.log(data);
			$scope.$apply(function () {
				$scope.data = data,$scope;
			});
		}, 1000);
	});
	
	$scope.remove = function (value) {
		storage.removeFromCollection('priceDropFlipkartData', value.details.id, function () {
			$scope.$apply(function () {
				var index = $scope.data.indexOf(value);
				$scope.data.splice(index,1);
			});
		});
	};
	
	$scope.checkPriceChange = function (value) {
		console.log($scope);
		priceChecker.check(value.details.url, new FlipkartModel(), 'priceDropFlipkartData', function (priceChangeInfo, oldValue) {
			if(!priceChangeInfo.isNull()) {
				storage.getFromCollection('priceDropFlipkartData', value.details.id, function(data) {
					if(data != null) {
						$scope.$apply(function () {
							var index = $scope.data.indexOf(value);
							$scope.data[index] = data;
						});
					}
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
	
	$scope.orderData = function (data, scope) {
		var orderedList = [];
		var priceNoChangeData = [];
		
		for(var key in data) {
			if(data.hasOwnProperty(key)) {
				if(scope.hasMainPriceReduced(data[key])) {
					orderedList.push(data[key]);
				} else {
					priceNoChangeData.push(data[key]);
				}
			}
		}
		
		return orderedList.concat(priceNoChangeData);
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

//
//setTimeout(function () {
//var ctx = document.getElementById("myChart").getContext("2d");
//var myNewChart = new Chart(ctx).Line(data,{datasetFill : false});
//}, 2000);

var data = {
	    labels: ["January", "February", "March", "April", "May", "June", "July"],
	    datasets: [
	        {
	            label: "My Second dataset",
	            fillColor: "rgba(151,187,205,0.2)",
	            strokeColor: "rgba(151,187,205,1)",
	            pointColor: "rgba(151,187,205,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: [28, 48, 40, 19, 86, 27, 90]
	        }
	    ]
	};