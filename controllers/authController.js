import User from "../models/User.js";
import Token from "../models/Token.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/token.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    console.log(req.body);


    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.json({ message: "User registered" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // ذخیره refreshToken در DB
    await new Token({ userId: user._id, token: refreshToken }).save();

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    res.json({ accessToken });
};

export const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(403);

    const stored = await Token.findOne({ token: refreshToken });
    if (!stored) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env["REFRESH_SECRET "], (err, user) => {
        if (err) return res.sendStatus(403);

        const newAccessToken = generateAccessToken({ _id: user.id, username: user.username });
        res.json({ accessToken: newAccessToken });
    });
};

export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    await Token.findOneAndDelete({ token: refreshToken });
    res.clearCookie("refreshToken");
    res.sendStatus(204);
};
