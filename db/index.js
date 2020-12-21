"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.group = exports.user = void 0;
var factory_1 = __importDefault(require("./factory"));
exports.user = factory_1.default("user");
exports.group = factory_1.default("group");
