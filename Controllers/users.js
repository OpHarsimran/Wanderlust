const User = require('../Models/user')

module.exports.renderSignup = (req,res)=>{
    res.render('user/signup.ejs')
}

module.exports.signup = async (req,res)=>{
    try{
        const {username,email,password} = req.body;
        const newUser = new User({
            username,
            email
        })
        let result = await User.register(newUser,password);
        console.log(result);
        req.login(result,(err)=>{
            if(err) return next(err);
            req.flash('success','Welcome to Wanderlust!')
            res.redirect('/listings')
        })

    } catch(e){
        req.flash('error',e.message);
        res.redirect('/signup');


    }
}

module.exports.renderlogin = (req,res)=>{
    res.render('user/login.ejs')
}

module.exports.login = async (req,res)=>{
    req.flash('success','Welcome back to Wanderlust!')
    res.redirect(res.locals.urlRedirect);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','Logged out successfully!')
        res.redirect('/listings');
    });
}