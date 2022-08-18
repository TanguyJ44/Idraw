import {
    dbConnection
} from './db.js';

import crypto from 'crypto';

export const createNewAccount = (body) => {
    const pseudo = body.pseudo;
    const email = body.email;
    const password = crypto.createHash('sha256')
        .update(body.password).digest('base64');
    const sql = 'SELECT * FROM users WHERE pseudo = ?';

    return new Promise((resolve, reject) => {
        dbConnection.query(sql, [pseudo], (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve(false);
                } else {
                    const sql = 'INSERT INTO users (pseudo, email, password) VALUES (?, ?, ?)';
                    dbConnection.query(sql, [pseudo, email, password], (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            // TODO: send email
                            resolve(true);
                        }
                    });
                }
            }
        });
    }).catch(err => {
        console.log(err);
    });
}