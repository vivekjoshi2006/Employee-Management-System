const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
let sequelize;

if (process.env.VERCEL === '1' || databaseUrl) {
    if (!databaseUrl) {
        console.error("❌ ERROR: Neither POSTGRES_URL nor DATABASE_URL is defined in Vercel's Environment Variables.");
    }

    sequelize = new Sequelize(databaseUrl || "", {
        dialect: 'postgres',
        dialectModule: require('pg'),
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },

        // SERVERLESS CONNECTION POOL OPTIMIZATION
        pool: {
            max: 2,           // Keeps connection count low on serverless scale
            min: 0,
            idle: 5000,       // Close idle connections quickly to free up slots
            acquire: 15000    // Timeout after 15 seconds
        },
        logging: false
    });
    console.log("📡 Connected to Cloud PostgreSQL Database (Neon/Vercel)");
}

else {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '..', 'database.sqlite'),
        logging: false
    });
    console.log("💾 Connected to Local SQLite Database");
}

// EXPORT
const dbExport = {
    sequelize,
    __esModule: true
};
dbExport.default = dbExport;
dbExport.sequelize = sequelize;

module.exports = dbExport;