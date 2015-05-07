import Ember from 'ember';
import ENV from "beauty-ember/config/environment";
export default Ember.ObjectController.extend({
	tags: function() {
		var _this = this;
		var itemTags = _this.store.all('item-tag');
		var tags = [];
		itemTags.forEach(function(element, index) {
			if (_this.get('model.id') == element.get('item_id')) {
				var tag = _this.store.getById('tag', element.get('tag_id'));
				tags.push(tag);
			}
		});
		var name; 
		var names = [];
		for(var i = 0; i < tags.length; i++) {
			if (i < (tags.length - 1)) {
				name = tags[i].get('name'); //+ ",";
				console.log(name);
			} else {
				name = tags[i].get('name');
				console.log(name);
			}
			names[i] = name;
		}
		console.log(names)
		return names;
	}.property()
});