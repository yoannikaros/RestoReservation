// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/resto/categoryController');

router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post('/categories', categoryController.createCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);
router.get('/categories/profile/:profile_id', categoryController.getCategoriesByProfileId);

module.exports = router;
