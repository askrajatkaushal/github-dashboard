import Ember from 'ember';

export default Ember.Controller.extend({
    ajax: Ember.inject.service(),

    authors: [],
    selectedRepo: undefined,
    authenticationURL: 'client_id=5ae0f41033bb474f4af4&client_secret=c05dc204d36b0e8a9cc944b4855ae26f11eb8c8c',

    actions: {
        searchQuery(page) {
                var self = this;
                var ajax = self.get('ajax');
                var queryValue = self.get('queryValue');

                console.log('Query is: ', queryValue);

                ajax.request('https://api.github.com/search/repositories?q=' + queryValue + '&page=' + page + '&' + this.get('authenticationURL')).then((responseData) => {
                    console.log('Repositories: ', responseData);
                    this.set('repositories', responseData.items);
                    self.set('total_count', responseData.total_count);
                    return this.get('repositories');
                }).catch((err) => {
                    console.log('Sorry, following error occurred: ', err);
                });
            },

            searchRepo(repo) {
                var self = this;
                var ajax = self.get('ajax');
                var queryValue = self.get('queryValue');

                console.log("Inside searchRepo, searching : ", repo);

                ajax.request('https://api.github.com/repos/' + repo + '&' + this.get('authenticationURL')).then((responseData) => {
                    console.log('Details of Repo', repo, 'is :', responseData);
                    self.set('selectedRepo', responseData);

                    return Ember.RSVP.hash({
                        name: responseData.name,
                        html_url: responseData.html_url,
                        private: responseData.private,
                        description: responseData.description,
                        default_branch: responseData.default_branch,
                        language: responseData.language,
                        has_wiki: responseData.has_wiki,
                        subscribers_count: responseData.subscribers_count,
                        watchers_count: responseData.watchers_count,
                        created_at: extractDate(responseData.created_at),
                        updated_at: extractDate(responseData.updated_at),
                        forks_count: responseData.forks_count,
                        open_issues_count: responseData.open_issues_count,
                        git_url: responseData.git_url,
                        ssh_url: responseData.ssh_url,
                        clone_url: responseData.clone_url,
                        owner: responseData.owner.login,
                        owner_html_url: responseData.owner.html_url,
                        owner_avatar_url: responseData.owner.avatar_url,
                        /*
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
                                                    return '"' + responseData.login + '" has not contributed in any repositories';
                                                }
                                                else if(repos.length <= 100) {
                                                    self.set('iterateRepos', true);
                                                    console.log('repos: ', repos);
                                                    return repos;
                                                }
                                                else {
                                                    self.set('iterateRepos', true);
                                                    self.set('extraRespos', true);
                                                    console.log('repos: ', repos);
                                                    return repos;
                                                }
                                            }),
                                            organizations: ajax.request(responseData.organizations_url + '?per_page=100' + '&' + this.get('authenticationURL')).then((organizations) => {
                                                if(organizations.length === 0) {
                                                    return '"' + responseData.login + '" has not contributed for any organization';
                                                }
                                                else{
                                                    self.set('iterateOrgs', true);
                                                    return organizations;
                                                }
                                            })
                        */
                    }).then((generatedHash) => {
                        console.log('generatedHash:', generatedHash);
                        this.set('repoSelected', true);
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

function extractDate(inputDate) {
    var date = new Date(inputDate);
    var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    return '' + date.getDate() + ' ' + monthNames[date.getMonth()] + ', ' + date.getFullYear();
}
