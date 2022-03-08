
function index_get(req, res){
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  };
  
module.exports = {
    index_get,
}