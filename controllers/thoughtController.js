const { User, Thought } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find({})
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  // Get single thought
  getThought(req, res) {
   Thought.findOne({ _id: req.params.thoughtId })
    .select('-__v')
    .then((thought) => 
     !thought
      ? res.status(404).json({ message: 'No thought with this ID' })
      : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
  },
  // Create a thought
  createThought(req, res) {
    Thought.create(req.body)
     .then((thought) => {
      return User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id }},
        { new: true }
      );
     })
     .then((user) =>
      !user
       ? res.status(404).json({ message: 'comment created but no user with this ID!' })
       : res.json({ message: 'comment created!' })
     )
     .catch((err) => {
       console.error(err);
     });
  },
  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
    )
        .then((user) =>
         !user
           ? res.status(404).json({ message: 'No thought with this ID!' })
           : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
 },
//  Delete a thought
deleteThought(req, res) {
  Thought.findOneAndDelete({ _id: req.params.thoughtId })
    .then((thought) => 
     !thought
       ? res.status(404).json({ message: 'No thought with this ID' })
       : User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId} },
        { new: true }
       )
    )   
        .then((user) => 
         !user
           ?res.status(404).json({ message: 'No thought with this ID!' })
           : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
},
 // Add a reaction
 addReaction(req, res) {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $addToSet: { reactions: req.body } },
    { runValidators: true, new: true }
  )
    .then((thought) => 
     !thought
      ? res.status(404).json({ message: 'No thought with this ID!' })
      : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
},
// Remove a reaction
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) => 
       !thought
        ? res.status(404).json({ message: 'No thought with this ID!' })
        : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },    
};