const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const ItemController = require('../controllers/item.controller');


const itemValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('назва є обов\'язковою')
        .isLength({ max: 200 }).withMessage('назва не може бути довшою за 200 символів'),
    body('author')
        .trim()
        .notEmpty().withMessage('автор є обов\'язковим'),
    body('type')
        .isIn(['book', 'article', 'journal', 'other']).withMessage('невірний тип елемента'),
    body('year')
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage(`рік має бути між 1000 та ${new Date().getFullYear()}`),
    body('description')
        .optional()
        .isLength({ max: 2000 }).withMessage('опис не може перевищувати 2000 символів'),
    body('tags')
        .optional()
        .isArray().withMessage('теги мають бути масивом')
];

//отримати всі ел
router.get(
    '/',
    [
        query('page')
            .optional()
            .isInt({ min: 1 }).withMessage('номер сторінки має бути цілим числом більше 0')
            .toInt(),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 }).withMessage('ліміт має бути між 1 та 100')
            .toInt()
    ],
    ItemController.getAllItems
);

//пошук ел 
router.get(
    '/search',
    [
        query('q')
            .notEmpty().withMessage('пошуковий запит є обов\'язковим')
            .isLength({ min: 2 }).withMessage('пошуковий запит має містити принаймні 2 символи'),
        query('page')
            .optional()
            .isInt({ min: 1 }).withMessage('номер сторінки має бути цілим числом більше 0')
            .toInt(),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 }).withMessage('ліміт має бути між 1 та 100')
            .toInt()
    ],
    ItemController.searchItems
);

//статистика
router.get(
    '/stats',
    ItemController.getStats
);

//отримати ел за типом
router.get(
    '/type/:type',
    [
        param('type')
            .isIn(['book', 'article', 'journal', 'other'])
            .withMessage('невірний тип елемента'),
        query('page')
            .optional()
            .isInt({ min: 1 }).withMessage('номер сторінки має бути цілим числом більше 0')
            .toInt(),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 }).withMessage('ліміт має бути між 1 та 100')
            .toInt()
    ],
    ItemController.getItemsByType
);

//отримати ел за ID 
router.get(
    '/:id',
    [
        param('id')
            .notEmpty().withMessage('ID є обов\'язковим')
            .isMongoId().withMessage('невірний формат ID')
    ],
    ItemController.getItemById
);

//створити новий ел
router.post(
    '/',
    itemValidation,
    ItemController.createItem
);

//оновити
router.put(
    '/:id',
    [
        param('id')
            .notEmpty().withMessage('ID є обов\'язковим')
            .isMongoId().withMessage('невірний формат ID'),
        ...itemValidation
    ],
    ItemController.updateItem
);

//часткове оновлення
router.patch(
    '/:id',
    [
        param('id')
            .notEmpty().withMessage('ID є обов\'язковим')
            .isMongoId().withMessage('невірний формат ID'),
        body('title')
            .optional()
            .trim()
            .notEmpty().withMessage('назва є обов\'язковою')
            .isLength({ max: 200 }).withMessage('назва не може бути довшою за 200 символів'),
        body('author')
            .optional()
            .trim()
            .notEmpty().withMessage('автор є обов\'язковим'),
        body('type')
            .optional()
            .isIn(['book', 'article', 'journal', 'other']).withMessage('невірний тип елемента'),
        body('year')
            .optional()
            .isInt({ min: 1000, max: new Date().getFullYear() })
            .withMessage(`рік має бути між 1000 та ${new Date().getFullYear()}`),
        body('description')
            .optional()
            .isLength({ max: 2000 }).withMessage('опис не може перевищувати 2000 символів'),
        body('tags')
            .optional()
            .isArray().withMessage('теги мають бути масивом'),
        body('isAvailable')
            .optional()
            .isBoolean().withMessage('isAvailable має бути булевим значенням')
            .toBoolean()
    ],
    ItemController.partialUpdateItem
);

//видалити
router.delete(
    '/:id',
    [
        param('id')
            .notEmpty().withMessage('ID є обов\'язковим')
            .isMongoId().withMessage('невірний формат ID')
    ],
    ItemController.deleteItem
);

//borrow ел
router.post(
    '/:id/borrow',
    [
        param('id')
            .notEmpty().withMessage('ID є обов\'язковим')
            .isMongoId().withMessage('невірний формат ID')
    ],
    ItemController.borrowItem
);

//return ел
router.post(
    '/:id/return',
    [
        param('id')
            .notEmpty().withMessage('ID є обов\'язковим')
            .isMongoId().withMessage('невірний формат ID')
    ],
    ItemController.returnItem
);

//рекомендації за тегами
router.get(
    '/:id/recommendations',
    [
        param('id')
            .notEmpty().withMessage('ID є обов\'язковим')
            .isMongoId().withMessage('невірний формат ID'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 50 }).withMessage('limit має бути між 1 та 50')
            .toInt()
    ],
    ItemController.recommendItems
);


module.exports = router;
