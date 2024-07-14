const mongoose = require('mongoose');
const Review = require('./review');
const { ref } = require('joi');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url:String,
    filename:String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const ProjectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    
    technologies: [{
        type: String,
        required: true
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    
    files:[
        {
            type:String,
            required:true
        }
    ],
    image:imageSchema,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

ProjectSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports =  mongoose.model('Project',ProjectSchema);