const { verify } = require("jsonwebtoken");

const verifyUser = async(req, res, next) => {
    try {
        const token = await req.header("token");
        if (token) {
            const validToken = verify(token, "secretkey");
            req.user = validToken;
            if (validToken) {
                return next();
            }

        } else {
            return res.json({ error: "error" });
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports = { verifyUser }