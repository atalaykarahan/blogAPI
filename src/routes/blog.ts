import express from "express";
import * as BlogController from "../controller/blog";
import {requiresAuth} from "../middleware/auth";
import multer from "multer";
import * as path from "node:path";
import {v4 as uuidv4} from 'uuid';

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads/'));
    },
    filename: async function (req, file, cb) {
        try {
            const fileUUID = uuidv4(); // UUID oluştur
            const fileExtension = path.extname(file.originalname); // Dosyanın uzantısını al
            const newFilename = `${fileUUID}${fileExtension}`; // UUID'yi dosya adı olarak kullan
            req.fileUUID = fileUUID;
            // Burada UUID ve dosya adını veritabanınıza kaydedin
            // await database.saveFileRecord({ uuid: fileUUID, filename: newFilename });

            cb(null, newFilename); // Yeni dosya adını belirle
        } catch (error: any) {
            cb(error, '');
        }
    }
});

const upload = multer({storage: storage, limits: {fileSize: 1024 * 1024}});


//create
router.post('/', requiresAuth, BlogController.createBlog)

// get by id
router.get('/blog/:id', BlogController.getBlogById)

//update
router.put("/", requiresAuth, BlogController.updateBlog);

//delete
router.delete('/blog/:id', requiresAuth, BlogController.deleteFullBlog);

// get all
router.get('/', requiresAuth, BlogController.getAll);


// get all published
router.get('/homepage', BlogController.getHomepageBlogs);

// get all by status
router.get('/status/:status_id', requiresAuth, BlogController.getAllByStatus);

// upload file & photo
router.post('/file', requiresAuth, upload.single("file"), BlogController.insertFile)

// get by slug
router.get('/slug/:slug', BlogController.getBlogBySlug)


export default router;