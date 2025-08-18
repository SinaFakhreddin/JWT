import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
    return jwt.sign({ id: user._id, username: user.username }, process.env["ACCESS_SECRET "], { expiresIn: "15m" });
}

export function generateRefreshToken(user) {
    return jwt.sign({ id: user._id }, process.env["REFRESH_SECRET "], { expiresIn: "7d" });
}
