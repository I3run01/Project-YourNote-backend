import userModel from '../Model/users'
import CreateUserDto from '../dto/userDTO'

export const usersService = {
    create: async  (createUserDto: CreateUserDto) => {
        return userModel.create(createUserDto);
    },
    
    findById: async  (id: string) => {
        return await userModel.findById(id)
      },
    
    findByEmail: async (email: string) => {
        return await userModel.findOne({email})
    },
    
    deleteOne: async  (id: string) => {
        return await userModel.deleteOne({_id: id}) 
    },
}