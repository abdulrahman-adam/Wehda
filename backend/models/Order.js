// import { DataTypes } from 'sequelize';
// import { sequelize } from '../configs/db.js';
// import Products from './Products.js'; 

// const Order = sequelize.define('Order', {
//     // 1. UNIQUE ORDER NUMBER (Pro standard)
//     orderNumber: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//         defaultValue: () => `ORD-${Math.floor(100000 + Math.random() * 900000)}`
//     },
//     userId: {
//         type: DataTypes.STRING, 
//         allowNull: false
//     },
//     items: {
//         type: DataTypes.JSON,
//         allowNull: false,
//         get() {
//             const value = this.getDataValue('items');
//             return typeof value === 'string' ? JSON.parse(value) : value;
//         }
//     },
//     // 2. FINANCIAL PRECISION
//     subtotal: {
//         type: DataTypes.FLOAT,
//         allowNull: false,
//         defaultValue: 0
//     },
//     shippingFee: {
//         type: DataTypes.FLOAT,
//         allowNull: false,
//         defaultValue: 0
//     },
//     amount: { // Total Amount
//         type: DataTypes.FLOAT,
//         allowNull: false
//     },
//     address: {
//         type: DataTypes.JSON,
//         allowNull: false,
//         // ADD THIS GETTER METHOD
//         get() {
//             const value = this.getDataValue('address');
//             if (!value) return null;
//             return typeof value === 'string' ? JSON.parse(value) : value;
//         }
//     },
//     // 3. ENUM STATUSES (Prevents spelling errors)
//     status: {
//         type: DataTypes.ENUM('Pending', 'Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
//         defaultValue: 'Order Placed'
//     },
//     paymentType: {
//         type: DataTypes.ENUM('COD', 'Stripe'),
//         allowNull: false
//     },
//     isPaid: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false
//     },
//     paymentId: {
//         type: DataTypes.STRING,
//         defaultValue: ""
//     },
//     // 4. DELIVERY TRACKING
//     trackingNumber: {
//         type: DataTypes.STRING,
//         allowNull: true
//     }
// }, {
//     timestamps: true,

//     getterMethods: {
//         totalItemsCount() {
//             return this.items.reduce((acc, item) => acc + item.quantity, 0);
//         }
//     }
// });

// export default Order;

import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/db.js';
import Products from './Products.js';

const Order = sequelize.define('Order', {
  // 1. UNIQUE ORDER NUMBER
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: () => `ORD-${Math.floor(100000 + Math.random() * 900000)}`
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false,
    get() {
      const value = this.getDataValue('items');
      if (!value) return [];
      return typeof value === 'string' ? JSON.parse(value) : value;
    }
  },
  // 2. FINANCIAL PRECISION
  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  shippingFee: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  amount: { 
    type: DataTypes.FLOAT,
    allowNull: false
  },
  address: {
    type: DataTypes.JSON,
    allowNull: false,
    get() {
      const value = this.getDataValue('address');
      if (!value) return null;
      return typeof value === 'string' ? JSON.parse(value) : value;
    }
  },
  // 3. ENUM STATUSES
  status: {
    type: DataTypes.ENUM('Pending', 'Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
    defaultValue: 'Order Placed'
  },
  paymentType: {
    type: DataTypes.ENUM('COD', 'Stripe'),
    allowNull: false
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paymentId: {
    type: DataTypes.STRING,
    defaultValue: ""
  },
  // 4. DELIVERY TRACKING
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  getterMethods: {
    totalItemsCount() {
      // Defensive check to prevent "Cannot read properties of undefined (reading 'reduce')"
      const items = this.items;
      return Array.isArray(items) 
        ? items.reduce((acc, item) => acc + (item.quantity || 0), 0) 
        : 0;
    }
  }
});

export default Order;