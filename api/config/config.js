module.exports = {
    development: {
        dialect: "postgres",
        user: "postgres",
        host: "postgres",
        database: "postgres",
        password: "example",
        port: "5432",
        timestamps: false,
        jwtSecret: "Bongo cat",
        assertsDir: "."
    },
    test: {
        dialect: "postgres",
        user: "postgres",
        host: "postgres",
        database: "postgres_test",
        password: "example",
        port: "5432",
        timestamps: false,
        jwtSecret: "Bongo cat",
        assertsDir: "."
    },
    production: {
        dialect: "postgres",
        user: "postgres",
        host: "postgres",
        database: "postgres",
        password: "example",
        port: "5432",
        timestamps: false,
        jwtSecret: "Bongo cat",
        assertsDir: "."
    }
};
