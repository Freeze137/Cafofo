import mysql from 'mysql2/promise'

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "admin", 
    database: "cafofo_adocao"
})

export async function list(collection) {
    let SQL = "SELECT * FROM ??";
    const [result] = await db.query(SQL, [collection]);
    return result;
}

export async function getById(collection, id) {
    let SQL = "SELECT * FROM ?? WHERE id = ?";
    const [result] = await db.query(SQL, [collection, id]);
    return result[0] ?? null;
}

export async function create(collection, data) {
    let SQL = "INSERT INTO ?? SET ?";
    const [result] = await db.query(SQL, [collection, data]);
    return { id: result.insertId, ...data };
}

export async function update(collection, id, data) {
    let SQL = "UPDATE ?? SET ? WHERE id = ?";
    await db.query(SQL, [collection, data, id]);
    return { id, ...data };
}

export async function remove(collection, id) {
    let SQL = "DELETE FROM ?? WHERE id = ?";
    const [result] = await db.query(SQL, [collection, id]);
    return result.affectedRows > 0;
}