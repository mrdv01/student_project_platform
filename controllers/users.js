const User = require('../models/user');



module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.createUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const RegisteredUser = await User.register(user, password);
        req.login(RegisteredUser, err => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to AcadmiaSwap');
            res.redirect('/projects');
        })

    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/register');
    }


}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome to AcadmiaSwap');
    const redirectUrl = res.locals.returnTo || '/projects'
    res.redirect(redirectUrl);
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.logoutUser = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully Logout');
        res.redirect('/projects')
    })

}