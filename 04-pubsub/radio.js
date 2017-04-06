var radio = (function(){

	var noop = function(){};

	function Radio(){
		this.__subscribers = [];
	}
	Radio.prototype.subscribe = function(){
		var self = this,
			args = arguments;
		Array.prototype.forEach.call(args, function(subscription){
			self.__subscribers.push(subscription);	
		});
		return this;
	};
	Radio.prototype.unsubscribe = function(subscription){
		var self = this,
			args = arguments;

		Array.prototype.forEach.call(args, function(subscriber){
			self.__subscribers = self.__subscribers.filter(function(subscriber){
				if (typeof subscriber === 'function')
					return subscriber !== subscription;
				if (Array.isArray(subscriber)){
					return subscriber[0] !== subscription;
				}
				return true;
			});
		})
		
		return this;
	}
	Radio.prototype.broadcast = function(){
		var args = arguments;
		this.__subscribers.forEach(function(subscriber){
			if (typeof subscriber === 'function')
				subscriber.apply(this, args);
			if (Array.isArray(subscriber)){
				var subscriptionFn = subscriber[0],
					context = subscriber[1];
				subscriptionFn.apply(context, args);
			}
		});
		return this;
	}

	var events = {}
	return function(evtName){
		events[evtName] = events[evtName] || new Radio();
		return events[evtName];
	}
})()