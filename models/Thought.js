const { Schema, model, Types } = require("mongoose");
// Importing the moment module to format the timestamp
const moment = require("moment");

// reaction schema
const reactionSchema = new Schema({
  reactionId: {
    // Mongoose ObjectId data type
    type: Schema.Types.ObjectId,
    // The default value is set to new ObjectId
    default: () => new Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    // Will set default value to current timestamp
    default: Date.now(),
    // Use a getter method to format the timestamp on query
    get: (createdAtVal) =>
      moment(createdAtVal).format("MMMM Do YYYY, h:mm:ss a"),
  },
});

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      maxlength: 250,
      minlength: 1,
    },
    createdAt: {
      type: Date,
      // Will set default value to current timestamp
      default: Date.now(),
      // Use a getter method to format the timestamp on query
      get: (createAtVal) =>
        moment(createAtVal).format("MMMM Do YYYY, h:mm:ss a"),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Create a virtual property `reactionCount` that gets the amount of reactions
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reaction.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
