import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
    return jwt.sign({ id: user._id, username: user.username }, process.env["ACCESS_SECRET"], { expiresIn: "15m" });
}

export function generateRefreshToken(user) {
    const token = jwt.sign({ id: user._id }, process.env["REFRESH_SECRET"], {
        expiresIn: "7d"
    });
    return {
        token,
        expires: new Date(Date.now() + 7*24*60*60*1000) // 7 days
    }
}
