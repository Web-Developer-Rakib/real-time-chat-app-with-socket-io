"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllfriends = exports.getSingleUser = exports.logout = exports.login = exports.register = void 0;
const __1 = require("../..");
const user_model_1 = __importDefault(require("./user.model"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const existingUser = yield user_model_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already in use" });
        }
        const newUser = new user_model_1.default({ username, password });
        yield newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield user_model_1.default.findOneAndUpdate({ username, password }, { status: "Online" });
        if (user) {
            const usersInfo = {
                username: user.username,
                id: user._id,
                status: "Online",
            };
            __1.io.emit("status", usersInfo);
            res.status(200).json({ message: "Login successful", usersInfo });
        }
        else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        const user = yield user_model_1.default.findOneAndUpdate({ username }, { status: "Offline" });
        if (user) {
            const usersInfo = {
                id: user._id,
                status: "Offline",
            };
            __1.io.emit("status", usersInfo);
            res.status(200).json({ message: "Logout successful", usersInfo });
        }
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.logout = logout;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        const user = yield user_model_1.default.findOne({ username });
        if (!user) {
            res.sendStatus(404);
        }
        res.status(200).json({ user });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getSingleUser = getSingleUser;
const getAllfriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInUser = req.query.username;
        const allUsers = yield user_model_1.default.find({
            username: { $ne: loggedInUser },
        }).select("-password");
        res.status(200).json(allUsers);
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllfriends = getAllfriends;
