"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const main_1 = __importDefault(require("./routes/main"));
const path = require("path");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression = require("compression");
const helmet_1 = __importDefault(require("helmet"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const mongoDB = process.env.MONGODB_URI;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
if (!mongoDB) {
    throw new Error('MONGODB_URI environment variable is not defined');
}
app.use(compression());
app.use(express_1.default.static(path.join(__dirname, 'views')));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(helmet_1.default.contentSecurityPolicy({
    directives: {
        "script-src": ["'self' 'unsafe-inline'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
}));
mongoose_1.default.connect(mongoDB)
    .then(() => {
    console.log('MongoDB connected');
})
    .catch((err) => {
    console.log('Connection Error:', err);
});
app.use('/', main_1.default);
app.listen(port, () => {
    console.log('server is running at', port);
});
