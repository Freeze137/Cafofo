import mysql from 'mysql2/promise'

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "admin", 
    database: "cafofo_adocao"
})

//Busca todos os registros de uma tabela
export async function list(collection) {
    let SQL = "SELECT * FROM ??";
    const [result] = await db.query(SQL, [collection]);
    return result;
}

//Busca apenas um registro pelo ID
export async function getById(collection, id) {
    let SQL = "SELECT * FROM ?? WHERE id = ?";
    const [result] = await db.query(SQL, [collection, id]);
    return result[0] ?? null;
}

//Insere um novo registro no banco
export async function create(collection, data) {
    let SQL = "INSERT INTO ?? SET ?";
    const [result] = await db.query(SQL, [collection, data]);
    return { id: result.insertId, ...data };
}

//Atualiza os dados do registro usando o ID
export async function update(collection, id, data) {
    let SQL = "UPDATE ?? SET ? WHERE id = ?";
    await db.query(SQL, [collection, data, id]);
    return { id, ...data };
}

//Apaga um registro pelo ID
export async function remove(collection, id) {
    let SQL = "DELETE FROM ?? WHERE id = ?";
    const [result] = await db.query(SQL, [collection, id]);
    return result.affectedRows > 0;
}