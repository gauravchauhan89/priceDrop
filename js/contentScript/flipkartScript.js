function addToStore() {
	var url = window.location.href;
	var flipkartDto = new FlipkartModel();
	var allPrices = flipkartDto.getAllPrices(document);
	var details = flipkartDto.getDetails(document);
	details.url = url;
	
	var data = {priceInfo: allPrices, details: details};
	storage.addToCollection('priceDropFlipkartData', url, data);
//	chrome.storage.sync.get('priceDropFlipkartData', function (data) {
//		
//		if(data['priceDropFlipkartData'] != null && data['priceDropFlipkartData'] != undefined) {
//			var urlArray = data['priceDropFlipkartData'];
//			if(urlArray.indexOf(url) == -1) {
//				urlArray.push(url);
//				chrome.storage.sync.set({'priceDropFlipkartData': urlArray});
//			}
//		} else {
//			chrome.storage.sync.set({'priceDropFlipkartData': [url]});
//		}
//	});
}

var form = document.getElementsByName("express-checkout-form");
var input = document.createElement("INPUT");
input.type = "button";
input.value =  "Add to PriceDrop";
input.className += " btn-express-checkout btn-big current";
input.onclick = addToStore;
form[0].appendChild(input);