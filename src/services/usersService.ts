import usersModel from '../Model/usersModel'
import CreateUserDto from '../dto/userDTO'

export const usersService = {
    create: async  (createUserDto: CreateUserDto) => {
        return usersModel.create(createUserDto);
    },
    
    findById: async  (id: string) => {
        return await usersModel.findById(id)
    },
    
    findByEmail: async (email: string) => {
        return await usersModel.findOne({email})
    },
    
    deleteOne: async  (id: string) => {
        return await usersModel.deleteOne({_id: id}) 
    },
}