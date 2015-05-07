import DS from 'ember-data';

export default DS.Model.extend({
	tag_id: DS.attr('string'),
	item_id: DS.attr('string'),
  created_at: DS.attr('date')
});
