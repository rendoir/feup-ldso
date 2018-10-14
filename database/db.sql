DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (

    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

DROP TABLE IF EXISTS entities CASCADE;
CREATE TABLE entities (

    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    initials TEXT NOT NULL UNIQUE,
    description TEXT,
    image_path TEXT,
    admin BOOLEAN NOT NULL DEFAULT false,
    color TEXT NOT NULL DEFAULT '#FFFFFF',
    color2 TEXT,
    location TEXT
);

DROP TABLE IF EXISTS events CASCADE;
CREATE TABLE events (

    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    image_path TEXT,
    latitude REAL,
    longitude REAL,
    location TEXT,
    price REAL,

    entity_id INTEGER REFERENCES entities(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (

    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

DROP TABLE IF EXISTS notifications CASCADE;
CREATE TABLE notifications (

    id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    description TEXT NOT NULL,
    seen BOOLEAN NOT NULL,
    
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE
);

-- A user can have events that they are interested in; this allows them to group these events in a single place for easier access
DROP TABLE IF EXISTS favorites;
CREATE TABLE favorites (

    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE
    
);
ALTER TABLE ONLY favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (user_id, event_id);

-- An event can belong to several categories; these can be used to search for particular types of events
DROP TABLE IF EXISTS event_categories;
CREATE TABLE event_categories (

    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id)
    
);
ALTER TABLE ONLY event_categories
    ADD CONSTRAINT event_categories_pkey PRIMARY KEY (category_id, event_id);
