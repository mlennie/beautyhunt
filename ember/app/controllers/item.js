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
		return tags;
	}.property('model')
});