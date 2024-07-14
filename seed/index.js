const mongoose = require('mongoose');
const Projects = require("../models/projects");
const projects_data = require('./project');

mongoose.connect('mongodb://localhost:27017/student-project-platform').
then(() => {
    console.log('connection established successfully')
})
.catch((err) => {
    console.log("error in connection", err);
})


const seedDB = async()=>{
    await Projects.deleteMany({});
    for(let proj of projects_data){
        const project = new Projects(proj);
        project.owner = '66926eccc40419da2e7daf33';
        await project.save();
        
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});