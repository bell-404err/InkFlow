// backend/src/modules/category/categoryController.js
import { getAllCategories as fetchCategories } from './categoryService.js';

class CategoryController {
    async getAll(req, res) {
        try {
            const categories = await fetchCategories();
            res.json(categories);
        } catch (err) {
            console.error('Error fetching categories:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new CategoryController();
