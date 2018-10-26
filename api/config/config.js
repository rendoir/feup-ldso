module.exports = {
    development: {
        dialect: "postgres",
        user: "postgres",
        host: "postgres",
        database: "postgres",
        password: "example",
        port: "5432",
        timestamps: false
    },
    test: {
        dialect: "postgres",
        user: "postgres",
        host: "postgres", //192.168.99.100 for Vitor
        database: "postgres_test",
        password: "example",
        port: "5432",
        timestamps: false
    },
    production: {
        dialect: "postgres",
        user: "postgres",
        host: "postgres",
        database: "postgres",
        password: "example",
        port: "5432",
        timestamps: false
    }
};