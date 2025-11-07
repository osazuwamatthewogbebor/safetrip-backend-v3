import { Sequelize } from 'sequelize';
import APP_CONFIG from './APP_CONFIG.js';

//  Create Sequelize instance
const sequelize = new Sequelize(
  APP_CONFIG.DB_NAME,
  APP_CONFIG.DB_USER,
  APP_CONFIG.DB_PASSWORD,
  {
    host: APP_CONFIG.DB_HOST,
    // dialect: 'mysql',
    dialect: 'postgres',
    logging: true,
    port: APP_CONFIG.DB_PORT
  }
);


//  Test the connection immediately
try {
  await sequelize.authenticate();
  console.log(' Database connected successfully!');
} catch (error) {
  console.error(' Unable to connect to the database:', error);
}
export default sequelize;
