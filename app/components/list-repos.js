import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        showDetails(repo) {
            console.log("Inside showDetails, sending : ", repo);
            this.sendAction('searchRepo', repo);
        }
    }
});
