module.exports = (sequelize,DataTypes)=>{
    const book = sequelize.define("Book",{
        isbn:{
            type: DataTypes.STRING(64),
            allowNull:false,
        },
        // seller_id:{
        //      type: DataTypes.,
        //      allowNull:false
        // },
        title:{
            type: DataTypes.STRING(64),
            allowNull:false
        },
        quantity:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        price:{
            type:DataTypes.DOUBLE,
            allowNull:false
        },
        publication_date:{
            type: DataTypes.DATE,
            allowNull:false
        },
        id:{
            type: DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement: true
        }
        
    })
    book.associate = models => {
        book.belongsTo(models.User_tbl);
        book.hasMany(models.Author,{
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            hooks: true,
        });
        book.hasMany(models.Entry,{
            onDelete: "CASCADE",
            onUpdate: "CASCADE",

        });
    }
    // book.associate = models => {
    //     book.hasMany(models.Author,{
    //         onDelete:"cascade"
    //     });
    // }
    // book.hasMany(models.Author)
    return book;
}