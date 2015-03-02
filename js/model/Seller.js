function Seller() {
	this.name = null;
	this.price = null;
	this.offers = [];
	this.exchangeOffer = null;
	this.exchangePrice = null;
	this.priceHistory = [];
	this.rating = null;
	this.isNewSeller = null;
	this.isAvailable = true;
}

Seller.prototype = {
		name: null,
		price: null,
		offers: null,
		exchangeOffer: null,
		exchangePrice: null,
		priceHistory: null,
		rating: null,
		isNewSeller: null,
		isAvailable: null,
		clone: function(seller) {
			var newSeller = new Seller();
			newSeller.name = seller.name;
			newSeller.price = seller.price;
			newSeller.offers = [];
			for(var i=0; i<seller.offers.length; i++) {
				newSeller.offers.push(seller.offers[i]);
			}
			newSeller.exchangeOffer = seller.exchangeOffer;
			newSeller.exchangePrice = seller.exchangePrice;
			
			newSeller.priceHistory = [];
			for(var i=0; i<seller.priceHistory.length; i++) {
				var history = new PriceHistory();
				history.priceChange = seller.priceHistory[i].priceChange;
				history.date = seller.priceHistory[i].date;
				newSeller.priceHistory.push(history);
			}
			
			newSeller.rating = seller.rating;
			newSeller.isNewSeller = seller.isNewSeller;
			newSeller.isAvailable = seller.isAvailable;
			
			return newSeller;
		},
		equals: function (seller) {
			if(this.name == seller.name && this.price == seller.price) {
				return true;
			}
			return false;
		}
};