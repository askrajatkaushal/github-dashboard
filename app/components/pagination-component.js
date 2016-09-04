import Ember from 'ember';

export default Ember.Component.extend({
    currentPage: 1,

    actions: {
        previousPage(queryValue) {
            if(this.currentPage === 1) {
                this.sendAction('searchAuthor', this.currentPage);
            }
            else {
                this.currentPage -= 1;
                this.sendAction('searchAuthor', this.currentPage);
            }
            console.log("Inside previousPage, current page is: ", this.get('queryValue'), ' ', this.currentPage, ' ', this.get('total_count'));
        },
        nextPage(queryValue) {
            if(this.currentPage === (this.get('total_count') / 30)) {
                this.sendAction('searchQuery', this.currentPage);
            }
            else {
                this.currentPage += 1;
                this.sendAction('searchQuery', this.currentPage);
            }
            console.log("Inside nextPage, current page is: ", this.get('queryValue'), ' ', this.currentPage, ' ', this.get('total_count'));
        }
    }
});
