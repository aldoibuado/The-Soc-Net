const { User, Thought } = require('../models');

module.exports = {
    // Get all thoughts
    getThoughts(req, res) {
        Thought.find({})
        .populate({
            path: "reactions",
            select: "-__v",
        })
        // .populate({
        //     path: "thoughtText",
        //     select: "-__v",
        // })
        .select("-__v")
         .then((thought) => res.json(thought))
         .catch((err) => {
            console.log(err)
            res.status(400).json(err);
         })
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
    createThought({ body }, res) {
        console.log(body)
        Thought.create(body)
          .then((thoughtData) => {
            return User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: thoughtData._id } },
                { new: true }
            );
            })
          .then(thought => {
          if (!thought) {
            res.status(404).json({ message: "No user with this ID! change" })
            return;
          }
             res.json(thought);
        })
          .catch((err) => res.json(err));
    },
}

