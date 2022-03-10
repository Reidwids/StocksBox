
// Middleware for user to check.
module.exports = (req, res, next) => {
    if(!req.user)
    {
        res.redirect("/auth/signIn")
    }
    else{
        next();
    }
}