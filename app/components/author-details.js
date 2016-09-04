import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        sendToRepo(repo) {
            this.transitionToRoute('repositories', repo);
        }
    }
});
