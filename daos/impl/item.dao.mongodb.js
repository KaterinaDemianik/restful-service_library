const mongoose = require('mongoose');
const Item = require('../../models/item.model');

class ItemMongoDBDAO {

    //отримати всі ел
    static async findAll(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const items = await Item.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
                
            const total = await Item.countDocuments();
            const totalPages = Math.ceil(total / limit);
            
            return {
                items,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            console.error('Помилка при отриманні елементів:', error);
            throw error;
        }
    }

    //знайти ел за ID
    static async findById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return null;
            }
            return await Item.findById(id).lean();
        } catch (error) {
            console.error(`Помилка при пошуку елемента з ID ${id}:`, error);
            throw error;
        }
    }

    //cтворити новий ел
    static async create(itemData) {
        try {
            const item = new Item(itemData);
            await item.save();
            return item.toObject();
        } catch (error) {
            console.error('Помилка при створенні елемента:', error);
            throw error;
        }
    }

    //оновити ел
    static async update(id, updateData) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return null;
            }
            
            const updatedItem = await Item.findByIdAndUpdate(
                id,
                { ...updateData, updatedAt: new Date() },
                { new: true, runValidators: true }
            ).lean();
            
            return updatedItem;
        } catch (error) {
            console.error(`Помилка при оновленні елемента з ID ${id}:`, error);
            throw error;
        }
    }

    //видалити
    static async delete(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return false;
            }
            
            const result = await Item.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            console.error(`Помилка при видаленні елемента з ID ${id}:`, error);
            throw error;
        }
    }


    //знайти ел за типом
    static async findByType(type, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const query = { type: type.toLowerCase() };
            
            const [items, total] = await Promise.all([
                Item.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Item.countDocuments(query)
            ]);
            
            const totalPages = Math.ceil(total / limit);
            
            return {
                items,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            console.error(`Помилка при пошуку елементів за типом ${type}:`, error);
            throw error;
        }
    }

    //пошук по ключових словах
    static async search(query, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            
            const searchQuery = {
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { author: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { tags: { $in: [new RegExp(query, 'i')] } }
                ]
            };
            
            const [items, total] = await Promise.all([
                Item.find(searchQuery)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Item.countDocuments(searchQuery)
            ]);
            
            const totalPages = Math.ceil(total / limit);
            
            return {
                items,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            console.error(`Помилка при пошуку за запитом "${query}":`, error);
            throw error;
        }
    }

    //статистика
    static async getStats() {
        try {
            const stats = await Item.aggregate([
                {
                    $group: {
                        _id: '$type',
                        count: { $sum: 1 },
                        latest: { $max: '$createdAt' },
                        oldest: { $min: '$createdAt' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        type: '$_id',
                        count: 1,
                        latest: 1,
                        oldest: 1
                    }
                },
                { $sort: { count: -1 } }
            ]);
            
            const total = await Item.countDocuments();
            
            return {
                total,
                byType: stats,
                updatedAt: new Date()
            };
        } catch (error) {
            console.error('Помилка при отриманні статистики:', error);
            throw error;
        }
    }
}

module.exports = ItemMongoDBDAO;
