const pool = require('../../db');

const Cart = {
    getAll: async () => {
        const query = `
            SELECT c.*, i.title, i.description, i.base_price, i.category, i.photo, i.stock 
            FROM resto_cart c 
            JOIN resto_item i ON c.id_resto_item = i.id_resto_item;
        `;
        const [rows] = await pool.query(query);
        return rows;
    },

    getById: async (id) => {
        const query = `
            SELECT c.*, i.title, i.description, i.base_price, i.category, i.photo, i.stock 
            FROM resto_cart c 
            JOIN resto_item i ON c.id_resto_item = i.id_resto_item 
            WHERE c.id_cart_resto = ?;
        `;
        const [rows] = await pool.query(query, [id]);
        return rows;
    },

    create: async (data) => {
        const query = 'INSERT INTO resto_cart SET ?';
        const [result] = await pool.query(query, data);
        return result;
    },

    update: async (id, data) => {
        const query = 'UPDATE resto_cart SET ? WHERE id_cart_resto = ?';
        const [result] = await pool.query(query, [data, id]);
        return result;
    },

    delete: async (id) => {
        const query = 'DELETE FROM resto_cart WHERE id_cart_resto = ?';
        const [result] = await pool.query(query, [id]);
        return result;
    }
};

module.exports = Cart;
