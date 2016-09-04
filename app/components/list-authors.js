import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        showDetails(author) {
            console.log("Inside showDetails, sending : ", author);
            this.sendAction('searchAuthor', author);
        }
    }
});
