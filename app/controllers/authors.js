import Ember from 'ember';

export default Ember.Controller.extend({
    ajax: Ember.inject.service(),
    
    authors: [],
    selectedAuthor: undefined,
    authenticationURL: 'client_id=5ae0f41033bb474f4af4&client_secret=c05dc204d36b0e8a9cc944b4855ae26f11eb8c8c',
    iterateOrgs: true,
    iterateRepos: true,
    extraRespos: true,

    actions: {
        searchQuery(page) {
            var self = this;
            var ajax = self.get('ajax');
            var queryValue = self.get('queryValue');

            console.log('Query is: ', queryValue);

            ajax.request('https://api.github.com/search/users?q=' + queryValue + '&page=' + page + '&' + this.get('authenticationURL')).then((responseData) => {
                console.log('Github Users: ', responseData);
                this.set('authors', responseData.items);
                self.set('total_count', responseData.total_count);
                return this.get('authors');
            }).catch((err) => {
                console.log('Sorry, following error occurred: ', err);
            });
        },

        searchAuthor(author) {
            var self = this;
            var ajax = self.get('ajax');

            console.log("Inside searchAuthor, searching : ", author);

            ajax.request('https://api.github.com/users/' + author + '?' + this.get('authenticationURL')).then((responseData) => {
                console.log('Details of Author', author, 'is :', responseData);
                self.set('selectedAuthor', responseData);

                return Ember.RSVP.hash({
                    login_id: responseData.login,
                    avatar_url: responseData.avatar_url,
                    html_url: responseData.html_url,
                    followers: ajax.request(responseData.followers_url + '?per_page=100' + '&' + this.get('authenticationURL')).then((followers) => {
                        if(followers.length < 100)
                            return followers.length;
                        else
                            return 'More than 100';
                    }),
                    following: ajax.request(responseData.following_url.replace('{/other_user}', '') + '?per_page=100' + '&' + this.get('authenticationURL')).then((following) => {
                        if(following.length < 100)
                            return following.length;
                        else
                            return 'More than 100';
                    }),
                    subscriptions: ajax.request(responseData.subscriptions_url + '?per_page=100' + '&' + this.get('authenticationURL')).then((subscriptions) => {
                        if(subscriptions.length < 100)
                            return subscriptions.length;
                        else
                            return 'More than 100';
                    }),
                    repos: ajax.request(responseData.repos_url + '?per_page=100' + '&' + this.get('authenticationURL')).then((repos) => {
                        if(repos.length === 0) {
                            self.set('iterateRepos', false);
                            self.set('extraRespos', false);
                            return '"' + responseData.login + '" has not contributed in any repositories';
                        }
                        else if(repos.length < 100) {
                            self.set('extraRespos', false);
                            console.log('repos: ', repos[0].name);
                            return repos;
                        }
                        else {
                            console.log('ExtraRepos:', this.get('extraRespos'));
                            console.log('repos: ', repos[0].name);
                            return repos;
                        }
                    }),
                    organizations: ajax.request(responseData.organizations_url + '?per_page=100' + '&' + this.get('authenticationURL')).then((organizations) => {
                        if(organizations.length === 0) {
                            self.set('iterateOrgs', false);
                            return '"' + responseData.login + '" has not contributed for any organization';
                        }
                        else{
                            return organizations;
                        }
                    }),
                    iterateRepos: this.get('iterateRepos'),
                    iterateOrgs: this.get('iterateOrgs'),
                    extraRespos: this.get('extraRespos'),
                }).then((generatedHash) => {
                    console.log('generatedHash:', generatedHash);
                    this.set('authorSelected', true);
                    this.set('generatedHash', generatedHash);
                    return generatedHash;
                });
            }).catch((err) => {
                console.log('Sorry, following error occurred: ', err);
            });
        }
    }
});
