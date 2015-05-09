import Ember from 'ember';
import ENV from "beauty-ember/config/environment";
import SessionMixin from '../mixins/session';
export default Ember.Controller.extend(SessionMixin, {
	sortProperties: ['created_at:desc'],
  sortedItems: Ember.computed.sort('model', 'sortProperties'),

	//queryParams
	queryParams: ['alreadyLoggedIn', 'logoutSuccess'],

	//properties
	loginSuccess: null,
	logoutSuccess: null,
	alreadyLoggedIn: null,
	isLoading: null,
	loginMessage: null,
	itemCreationSuccessfull: null,
	itemCreationFail: null,
	itemCreateFailMessage: "Oops looks like there was a problem. Couldn't create item.",
	itemTitle: null,
	itemUrl: null,
	beautyProducts: null,
	clothes: null,
	shoes: null,
	accessories: null,
	filters: [], //aray of tag ids

	//computed properties
	itemTags: function() {
		return this.store.all('item-tag');
	}.property('model'),

	//get items based on whether there are filters or not
	filteredItems: function() {
		if (this.get('filters.length') == 0) {
			return this.get('sortedItems');
		} else {
			var _this = this;
			var items = this.get('sortedItems');
			var filterIds = this.get('filters');
			var filterLength = filterIds.length;
			var results;

			//filter item if item has all tags in filters
			results = this.get('sortedItems').filter(function(item) {
				var nbMatchingTags = 0;
				filterIds.forEach(function(filterId) {

					//does filter equal one of item's tags (find through itemTag)
					_this.get('itemTags').forEach(function(itemTag) {
						if (itemTag.get('item_id') == item.id &&
								itemTag.get('tag_id') == filterId) {
							nbMatchingTags++; 
							return;
						}
					});
				});

				//make sure item's matching tags are same number as filter array length
				if (nbMatchingTags == filterLength) {
					return true;
				} else { 
					return false; 
				}

			});
			return results;
		}
	}.property('filters','filters.[]', 'sortedItems', 'model'),

	tags: function() {
		return this.store.all('tag');
	}.property(),


	actions: {

		showLoginMessage: function() {				
			var _this = this;
			_this.set('loginMessage', true);
			setTimeout(function(){ _this.set('loginMessage', false);}, 3000);
		},

		createItem: function() {
 			var _this = this;

			//get tags
			var tags = [];
			if (this.get('beautyProducts')) {tags.push("beauty products")};
			if (this.get('clothes')) {tags.push("clothes")};
			if (this.get('shoes')) {tags.push("shoes")};
			if (this.get('accessories')) {tags.push("accessories")};

			//add loading spinner
			this.set('isLoading', true);

      var onFail = function(response) {

      	//handle errors
      	if (response.responseJSON && response.responseJSON.errors) {
      		var errors = response.responseJSON.errors;
      		var errorName = Object.keys(errors)[0];
      		var errorReason = errors[errorName];

      		_this.set('itemCreateFailMessage', errorReason);
      	}
      	
        //reset properties
        _this.set('isLoading', false);
        _this.set('itemCreationFail', true);
        _this.set('itemCreationSuccessfull', false);
      };

			//create item
      // Custom ajax call for resending . 
      Ember.$.ajax({
        url: ENV.APP.API_URL + '/api/items',
        type: 'POST',
        data: {
          title: _this.get('itemTitle'), 
          url: _this.get('itemUrl'),
          tags: tags
        }
        
      //callbacks
      }).then(function(response) {

      	//get item from response
      	var item = response.items[0];
      	var itemTags = response.itemTags;

      	//close model
      	Ember.$('#newItem').modal('hide');

      	//push item to store
				_this.store.push('item', {
					title: _this.get('itemTitle'),
					url: _this.get('itemUrl'),
					id: item._id,
					created_at: new Date
				});

				//push itemTags to store
				itemTags[0].forEach(function(element, index) {

					var itemTag = _this.store.push('item-tag', {
						id: element._id,
						item_id: element.item_id,
						tag_id: element.tag_id,
						created_at: new Date
					});
					console.log(itemTag);
				});

        //reset properties
        _this.set('isLoading', false);
        _this.set('itemCreationFail', false);
        _this.set('itemCreationSuccessfull', true);
        _this.set('itemTitle', null);
        _this.set('itemUrl', null);
        //remove created message after a few seconds
        setTimeout(function(){ _this.set('itemCreationSuccessfull', false);}, 3000);

      }, onFail);
		}
	}
});