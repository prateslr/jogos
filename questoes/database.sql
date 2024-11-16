CREATE DATABASE jogo_alfabeto;

USE jogo_alfabeto;

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    answer VARCHAR(50) NOT NULL,
    level INT NOT NULL
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    xp INT DEFAULT 0,
    level INT DEFAULT 1
);

CREATE TABLE answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    question_id INT,
    is_correct BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

INSERT INTO categories (name) VALUES ('Formas'), ('Animais'), ('Cores'), ('Capitais'), ('ALfabeto');

INSERT INTO questions (question, answer, category_id, level) VALUES
('Qual é a primeira letra do alfabeto?', 'a', 1, 1),
('Qual letra vem após a letra B?', 'c', 2, 1),
('Qual letra é a última do alfabeto?', 'z', 3, 2);
('Qual letra é uma vogal?', 'vogais', 4, 2);