const DOMAIN = require("../config/DOMAIN");

const redirectRoot = (req, res) => {
  if (req.headers.accept?.includes('text/html')) {
    res.redirect(DOMAIN.original);
  } else {
    res.status(200).send('API root');
  }
}

module.exports = redirectRoot;