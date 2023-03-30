const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const adminUsername = 'admin';
        const adminPassword = '#Admin123';
        if (username !== adminUsername && password !== adminPassword) throw { custom: true, status: 401, loggedIn: false, error: { message: "Incorrect credentials" } };
        res.status(200).json({ status: 200, loggedIn: true, username: adminUsername });
    } catch (err) {
        "custom" in err ? res.status(err.status).json(err) : res.status(500).json({ status: 500, message: err.message, error: [...err] });
    }
};

module.exports = {
    login
};