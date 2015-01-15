function addToStore() {
	var url = window.location.href;
	var flipkartDto = new FlipkartModel();
	var allPrices = flipkartDto.getAllPrices(document);
	var details = flipkartDto.getDetails(document);
	details.url = url;
	
	var data = new Data();
	data.priceInfo = allPrices;
	data.details = details;
	
	storage.addToCollection('priceDropFlipkartData', url, data);
	input.className += " disabled";
}

var form = document.getElementsByName("buy-now-form");
var lineBreak = document.createElement("BR");
var lineBreak1 = document.createElement("BR");
var input = document.createElement("INPUT");
input.type = "button";
input.value =  "Add to PriceDrop";
input.onclick = addToStore;
input.className += " btn-buy-now btn-big current";
var url = window.location.href;

storage.getFromCollection('priceDropFlipkartData', url, function (data) {
	if(data != null) {
		input.className += " disabled";
	}

	form[0].appendChild(lineBreak);
	form[0].appendChild(lineBreak1);
	form[0].appendChild(input);
});
