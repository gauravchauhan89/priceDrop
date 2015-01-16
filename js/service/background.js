function checkerCallback(priceChangeInfo, oldData) {
	if(!priceChangeInfo.isNull()) {
		//if price reduced
		var info = oldData.details;
		var notifyMessage = "";
		if(priceChangeInfo.priceInfo.mainPrice !== null && parseInt(priceChangeInfo.priceInfo.mainPrice) < 0) {
			var oldPrice = oldData.priceInfo.mainPrice;
			if(oldData.settings.showNotification && parseInt(oldPrice)+parseInt(priceChangeInfo.priceInfo.mainPrice) < parseInt(oldData.settings.notificationAmount)) {
				notifyMessage = "Price of "+info.name+ " has changed from "+oldPrice+ " to "+(parseInt(oldPrice)+parseInt(priceChangeInfo.priceInfo.mainPrice));
				// TODO set new amount as notification amount
			}
		}
						
		if(notifyMessage !== "") {
			chrome.notifications.create("", {type : "basic", iconUrl: "../images/icon.png", title: "Price Drop", message: notifyMessage}, function (id) {});
		}
	}
}

function check() {
	storage.getCollection('priceDropFlipkartData', function (data) {
		for(var key in data) {
			if(data.hasOwnProperty(key)) {
				console.log("In backgroud: "+key);
				priceChecker.check(key, new FlipkartModel(), 'priceDropFlipkartData', checkerCallback);
			}
		}
	});
}

check();
setInterval(check, 2*60*60*1000);	// 2 hours