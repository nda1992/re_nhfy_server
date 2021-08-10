const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    're_nhfy',
    "root",
    "123456",
    {
        dialect:"mysql",
        host:"localhost",
        port:3306,
        "define":{
            "charset":"utf8",
            'collate':'utf8_general_ci',
            'timestamps':true
        }
    }
);
module.exports=sequelize;