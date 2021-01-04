"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var db = __importStar(require("./db"));
var express_1 = __importDefault(require("express"));
var fs_1 = __importDefault(require("fs"));
var https_1 = __importDefault(require("https"));
var app = express_1.default();
app.use(express_1.default.json()); // for parsing application/json
app.use(express_1.default.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    console.log(req.method, req.path, "At time:", new Date().toLocaleString());
    next();
});
function usernameModifier(username) {
    return function (_) {
        return username + "_" + _;
    };
}
var unm = usernameModifier;
function handle(p, res, message) {
    if (message === void 0) { message = ""; }
    p.then(function (_) {
        // console.log(_);
        res.send({ message: "OK", data: _ });
    }).catch(function (err) {
        console.log(err);
        res.status(500).send({ message: message });
    });
}
var privateKey = fs_1.default.readFileSync("/root/.acme.sh/wxxfj.xyz/wxxfj.xyz.key", "utf8");
var certificate = fs_1.default.readFileSync("/root/.acme.sh/wxxfj.xyz/wxxfj.xyz.cer", "utf8");
var credentials = { key: privateKey, cert: certificate };
var port = 3000;
var httpsServer = https_1.default.createServer(credentials, app);
httpsServer.listen(port);
function checkIfUserExist(username, res) {
    return __awaiter(this, void 0, void 0, function () {
        var users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof username === "undefined")
                        return [2 /*return*/, false];
                    return [4 /*yield*/, db.user.find({ username: username })];
                case 1:
                    users = _a.sent();
                    if (users.length > 0) {
                        return [2 /*return*/, true];
                    }
                    else {
                        res.status(401).send({ message: "Can't find related user" });
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
app.post("/user", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, length;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                return [4 /*yield*/, db.user.find({ username: username })];
            case 1:
                length = (_b.sent()).length;
                if (length) {
                    res.status(409).send({ message: "The username is already in use" });
                }
                else {
                    db.user
                        .create({
                        username: username,
                        password: password,
                        filePath: String(Math.random()).slice(2),
                    })
                        .then(function () {
                        res.send({ message: "User created successfully" });
                    });
                }
                return [2 /*return*/];
        }
    });
}); });
app.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, users;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                return [4 /*yield*/, db.user.find({ username: username })];
            case 1:
                users = _b.sent();
                if (users.length) {
                    if (users[0].password === password) {
                        res.sendStatus(200);
                    }
                    else {
                        res.status(403).send({ message: "Wrong password" });
                    }
                }
                else {
                    res.status(403).send({ message: "The user was not found" });
                }
                return [2 /*return*/];
        }
    });
}); });
// 分组
app.get("/group", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, group;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.header("username");
                group = req.body;
                return [4 /*yield*/, checkIfUserExist(username, res)];
            case 1:
                if (_a.sent()) {
                    handle(db.group.find(group, unm(username)), res, "Failed to find group");
                }
                return [2 /*return*/];
        }
    });
}); });
app.post("/group", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, group;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.header("username");
                group = req.body;
                return [4 /*yield*/, checkIfUserExist(username, res)];
            case 1:
                if (_a.sent()) {
                    handle(db.group.create(group, unm(username)), res, "Failed to create group");
                }
                return [2 /*return*/];
        }
    });
}); });
app.put("/group/:groupID", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, groupID, group;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.header("username");
                groupID = req.params.groupID;
                group = req.body;
                return [4 /*yield*/, checkIfUserExist(username, res)];
            case 1:
                if (_a.sent()) {
                    handle(db.group.modify({
                        uuid: groupID,
                    }, group, unm(username)), res, "Failed to create group");
                }
                return [2 /*return*/];
        }
    });
}); });
app.delete("/group/:groupID", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, groupID;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.header("username");
                groupID = req.params.groupID;
                return [4 /*yield*/, checkIfUserExist(username, res)];
            case 1:
                if (_a.sent()) {
                    handle(db.group.remove({ uuid: groupID }, unm(username)).then(function (_) {
                        return db.groupTime.remove({ groupID: groupID }, unm(username));
                    }), res, "Failed to remove group");
                }
                return [2 /*return*/];
        }
    });
}); });
// 记录
app.get("/group/:groupID/time", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, groupID;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.header("username");
                groupID = req.params.groupID;
                return [4 /*yield*/, checkIfUserExist(username, res)];
            case 1:
                // const time = req.body;
                if (_a.sent()) {
                    handle(db.groupTime.find({ groupID: groupID }, unm(username)), res, "Failed to find group time");
                }
                return [2 /*return*/];
        }
    });
}); });
app.post("/group/:groupID/time", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, groupID, time;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.header("username");
                groupID = req.params.groupID;
                time = req.body;
                return [4 /*yield*/, checkIfUserExist(username, res)];
            case 1:
                if (_a.sent()) {
                    handle(db.groupTime.create(__assign(__assign({}, time), { groupID: groupID }), unm(username)), res, "Failed to create group time");
                }
                return [2 /*return*/];
        }
    });
}); });
app.delete("/group/time/:timeID", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, timeID;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.header("username");
                timeID = req.params.timeID;
                return [4 /*yield*/, checkIfUserExist(username, res)];
            case 1:
                // const time = req.body;
                if (_a.sent()) {
                    handle(db.groupTime.remove({ _id: timeID }, unm(username)), res, "Failed to remove group time");
                }
                return [2 /*return*/];
        }
    });
}); });
