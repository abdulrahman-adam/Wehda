

import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/db.js';

const Category = sequelize.define('Category', {
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imagePublicId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bgColor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // The "Tree" part: Points to the ID of the parent category
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Categories',
            key: 'id'
        }
    }
}, {
    timestamps: true,
});

// Setup the Hierarchy (Self-association)
Category.hasMany(Category, { as: 'subcategories', foreignKey: 'parentId', onDelete: 'CASCADE' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' });

export default Category;