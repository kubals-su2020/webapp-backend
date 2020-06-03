module.exports = (sequelize,DataTypes)=>{
    const cart = sequelize.define("Cart",{
        id:{
            type: DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement: true
        },        
    })


    cart.associate = models => {
        cart.belongsTo(models.User_tbl);
        cart.hasMany(models.Entry,{
           onDelete:"cascade",
           onUpdate:"cascade",
        });
    }



    // cart.associate = models => {
    //     cart.belongsTo(models.User_tbl,{
    //         foreignKey:{
    //             allowNull:false
    //         }
    //     })
    //     cart.hasMany(models.Book)
    // }
    // cart.associate = models => {
    //     cart.belongsTo(models.User_tbl)
    //     cart.hasMany(models.Book)
    // }
    // cart.belongsTo(book,{foreignKey: 'book_seller_id'});
    return cart;
}