const { User, Thought } = require('../models');

const resolvers = {
    Query: {
        // get all thoughts/thoughts belonging to a user
        thoughts: async (parent, { username }) => {
            const params = username ? { username } : {}
            // perform find() method and return thought data in descending order
            return Thought.find(params).sort({ createdAt: -1 });
        },
        // get thought by id
        thought: async(parent, { _id }) => {
            return Thought.findOne({ _id });
        }, 
        // get all users
        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts');
        },
        // get user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts');
        },
    }
};


module.exports = resolvers;