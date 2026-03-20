class UserService {
  constructor(userRepository) {
    this._users = userRepository;
  }

  list() {
    return this._users.findAll().map((user) => this._toPublicUser(user));
  }

  _toPublicUser(user) {
    const copy = { ...user };
    delete copy.password;
    return copy;
  }
}

module.exports = { UserService };
