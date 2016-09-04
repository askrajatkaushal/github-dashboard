import Ember from 'ember';

export default Ember.Controller.extend({
    ajax: Ember.inject.service(),
    
    authors: [],
    selectedAuthor: undefined,

    actions: {
        searchQuery(page) {
            var self = this;
            var ajax = self.get('ajax');
            var queryValue = self.get('queryValue');

            console.log('Query is: ', queryValue);

            ajax.request('https://api.github.com/search/users?q=' + queryValue + '&page=' + page).then((responseData) => {
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

            ajax.request('https://api.github.com/users/' + author).then((responseData) => {
                console.log('Details of Author', author, 'is :', responseData);
                self.set('selectedAuthor', responseData);

                return Ember.RSVP.hash({
                    login_id: responseData.login,
                    avatar_url: responseData.avatar_url,
                    html_url: responseData.html_url,
                    followers: ajax.request(responseData.followers_url + '?per_page=100').then((followers) => {
                        if(followers.length < 100)
                            return followers.length;
                        else
                            return 'More than 100';
                    }),
                    following: ajax.request(responseData.following_url.replace('{/other_user}', '') + '?per_page=100').then((following) => {
                        if(following.length < 100)
                            return following.length;
                        else
                            return 'More than 100';
                    }),
                    subscriptions: ajax.request(responseData.subscriptions_url + '?per_page=100').then((subscriptions) => {
                        if(subscriptions.length < 100)
                            return subscriptions.length;
                        else
                            return 'More than 100';
                    }),
                    repos: ajax.request(responseData.repos_url + '?per_page=100').then((repos) => {
                        if(repos.length === 0) {
                            return '"' + responseData.login + '" has not contributed in any repositories';
                        }
                        else if(repos.length <= 100) {
                            self.set('iterateRepos', true);
                            console.log('repos: ', repos[0].name);
                            return repos;
                        }
                        else {
                            self.set('iterateRepos', true);
                            self.set('extraRespos', true);
                            console.log('repos: ', repos[0].name);
                            return repos;
                        }
                    }),
                    organizations: ajax.request(responseData.organizations_url + '?per_page=100').then((organizations) => {
                        if(organizations.length === 0) {
                            return '"' + responseData.login + '" has not contributed for any organization';
                        }
                        else{
                            var orgNames = [];
                            var orgURL = [];
                            var orgAvatar = [];
                            var org = [];
                            for(var i = 0; i < organizations.length; i++) {
                                orgNames[i] = organizations[i].login;
                                orgURL[i] = 'https://www.github.com/' + organizations[i].login;
                                orgAvatar[i] = organizations[i].avatar_url;
                                org.push({
                                    orgName: organizations[i].login,
                                    orgURL: 'https://www.github.com/' + organizations[i].login,
                                    orgAvatar: organizations[i].avatar_url
                                });
                            }
                            console.log("orgNames: ", orgNames, "orgURL: ", orgURL, "orgAvatar: ", orgAvatar);
                            self.set('orgNames', orgNames);
                            self.set('orgURL', orgURL);
                            self.set('orgAvatar', orgAvatar);
                            self.set('org', org);
                            self.set('iterateOrgs', true);
                            return org;
                        }
                    })
                }).then((generatedHash) => {
                    console.log('generatedHash:', generatedHash);
                    this.set('authorSelected', true);
                    this.set('generatedHash', generatedHash);
                    return generatedHash;
                });
/*
                this.set('jsonObj', JSON.stringify(responseData).split(','));
*/
            }).catch((err) => {
                console.log('Sorry, following error occurred: ', err);
            });
        }
    }
});
