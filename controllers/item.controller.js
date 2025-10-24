const ItemDAO = require('../daos/impl/item.dao.mongodb');
const { validationResult } = require('express-validator');


class ItemController {
    
    //отримати всі ел
    static async getAllItems(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await ItemDAO.findAll(page, limit);
            
            res.json({
                success: true,
                data: result.items,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    //знайти ел за ID
    static async getItemById(req, res, next) {
        try {
            const item = await ItemDAO.findById(req.params.id);
    
            if (!item) {
                return res.status(404).json({
                    success: false,
                    error: 'елемент не знайдено'
                });
            }
            res.json({
                success: true,
                data: item
            });
        } catch (error) {
            next(error);
        }
    }

    //cтворити новий ел
    static async createItem(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }
            const newItem = await ItemDAO.create(req.body);
            res.status(201).json({
                success: true,
                data: newItem
            });
        } catch (error) {
            next(error);
        }
    }

    //оновити ел
    static async updateItem(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }
            const updatedItem = await ItemDAO.update(req.params.id, req.body);
            
            if (!updatedItem) {
                return res.status(404).json({
                    success: false,
                    error: 'елемент не знайдено'
                });
            }
            res.json({
                success: true,
                data: updatedItem
            });
        } catch (error) {
            next(error);
        }
    }

    //видалити
    static async deleteItem(req, res, next) {
        try {
            const deleted = await ItemDAO.delete(req.params.id);
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    error: 'елемент не знайдено'
                });
            }
            res.json({
                success: true,
                message: 'елемент видалено'
            });
        } catch (error) {
            next(error);
        }
    }

    //знайти ел за типом
    static async getItemsByType(req, res, next) {
        try {
            const { type } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await ItemDAO.findByType(type, page, limit);
            
            res.json({
                success: true,
                data: result.items,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    //пошук по ключових словах
    static async searchItems(req, res, next) {
        try {
            const { q } = req.query;
            
            if (!q || q.trim() === '') {
                return res.status(400).json({
                    success: false,
                    error: 'пошуковий запит не може бути порожній'
                });
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await ItemDAO.search(q, page, limit);
            
            res.json({
                success: true,
                data: result.items,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    //статистика
    static async getStats(req, res, next) {
        try {
            const stats = await ItemDAO.getStats();
            
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ItemController;
