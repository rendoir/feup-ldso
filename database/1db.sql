--| TABLES |--

DROP TYPE IF EXISTS USER_TYPE CASCADE;
CREATE TYPE USER_TYPE AS ENUM ('mobile', 'moderator', 'admin');

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    type USER_TYPE NOT NULL DEFAULT 'mobile'
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

DROP FUNCTION IF EXISTS check_permission();
CREATE OR REPLACE FUNCTION check_permission() RETURNS trigger AS $$
    DECLARE
        user_name TEXT;
        entity_initials TEXT;
    BEGIN
        SELECT name FROM users WHERE id = NEW.user_id INTO user_name;
        SELECT initials FROM entities WHERE id = NEW.entity_id INTO entity_initials;

        IF NOT EXISTS (SELECT * FROM permissions WHERE permissions.user_id = NEW.user_id AND permissions.entity_id = NEW.entity_id)
        THEN RAISE EXCEPTION '% does not have permission to add events in %.', user_name, entity_initials;
        END IF;
    
        RETURN NEW;

    END;
    
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS check_permission ON events;
CREATE TRIGGER check_permission BEFORE INSERT OR UPDATE ON events
    FOR EACH ROW EXECUTE PROCEDURE check_permission();
    
DROP FUNCTION IF EXISTS add_all_permissions_to_admin();
CREATE OR REPLACE FUNCTION add_all_permissions_to_admin() RETURNS trigger AS $$
    DECLARE
        r INTEGER;
    BEGIN
        IF NEW.type = 'admin'
        THEN 
            FOR r IN SELECT id FROM entities
            LOOP
                INSERT INTO permissions (user_id, entity_id) VALUES (NEW.id, r);
            END LOOP;
        END IF;
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS add_all_permissions_to_admin ON users;
CREATE TRIGGER add_all_permissions_to_admin AFTER INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE PROCEDURE add_all_permissions_to_admin();


DROP FUNCTION IF EXISTS add_permissions_to_all_admins();
CREATE OR REPLACE FUNCTION add_permissions_to_all_admins() RETURNS trigger AS $$
    DECLARE
        r INTEGER;
    BEGIN
        FOR r IN SELECT id FROM users WHERE type = 'admin'
        LOOP
            INSERT INTO permissions (user_id, entity_id) VALUES (r, NEW.id);
        END LOOP;
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS add_permissions_to_all_admins ON entities;
CREATE TRIGGER add_permissions_to_all_admins AFTER INSERT OR UPDATE ON entities
    FOR EACH ROW EXECUTE PROCEDURE add_permissions_to_all_admins();



DROP FUNCTION IF EXISTS check_user_is_moderator_or_admin();
CREATE OR REPLACE FUNCTION check_user_is_moderator_or_admin() RETURNS trigger AS $$
    DECLARE
        user_type TEXT;
        user_name TEXT;
    BEGIN
        SELECT name, type FROM users WHERE id = NEW.user_id INTO user_name, user_type;

        IF user_type != 'admin' AND user_type != 'moderator'
        THEN RAISE EXCEPTION '% is a % user, so cannot have permission to add events.', user_name, user_type;
        END IF;
    
        RETURN NEW;

    END;
    
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS check_user_is_moderator_or_admin ON permissions;
CREATE TRIGGER check_user_is_moderator_or_admin BEFORE INSERT OR UPDATE ON permissions
    FOR EACH ROW EXECUTE PROCEDURE check_user_is_moderator_or_admin();

--| DATABASE TEST |--

DROP DATABASE IF EXISTS postgres_test;
CREATE DATABASE postgres_test;
GRANT ALL PRIVILEGES ON DATABASE postgres_test TO postgres; 