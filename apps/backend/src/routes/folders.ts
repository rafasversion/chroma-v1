import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { createFolder } from '../controllers/folders/createFolder';
import { getFolders } from '../controllers/folders/getFolders';
import { getFolder } from '../controllers/folders/getFolder';
import { getFoldersByUsername } from '../controllers/folders/getFoldersByUsername';
import { updateFolder } from '../controllers/folders/updateFolder';
import { deleteFolder } from '../controllers/folders/deleteFolder';
import { addPhotoToFolder } from '../controllers/folders/addPhotoToFolder';
import { removePhotoFromFolder } from '../controllers/folders/removePhotoFromFolder';
import { validate, createFolderSchema } from '../middleware/validation';
import { upload } from '../utils/upload';

const router = Router();

router.post('/folder', verifyToken, upload.single('cover'), validate(createFolderSchema), createFolder);
router.get('/folder', verifyToken, getFolders);
router.get('/folder/:id', getFolder);
router.get('/users/:username/folders', getFoldersByUsername);
router.put('/folder/:id', verifyToken, upload.single('cover'), updateFolder);
router.delete('/folder/:id', verifyToken, deleteFolder);
router.post('/folder/add-post', verifyToken, addPhotoToFolder);
router.post('/folder/remove-post', verifyToken, removePhotoFromFolder);

export default router;