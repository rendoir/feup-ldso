--| TABLES |--

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    admin BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS entities CASCADE;
CREATE TABLE entities
(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    initials TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT NOT NULL DEFAULT '#FFFFFF',
    color2 TEXT,
    location TEXT
);

DROP TABLE IF EXISTS events CASCADE;
CREATE TABLE events
(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    location TEXT,
    price REAL,

    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    entity_id INTEGER REFERENCES entities(id) ON DELETE CASCADE,

    UNIQUE (title, start_date, entity_id),
    CONSTRAINT check_starts_in_future 
        CHECK ((end_date IS NOT NULL AND end_date >= current_timestamp) 
            OR (end_date IS NULL AND start_date >= current_timestamp)), 
    CONSTRAINT check_starts_before_ends CHECK (start_date < end_date)
);

DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories
(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications
(
    id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    description TEXT NOT NULL,
    seen BOOLEAN NOT NULL,
    
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE
);

-- A user can have events that they are interested in; this allows them to group these events in a single place for easier access
DROP TABLE IF EXISTS favorites;
CREATE TABLE favorites
(
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    
    PRIMARY KEY (user_id, event_id)
);

-- An event can belong to several categories; these can be used to search for particular types of events
DROP TABLE IF EXISTS event_categories;
CREATE TABLE event_categories
(
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    
    PRIMARY KEY (category_id, event_id)
);

DROP TABLE IF EXISTS permissions;
CREATE TABLE permissions
(
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    entity_id INTEGER REFERENCES entities(id) ON DELETE CASCADE,

    PRIMARY KEY (user_id, entity_id)
);


--| TRIGGERS & CONSTRAINTS |--

DROP FUNCTION  IF EXISTS check_permission();
CREATE OR REPLACE FUNCTION check_permission() RETURNS trigger AS $check_permission$
    DECLARE
        user_name TEXT;
        entity_initials TEXT;
    BEGIN
        SELECT name FROM users WHERE id = NEW.user_id INTO user_name;
        SELECT initials FROM entities WHERE id = NEW.entity_id INTO entity_initials;

        IF NOT EXISTS (SELECT * FROM permissions WHERE permissions.user_id = NEW.user_id AND permissions.entity_id = NEW.entity_id)
        THEN RAISE EXCEPTION '% does not have permission to add events in %', user_name, entity_initials;
        END IF;
    
        RETURN NEW;

    END;
    
$check_permission$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_permission ON events;
CREATE TRIGGER check_permission BEFORE INSERT OR UPDATE ON events
    FOR EACH ROW EXECUTE PROCEDURE check_permission();
    
CREATE INDEX search_entity ON entities USING GIST ((
	setweight(to_tsvector('english', initials), 'A') ||
	setweight(to_tsvector('english', name), 'B') ||
	setweight(to_tsvector('english', description), 'C')
));

CREATE INDEX search_category ON categories USING GIST ((
	setweight(to_tsvector('english', name), 'A') ||
	setweight(to_tsvector('english', description), 'B')
));

--| DATABASE TEST |--

DROP DATABASE IF EXISTS postgres_test;
CREATE DATABASE postgres_test;
GRANT ALL PRIVILEGES ON DATABASE postgres_test TO postgres;