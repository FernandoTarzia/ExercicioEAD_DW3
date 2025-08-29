const GetAllSalasDeAula = async (req, res) => {
  const pool = req.pool; // Acessa o pool de conexões injetado em app.js
  try {
    const result = await pool.query("SELECT * FROM salasdeaula WHERE removido = false");
    return res.status(200).json(result.rows); // Retorna os dados como JSON
  } catch (error) {
    console.error("Erro ao buscar todas as salas de aula:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const GetSalasDeAulaByID = async (req, res) => {
  const pool = req.pool;
  const { id } = req.params;
  try {
    // Usando query parametrizada para segurança
    const result = await pool.query("SELECT * FROM salasdeaula WHERE salasdeaulaid = $1 AND removido = false", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Sala de aula não encontrada." });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Erro ao buscar sala de aula com ID ${id}:`, error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const InsertSalasDeAula = async (req, res) => {
  const pool = req.pool;
  const { descricao, localizacao, capacidade } = req.body; // 'removido' deve ter um valor padrão no banco ou ser passado
  try {
    // Validar entradas básicas
    if (!descricao || !localizacao || capacidade === undefined) {
      return res.status(400).json({ message: "Dados incompletos para inserir sala de aula." });
    }
    // 'removido' será false por padrão, conforme definido no init.sql
    const sql = `INSERT INTO salasdeaula (descricao, localizacao, capacidade)
                 VALUES ($1, $2, $3) RETURNING *`; // RETURNING * retorna o registro inserido
    const result = await pool.query(sql, [descricao, localizacao, capacidade]);
    return res.status(201).json(result.rows[0]); // Retorna o novo registro
  } catch (error) {
    console.error("Erro ao inserir sala de aula:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const UpdateSalasDeAula = async (req, res) => {
  const pool = req.pool;
  const { id } = req.params;
  const { descricao, localizacao, capacidade, removido } = req.body; // 'removido' agora pode ser atualizado
  try {
    // Validar entradas básicas
    if (!descricao || !localizacao || capacidade === undefined || removido === undefined) {
      return res.status(400).json({ message: "Dados incompletos para atualizar sala de aula." });
    }
    const sql = `UPDATE salasdeaula
                 SET descricao = $1, localizacao = $2,
                     capacidade = $3, removido = $4
                 WHERE salasdeaulaid = $5 RETURNING *`; // Retorna o registro atualizado
    const result = await pool.query(sql, [descricao, localizacao, capacidade, removido, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Sala de aula não encontrada para atualização." });
    }
    return res.status(200).json(result.rows[0]); // Retorna o registro atualizado
  } catch (error) {
    console.error(`Erro ao atualizar sala de aula com ID ${id}:`, error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const DeleteSalasDeAula = async (req, res) => {
  const pool = req.pool;
  const { id } = req.params;
  try {
    // Realiza um soft delete, marcando 'removido' como true
    const result = await pool.query(`UPDATE salasdeaula SET removido = true WHERE salasdeaulaid = $1 RETURNING *`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Sala de aula não encontrada para exclusão." });
    }
    return res.status(200).json({ message: "Sala de aula removida (soft delete) com sucesso!", sala_removida: result.rows[0] });
  } catch (error) {
    console.error(`Erro ao deletar sala de aula com ID ${id}:`, error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

module.exports = {
  GetAllSalasDeAula,
  GetSalasDeAulaByID,
  InsertSalasDeAula,
  UpdateSalasDeAula,
  DeleteSalasDeAula,
};
