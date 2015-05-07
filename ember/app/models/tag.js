import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  url: DS.attr('string'),
  itemTags: DS.hasMany('item-tags', {async: true}),
  created_at: DS.attr('date')
});
