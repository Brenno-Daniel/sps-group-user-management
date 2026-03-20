function createUserController(userService) {
  return {
    list: (req, res, next) => {
      try {
        const users = userService.list();
        res.json({ users });
      } catch (err) {
        next(err);
      }
    },
  };
}

module.exports = { createUserController };
