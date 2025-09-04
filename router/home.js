const express = require('express');
const home = express.Router();

home.get('/home', (req, res) => {
    // User logged in → redirect to dashboard
    if (req.session.isAuth) {
        return res.redirect('/dashboard');
    }

    // User not logged in → show home page
    res.render('home', { title: "Home Page" });
});

module.exports = home;
