const mongoose = require('mongoose');

class ReviewClass {}

const reviewSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

reviewSchema.loadClass(ReviewClass);

let Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
