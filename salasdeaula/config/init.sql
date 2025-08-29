CREATE TABLE IF NOT EXISTS salasdeaula (
    salasdeaulaid SERIAL,
    descricao VARCHAR(255) NOT NULL,
    localizacao VARCHAR(255) NOT NULL,
    capacidade INTEGER NOT NULL,
    removido BOOLEAN DEFAULT FALSE,
    CONSTRAINT pk_salasdeaula PRIMARY KEY (salasdeaulaid)    
);
INSERT INTO salasdeaula (descricao, localizacao, capacidade) VALUES
('Sala 108', 'Bloco A', 36),
('Laboratório de Informática', 'Bloco B', 20);