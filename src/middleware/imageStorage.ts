import multer from 'multer';
const imageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

export const images = (req:any, res:any, next:any) => {
    const upload = multer({ storage: imageStorage }).array('images', 10);
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(500).json({ error: 'Multer error occurred', message: err.message });
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(500).json({ error: 'An unknown error occurred', message: err.message });
        }
        // Everything went fine.
        next();
    });
};