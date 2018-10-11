
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS event_categories;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS entities;
DROP TABLE IF EXISTS users;


CREATE TABLE users (

    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    admin BOOLEAN NOT NULL DEFAULT false
);


CREATE TABLE entities (

    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    initials TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT NOT NULL DEFAULT '#FFFFFF',
    color2 TEXT,
    location TEXT
);


CREATE TABLE events (

    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    location TEXT,
    price REAL,

    poster_id INTEGER REFERENCES users(id) NOT NULL,
    entity_id INTEGER REFERENCES entities(id) NOT NULL,

  --  UNIQUE (title, start_date, entity_id),
  ----  CHECK (start_date >= current_timestamp),
    CHECK (end_date = null OR start_date < end_date)
    -- TODO: Nao funciona
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
    event_id INTEGER REFERENCES events(id),

    PRIMARY KEY (user_id, event_id)
);


CREATE TABLE event_categories (

    category_id INTEGER REFERENCES categories(id),
    event_id INTEGER REFERENCES events(id),

    PRIMARY KEY (category_id, event_id)
);


CREATE TABLE permissions (

    user_id INTEGER REFERENCES users(id),
    entity_id INTEGER REFERENCES entities(id),

    PRIMARY KEY (user_id, entity_id)
);


--| TRIGGERS & CONSTRAINTS |--


CREATE OR REPLACE FUNCTION check_permission() RETURNS trigger AS $check_permission$
    DECLARE
        poster_name TEXT;
        entity_initials TEXT;
    BEGIN
        SELECT name FROM users WHERE id = NEW.poster_id INTO poster_name;
        SELECT initials FROM entities WHERE id = NEW.entity_id INTO entity_initials;

        IF NOT EXISTS (SELECT * FROM permissions WHERE permissions.user_id = NEW.poster_id AND permissions.entity_id = NEW.entity_id)
        THEN RAISE EXCEPTION '% has not permission for %', poster_name, entity_initials;
        END IF;

    
        RETURN NEW;

    END;
    
$check_permission$ LANGUAGE plpgsql;

CREATE TRIGGER check_permission BEFORE INSERT OR UPDATE ON events
    FOR EACH ROW EXECUTE PROCEDURE check_permission();

