"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.images = void 0;
const multer_1 = __importDefault(require("multer"));
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});
const images = (req, res, next) => {
    const upload = (0, multer_1.default)({ storage: imageStorage }).array('images', 10);
    upload(req, res, function (err) {
        if (err instanceof multer_1.default.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(500).json({ error: 'Multer error occurred', message: err.message });
        }
        else if (err) {
            // An unknown error occurred when uploading.
            return res.status(500).json({ error: 'An unknown error occurred', message: err.message });
        }
        // Everything went fine.
        next();
    });
};
exports.images = images;
//# sourceMappingURL=imageStorage.js.map