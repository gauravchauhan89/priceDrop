function checkerCallback(data, changedSellers, newOffers, newMinSeller) {
	var items = [];
	if(changedSellers != null) {
		changedSellers.forEach(function (seller) {
			if(seller.priceHistory[seller.priceHistory.length-1].priceChange < 0) {
				items.push({'title':seller.name, 'message':'Price reduced to '+seller.price});
			}
		});
	}
	
	if(newOffers != null) {
		for(var sellerName in newOffers) {
			if(newOffers.hasOwnProperty(sellerName)) {
				items.push({'title':sellerName, 'message':newOffers[sellerName].length+' new offer(s)'});
			}
		}
	}
	
	if(newMinSeller != null) {
		items.push({'title':newMinSeller.name, 'message':'New Seller with price '+newMinSeller.price});
	}
	
	if(items.length != 0) {
		var opt = {
					'type' : "list", 
					'iconUrl': "../images/icon.png", 
					'title': data.details.name,
					'message': data.details.name,
					'items': items,
					'isClickable': true
				   };
		
		try {
			chrome.notifications.create(data.details.url, opt, function (id) {});
		} catch (e) {
			console.log(e);
		}
		opt['timestamp'] = Date.now();
		storage.addToCollection("pdNotificationInfo", data.details.url, opt);
	}
}

chrome.notifications.onClicked.addListener(function (productUrl) {
	chrome.tabs.create({url: productUrl});
});

function checkProduct() {
	storage.getCollection(flipkartDataKey, function (data) {
		for(var key in data) {
			if(data.hasOwnProperty(key)) {
				if(data[key].sellerInfos != null && data[key].sellerInfos.length > 0) { // if any sellerInfo present
					priceChecker.check(key, new FlipkartModel(), flipkartDataKey, checkerCallback);
				}
			}
		}
	});
}

checkProduct();
setInterval(checkProduct, 10*60*1000);	// 2 hours