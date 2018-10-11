module.exports = {
    development: {
        dialect: "postgres",
        user: "postgres",
        host: "192.168.99.100", //192.168.99.100 for Vitor; localhost for everyone else
        database: "postgres",
        password: "example",
        port: "5432",
        timestamps: false
    },
    test: {
        dialect: "postgres",
        user: "postgres",
        host: "192.168.99.100", //192.168.99.100 for Vitor; localhost for everyone else
        database: "postgres_test",
        password: "example",
        port: "5432",
        timestamps: false
    },
    production: {
        dialect: "postgres",
        user: "postgres",
        host: "localhost",
        database: "postgres",
        password: "example",
        port: "5432",
        timestamps: false
    }
};