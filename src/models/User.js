import sequelize from "../config/sequelize.js";
import { DataTypes, UUIDV4 } from "sequelize";
import bcrypt from "bcryptjs";

const User = sequelize.define ('User', {
  user_UUID:{type: DataTypes.UUID, autoIncrement:false, defaultValue: UUIDV4, primaryKey: true},
  email: {type: DataTypes.STRING, allowNull:false, unique: true},
  username: {type: DataTypes.STRING, allowNull:false, unique: true},
  password: {type: DataTypes.STRING, allowNull:false, },
  phoneNumber: {type: DataTypes.STRING, allowNull:true, unique: true},
  profilePicture: { type: DataTypes.STRING, allowNull:false, defaultValue:"default-avatar.png"},
  gender: {type: DataTypes.ENUM("male", "female", "other"), allowNull:true},
  role: {type: DataTypes.ENUM("user", "admin"), allowNull:false, defaultValue:"user"},
  //for Role Base permission
  otp: {type: DataTypes.STRING,allowNull: true,},
  otpTime: {type: DataTypes.DATE,allowNull: true,},
  verified: {type: DataTypes.BOOLEAN,allowNull: false,defaultValue: false,},  

}, {timestamps:true,
    hooks: {
        beforeCreate:async (user) => {
            user.username = user.username.toLowerCase();
            user.email = user.email.toLowerCase();
            if(user.password){
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt)
            }
        },
        beforeUpdate: async(user) => {
            if(user.changed("username")){
                user.username = user.username.toLowerCase();
            }
            if(user.changed("email")) {
                user.email = user.email.toLowerCase();
            }
        }
    },
}

);
//This prototype verifies password sent by the user
User.prototype.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
    
};
export default User;
