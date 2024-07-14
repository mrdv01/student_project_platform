const {projectSchema,reviewSchema} = require('./schemas');
const Projects = require('./models/projects');
const ExpressError = require('./utils/ExpressError')
const Review = require('./models/review');
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash('error','You Must be Signed In');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo=(req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateProject = (req,res,next)=>{
    const {error} = projectSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}

module.exports.isOwner = async(req,res,next)=>{
    const { id } = req.params;
    const project = await Projects.findById(id);
   
    if(!project.owner.equals(req.user._id)){
        req.flash('error','You do not have permission to do that');
         return res.redirect(`/projects/${id}`);
    }
    next();
}
module.exports.isReviewOwner = async(req,res,next)=>{
    const { id,reviewId } = req.params;
    const review = await Review.findById(reviewId);
   
    if(!review.owner.equals(req.user._id)){
        req.flash('error','You do not have permission to do that');
         return res.redirect(`/projects/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
