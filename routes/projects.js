const express = require('express');

const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const projectController = require('../controllers/projects');
const multer  = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage })

const { isLoggedIn, isOwner, validateProject } = require('../middleware');

router.route('/')
    .get( wrapAsync(projectController.showAllProjects))
    .post( isLoggedIn,upload.single('image'), validateProject, wrapAsync(projectController.createNewProject));
    

router.get('/new', isLoggedIn, projectController.renderNewform);


router.get('/search', wrapAsync(projectController.searchProject));

router.route('/:id')
    .get(wrapAsync(projectController.showProject))
    .put(isLoggedIn, isOwner,upload.single('image') ,validateProject, wrapAsync(projectController.updateProject))
    .delete( isLoggedIn, isOwner, wrapAsync(projectController.deleteProject))






router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(projectController.renderEditForm))


module.exports = router;
