function check() {
	storage.getCollection('priceDropFlipkartData', function (data) {
		for(var key in data) {
			console.log("In backgroud: "+key);
			if(data.hasOwnProperty(key)) {
				priceChecker.check(key, new FlipkartModel(), 'priceDropFlipkartData', null);
			}
		}
	});
}

check();
setInterval(check, 60*1000);