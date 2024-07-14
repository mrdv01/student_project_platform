const projects = require('../models/projects');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const project = await projects.findById(req.params.id);
    const review = new Review(req.body.review);
    review.owner = req.user._id;
    project.reviews.push(review);

    await review.save();
    await project.save();
    req.flash('success', 'Successfully Created A Review');
    res.redirect(`/projects/${project._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await projects.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted A Review');
    res.redirect(`/projects/${id}`);
}