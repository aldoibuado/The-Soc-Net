const { User, Thought } = require('../models');

module.exports = {
    // Get all thoughts
    getThoughts(req, res) {
        Thought.find({})
         .then((thought) => res.json(thought))
         .catch((err) => res.status(500).json(err));
    },
    // Get a single thought
    getThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
          .select('-__v')
          .then((thought) => 
           !thought 
             ? res.status(404).json({ message: 'No thought with that ID' })
             : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
    },
    // Create thought
    createThought(req, res) {
        Thought.create(req.body)
          .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: req.params.userId },
                { $push: { thoughts: _id } },
                { new: true }
            );
          })
          .then((thought) => 
          !thought
            ? res.status(404).json({ message: "No user with this ID!" })
            : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
    },
}