
import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/db.js';


const Address = sequelize.define('Address', {
    // In SQL, we usually use 'id' as the primary key (auto-generated)
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true, // Optional: built-in Sequelize validation
        }
    },
    street: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    zipcode: {
        type: DataTypes.INTEGER, // Number in Mongoose becomes INTEGER in SQL
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    // This adds createdAt and updatedAt columns, matching Mongoose's { timestamps: true }
    timestamps: true, 
    tableName: 'addresses' // Explicitly naming the table in MySQL
});

export default Address;