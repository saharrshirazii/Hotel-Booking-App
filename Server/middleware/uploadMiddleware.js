import multer from "multer"; //Multer is a Node.js middleware package used with Express.js to handle multipart/form-data, which is the format used for uploading files. It processes incoming data, saves files to disk or memory, and adds file details to the request object.

const upload = multer({storage: multer.diskStorage({})});

export default upload;