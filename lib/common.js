var Utils = {
		parseInt : function (string) {
			if(string == null)
				return null;
			return string.replace(',','').replace('Rs. ', '');
		}
};