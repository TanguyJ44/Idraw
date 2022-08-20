import crypto from 'crypto';

import {
    dbConnection
} from './db.js';

import {
    mailTransporter
} from './mail.js';

// Create a new account
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
                            // define the mail content
                            const mailOptions = {
                                from: 'Idraw <noreply.idraw@gmail.com>',
                                to: email,
                                subject: 'Confirmation de votre compte - Idraw',
                                text: 'Bonjour ' + pseudo + ',\n\n' +
                                    'Merci de vous être inscrit sur Idraw.\n\n' +
                                    'Pour confirmer votre compte, veuillez cliquer sur le lien ci-dessous :\n\n' +
                                    'http://localhost:3000/auth/confirm?id=' + result.insertId + '\n\n' +
                                    'Cordialement,\n\n' +
                                    'L\'équipe Idraw',
                            };

                            // send the mail if possible
                            mailTransporter.sendMail(mailOptions);

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

// Login a user
export const loginUser = (body) => {
    const pseudo = body.pseudo;
    const password = crypto.createHash('sha256')
        .update(body.password).digest('base64');
    const sql = 'SELECT * FROM users WHERE pseudo = ?';

    return new Promise((resolve, reject) => {
        dbConnection.query(sql, [pseudo], (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    if (result[0].password === password) {
                        if (result[0].confirmed) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    } else {
                        resolve(false);
                    }
                } else {
                    resolve(false);
                }
            }
        });
    }).catch(err => {
        console.log(err);
    });
}

// Confirm email address
export const confirmEmail = (body) => {
    const sql = 'UPDATE users SET confirmed = 1 WHERE id = ?';
    return new Promise((resolve, reject) => {
        dbConnection.query(sql, [body.id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    }).catch(err => {
        console.log(err);
    });
}