import DS from 'ember-data';
import ENV from "beauty-ember/config/environment";

export default DS.RESTAdapter.extend({
  host: ENV.APP.API_URL,
  namespace: 'api'
});
