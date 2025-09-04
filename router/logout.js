const express = require('express');
const logout = express.Router();

// 1️⃣ Show confirmation page
logout.get('/logout', (req, res) => {
    if (!req.session.isAuth) {
        return res.redirect("/login");
    }
    res.render('logout', { title: "Logout" });
});

// 2️⃣ Handle logout action
logout.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).send('Server error');
        }
        res.redirect('/login');
    });
});

module.exports = logout;
