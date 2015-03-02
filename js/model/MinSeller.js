function MinSeller() {
	this.seller = null;
	this.userInterested = null;
}

MinSeller.prototype = {
	seller: null,
	userInterested: null,
	clone: function(value) {
		var newMinSeller = new MinSeller();
		newMinSeller.seller = Seller.prototype.cloneSeller(value.seller);
		newMinSeller.userInterested = value.userInterested;
		return newMinSeller;
	}
};