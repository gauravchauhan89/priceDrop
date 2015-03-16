var storage = {
	addToCollection : function (collectionKey, key, value) {
		
		chrome.storage.local.get(collectionKey, function (data) {
			
			if(data[collectionKey] != null && data[collectionKey] != undefined) {
				var map = data[collectionKey];
				if(!map.hasOwnProperty(key)) {
					map[key] = value;
					var store = {};
					store[collectionKey] = map;
					chrome.storage.local.set(store);
				}
			} else {
				var map = {};
				map[key] = value;
				var store = {};
				store[collectionKey] = map;
				chrome.storage.local.set(store);
			}
		});
	},

	updateKeyInCollection: function (collectionKey, key, value, callback) {
		chrome.storage.local.get(collectionKey, function (data) {
			if(data[collectionKey] != null && data[collectionKey] != undefined) {
				var map = data[collectionKey];
				if(map.hasOwnProperty(key)) {
					map[key] = value;
					var store = {};
					store[collectionKey] = map;
					if(callback != null)
						chrome.storage.local.set(store, callback);
					else
						chrome.storage.local.set(store);
				}
			}
		});
	},
	
	getCollection : function (collectionKey, callBack) {
		chrome.storage.local.get(collectionKey, function (data) {
			if(callBack != null) {
				callBack(data[collectionKey]);
			}
		});
	},
	
	getFromCollection : function (collectionKey, key, callBack) {
		chrome.storage.local.get(collectionKey, function (data) {
			var map = data[collectionKey];
			
			if(map != null) {
				if(map.hasOwnProperty(key)) {
					callBack(map[key]);
				} else {
					callBack(null);
				}
			} else {
				callBack(null);
			}
		});
	},
	
	removeFromCollection : function (collectionKey, key, successCallBack, failureCallBack) {
		chrome.storage.local.get(collectionKey, function (data) {
			var map = data[collectionKey];
			
			if(map.hasOwnProperty(key)) {
				delete map[key];
				var store = {};
				store[collectionKey] = map;
				chrome.storage.local.set(store, function () {
					if(chrome.runtime.lastError == undefined) {
						if(successCallBack != null)
							successCallBack();
					} else {
						if(failureCallBack != null)
							failureCallBack();
					}
				});
			}
		});
	}
};