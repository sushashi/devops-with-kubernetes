CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    todo TEXT,
    done BOOLEAN DEFAULT false,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO todos (todo) VALUES ('Get to work!'), ('Implement the backend!');