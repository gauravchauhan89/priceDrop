var storage = {
	addToCollection : function (collectionKey, key, value) {
		
		chrome.storage.sync.get(collectionKey, function (data) {
			
			if(data[collectionKey] != null && data[collectionKey] != undefined) {
				var map = data[collectionKey];
				if(!map.hasOwnProperty(key)) {
					map[key] = value;
					var store = {};
					store[collectionKey] = map;
					chrome.storage.sync.set(store);
				}
			} else {
				var map = {};
				map[key] = value;
				var store = {};
				store[collectionKey] = map;
				chrome.storage.sync.set(store);
			}
		});
	},

	getCollection : function (collectionKey, callBack) {
		chrome.storage.sync.get(collectionKey, function (data) {
			callBack(data[collectionKey]);
		});
	},
	
	getFromCollection : function (collectionKey, key, callBack) {
		chrome.storage.sync.get(collectionKey, function (data) {
			var map = data[collectionKey];
			
			if(map.hasOwnProperty(key)) {
				callBack(map[key]);
			} else {
				callBack(null);
			}
		});
	},
	
	removeFromCollection : function (collectionKey, key, successCallBack, failureCallBack) {
		chrome.storage.sync.get(collectionKey, function (data) {
			var map = data[collectionKey];
			
			if(map.hasOwnProperty(key)) {
				delete map[key];
				var store = {};
				store[collectionKey] = map;
				chrome.storage.sync.set(store, function () {
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