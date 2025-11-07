import { Sequelize } from 'sequelize';
import APP_CONFIG from './APP_CONFIG.js';
import dotenv from "dotenv";
dotenv.config();

let sequelize;

if (process.env.NODE_ENV === "production") {
  // Use Render (production) database
  sequelize = new Sequelize(APP_CONFIG.DATABASE_URL, {
    dialect: "postgres", // or 'mysql'
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  });
} else {
  // Use local development database
  sequelize = new Sequelize(
  APP_CONFIG.DB_NAME,
  APP_CONFIG.DB_USER,
  APP_CONFIG.DB_PASSWORD,
  {
    host: APP_CONFIG.DB_HOST,
    // dialect: 'mysql',
    dialect:  APP_CONFIG.DATABASE_DIALECT,
    logging: true,
    port: APP_CONFIG.DB_PORT
  }
);

}


//  Test the connection immediately
try {
  await sequelize.authenticate();
  console.log(' Database connected successfully!');
} catch (error) {
  console.error(' Unable to connect to the database:', error);
}
export default sequelize;
