var SortedList = (function() {
	var SortedList = function SortedList(list, compare) {
		this.list = list;
		this.compare = compare;
	}

	SortedList.prototype.insert = function(value) {
		var index = this.indexOf(value);
		if(index === - 1) {
			this.list.push(value);
			this.list.sort(this.compare);
		} else {
			this.list[index] = value;
		}
	}

	SortedList.prototype.remove = function(value) {
		var index = this.indexOf(value);
		if(index !== -1) {
			this.list.splice(index, 1);
		}
	}

		SortedList.prototype.indexOf = function(value) {
			var index = -1;
			for(var i = 0; index === -1 && i < this.list.length; i++) {
				if(this.compare(value, this.list[i]) === 0 ) {
					index = i;
				}
			}
			return index;
		}

	return SortedList;
})();
