module.exports = (sequelize,DataTypes)=>{
    const entry = sequelize.define("Entry",{
        id:{
            type: DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement: true
        },
        quantity:{
            type: DataTypes.INTEGER,
            allowNull:false
        }
        
    })
    entry.associate = models => {
        entry.belongsTo(models.Book);
        entry.belongsTo(models.Cart)
    }
    // book.associate = models => {
    //     book.hasMany(models.Author,{
    //         onDelete:"cascade"
    //     });
    // }
    // book.hasMany(models.Author)
    return entry;
}