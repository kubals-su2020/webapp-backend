module.exports = (sequelize,DataTypes)=>{
    const user = sequelize.define("User_tbl",{
        first_name:{
            type: DataTypes.STRING(64),
            allowNull:false
        },
        last_name:{
            type: DataTypes.STRING(64),
            allowNull:false
        },
        email:{
            type: DataTypes.STRING(64),
            allowNull:false,
            unique:true
        },
        hashed_password:{
            type: DataTypes.STRING(255),
            allowNull:false
        },
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true
        }
    })

    user.associate = models => {
        user.hasMany(models.Book,{
            foreignKey: 'sellerId',
            onDelete: "cascade",
            onUpdate: "cascade",
        });
        user.hasOne(models.Cart,{
            onDelete: "cascade",
            onUpdate: "cascade",
        })
    }
    return user;
}