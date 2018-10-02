
DROP TABLE IF EXISTS categories_event;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS entities;
DROP TABLE IF EXISTS users;

CREATE TABLE users (

    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE entities (

    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    initials TEXT NOT NULL UNIQUE,
    description TEXT,
    image_path TEXT,
    admin BOOLEAN NOT NULL
);


CREATE TABLE events (

    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    image_path TEXT,
    latitude REAL,
    longitude REAL,
    price REAL,

    entity_id INTEGER REFERENCES entities(id)
);


CREATE TABLE categories (

    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);



CREATE TABLE notifications (

    id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    description TEXT NOT NULL,
    seen BOOLEAN NOT NULL,
    
    event_id INTEGER REFERENCES events(id),
    user_id INTEGER REFERENCES users(id)
);


CREATE TABLE favorites (

    user_id INTEGER REFERENCES users(id),
    event_id INTEGER REFERENCES events(id)
    
);

ALTER TABLE ONLY favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (user_id, event_id);


CREATE TABLE categories_event (

    category_id INTEGER REFERENCES categories(id),
    event_id INTEGER REFERENCES events(id)
    
);

ALTER TABLE ONLY categories_event
    ADD CONSTRAINT categories_event_pkey PRIMARY KEY (category_id, event_id);