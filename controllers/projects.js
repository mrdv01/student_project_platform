const Projects = require('../models/projects');
const mongoose = require('mongoose');
const {cloudinary} = require('../cloudinary/index');
module.exports.index = async (req, res) => {
    const projects = await Projects.find({});
    res.render('projects/index', { projects });
}
module.exports.showAllProjects = async (req, res) => {
    const projects = await Projects.find({});
    res.render('projects/projects', { projects });
}

module.exports.renderNewform = (req, res) => {
    res.render('projects/new');
}

module.exports.createNewProject = async (req, res, next) => {
    const {path,filename} = req.file;
    const url = path;
    const project = new Projects(req.body.project);
    project.image = {url,filename};
    project.owner = req.user._id;
   
    await project.save();
    req.flash('success', 'Successfully Upload A Project');
    res.redirect(`/projects/${project._id}`);
}

module.exports.searchProject = async (req, res) => {
    const { query } = req.query;
    try {
        // Perform MongoDB search query with partial match using $regex
        const projects = await Projects.find({
            $or: [
                { title: { $regex: new RegExp(query, 'i') } }, // Partial match for title
                { description: { $regex: new RegExp(query, 'i') } } // Partial match for description
            ]
        });

        // Render search results page with found projects
        res.render('projects/search', { projects, query });
    } catch (err) {
        console.error('Error searching projects:', err);
        res.status(500).send('Error searching projects');
    }

}

module.exports.showProject = async (req, res) => {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid Project ID');
    }

    try {
        const project = await Projects.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'owner'
            }

        }).populate('owner');


        if (!project) {
            req.flash('error', 'project not found');
            return res.redirect('/projects');

        }
        res.render('projects/show', { project });
    } catch (e) {

    }
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const project = await Projects.findById(id);
    if (!project) {
        req.flash('error', 'project not found');
        return res.redirect('/projects');
    }

    res.render('projects/edit', { project });
}

module.exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const project = await Projects.findById(id);
    
    if (req.file) {
        const { path, filename } = req.file;
        const url = path;
        // await cloudinary.uploader.destroy(project.image.filename);
        project.image = { url, filename };

    }

    Object.assign(project, req.body.project);
    
   
   
    await project.save();
    
  
    req.flash('success', 'Successfully Updated Project');
    res.redirect(`/projects/${id}`);
}

module.exports.deleteProject = async (req, res) => {
    const { id } = req.params;

    await Projects.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted');
    res.redirect('/projects');
}