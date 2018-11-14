module.exports = {
    development: {
        dialect: "postgres",
        user: "postgres",
        host: "postgres",
        database: "postgres",
        password: "example",
        port: "5432",
        timestamps: false,
        jwtSecret: "Bongo cat"
    },
    test: {
        dialect: "postgres",
        user: "postgres",
        host: "postgres", // 192.168.99.100 for Vitor
        database: "postgres_test",
        password: "example",
        port: "5432",
        timestamps: false,
        jwtSecret: "Bongo cat"
    },
    production: {
        dialect: "postgres",
        user: "postgres",
        host: "postgres",
        database: "postgres",
        password: "example",
        port: "5432",
        timestamps: false,
        jwtSecret: "Bongo cat"
    }
};
