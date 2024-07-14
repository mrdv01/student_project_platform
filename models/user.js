const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    
    email: { type: String, unique: true, required: true },
    
   
    
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    skills: [String],
    contactInfo: {
      phone: String,
      linkedin: String,
    }
    
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);