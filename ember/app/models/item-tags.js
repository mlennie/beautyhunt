import DS from 'ember-data';

export default DS.Model.extend({
  tag: DS.belongsTo('tag', {async: true}),
  item: DS.belongsTo('item', {async: true}),
  created_at: DS.attr('date')
});
