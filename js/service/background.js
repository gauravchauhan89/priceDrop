function check() {
	storage.getCollection('priceDropFlipkartData', function (data) {
		for(var key in data) {
			console.log("In backgroud: "+key);
			if(data.hasOwnProperty(key)) {
				priceChecker.check(key, new FlipkartModel(), 'priceDropFlipkartData', function (priceChangeInfo, oldData) {
					if(!priceChangeInfo.isNull()) {
						// if price reduced
						var info = oldData.details;
						var notifyMessage = "";
						if(priceChangeInfo.priceInfo.mainPrice != null) {
							var oldPrice = oldData.priceInfo.mainPrice;
							notifyMessage = "Price of "+info.name+ " has changed from "+oldPrice+ " to "+(parseInt(oldPrice)+parseInt(priceChangeInfo.priceInfo.mainPrice));
						} else if(priceChangeInfo.priceInfo.otherPrice != null) {
							var oldPrice = oldData.priceInfo.otherPrice;
							notifyMessage = "Other Price of "+info.name+ " has changed from "+oldPrice+ " to "+(parseInt(oldPrice)+parseInt(priceChangeInfo.priceInfo.otherPrice));
						} else if(priceChangeInfo.priceInfo.exchangePrice != null) {
							var oldPrice = oldData.priceInfo.exchangePrice;
							notifyMessage = "Exchange Price of "+info.name+ " has changed from "+oldPrice+ " to "+(parseInt(oldPrice)+parseInt(priceChangeInfo.priceInfo.exchangePrice));
						}
						
						chrome.notifications.create("", {type : "basic", iconUrl: "../images/icon.png", title: "Price Drop", message: notifyMessage}, function (id) {});
					}
				});
			}
		}
	});
}

check();
setInterval(check, 2*60*60*1000);	// 2 hours