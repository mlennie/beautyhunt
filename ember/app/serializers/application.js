import DS from 'ember-data';
import ENV from "beauty-ember/config/environment";

export default DS.RESTSerializer.extend({
  primaryKey: '_id'
});
