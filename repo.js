exports.Repo = class {
    constructor(
        name, html_url, description, homepage
    ) {
        this.name = name;
        this.gitlink = html_url;
        this.description = description;
        this.url = homepage;
    }
}