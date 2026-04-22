
import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/db.js';
// import { sequelize } from '../config/db.js'; // Adjust this path to where your connection is

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
        
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('USER', 'ADMIN'), // Restricts values to only these two
        defaultValue: 'USER',
    },
    cartItems: {
        type: DataTypes.JSON, // Stores your object as a JSON string in MySQL
        defaultValue: {},
    }
}, {
    // Other model options
    timestamps: true, // Automatically adds createdAt and updatedAt
});

export default User;