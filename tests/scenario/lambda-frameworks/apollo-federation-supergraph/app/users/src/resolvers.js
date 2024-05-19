import data from "./data.js"

export default {
  Query: {
    me() {
      return {
        id: "1",
        username: "@ava",
      }
    },

    // getUser(_, args) {
    //   const user = data.users.find(({ email }) => email === args.email)

    //   if (user) {
    //     return user
    //   }

    //   throw new Error('Could not find user.')
    // },
  },

  User: {
    __resolveReference(_user) {
      const user = data.users.find(({ id }) => id === _user.id)

      if (user) {
        return user
      }

      throw new Error("Could not find user.")
    },
  },
}
