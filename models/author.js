// let book = require('./book')

// const bookId = author.belongsTo(User, { as: 'creator' });
module.exports = (sequelize,DataTypes)=>{
    const author = sequelize.define("Author",{
        id:{
            type: DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement: true
        },
        author_name:{
            type: DataTypes.STRING(64),
            allowNull:false,
        }
        
    })
    author.associate = models => {
        author.belongsTo(models.Book);
    }

    return author;
}
