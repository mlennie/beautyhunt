import DS from 'ember-data';
import ENV from "beauty-ember/config/environment";

export default DS.ActiveModelAdapter.extend({
  host: ENV.APP.API_URL
});
