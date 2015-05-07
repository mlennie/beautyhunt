import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  url: DS.attr('string'),
  users: DS.belongsTo('user', {async: true}),
  itemTags: DS.hasMany('item-tags', {async: true}),
  created_at: DS.attr('date')
});
