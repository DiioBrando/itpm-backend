class UserDTO {
    id;
    email;
    login;
    isActivated;
    roles;
    projects;
    subProjects;

    constructor(model) {
        this.id = model._id;
        this.login = model.login;
        this.email = model.email;
        this.isActivated = model.isActivated;
        this.roles = model.roles;
        this.projects = model.projects;
        this.subProjects = model.subProjects;
    }



}

export default UserDTO