import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRE_CONNECTION_STRING as string, {
    dialect: 'postgres',
    logging: (msg) => console.log(msg), // SQL sorgularını konsola yazdırmak istiyorsan
});

sequelize.authenticate()
    .then(() => console.log("Database connection successful"))
    .catch(err => console.error("Error connecting to the database: ", err));

export default sequelize;