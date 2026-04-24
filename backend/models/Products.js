

import { DataTypes } from 'sequelize';
import { sequelize } from "../configs/db.js";
import Category from './Category.js';

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.JSON, 
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    offerPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    variants: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Sizes or weights as a JSON array"
    },
    colors: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Colors as a JSON array"
    },
    image: {
        type: DataTypes.JSON,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('image');
            if (typeof rawValue === 'string') {
                try { return JSON.parse(rawValue); } 
                catch (e) { return []; }
            }
            return rawValue || [];
        }
    },
    inStock: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    availability: { // Fixed spelling from "availablity"
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    // Linking Product to Category ID for the Hierarchy
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'id'
        }
    }
}, {
    timestamps: true 
});

// Establish relationship
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'categoryData',onDelete: 'CASCADE'});
Category.hasMany(Product, { foreignKey: 'categoryId',onDelete: 'CASCADE'});

export default Product;