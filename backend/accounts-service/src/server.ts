import app from './app';
import database from 'mp-commons/data/db';

(async() =>{

    try {   
    const port = parseInt(`${process.env.PORT}`);
        //Conectando sequelize
        //sync sincroniza os modelos mapeados na aplicação com as tabelas do db
        await database.sync();
        console.log(`Running database ${process.env.DB_NAME}`);

        await app.listen(port);
        console.log(`Run on port ${port}`);
    
    } catch (error) {
        console.log(error);
        console.log(`Error entre {} ${error}`);
    }
})();