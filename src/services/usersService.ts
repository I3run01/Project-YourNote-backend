import usersModel from '../Model/usersModel'
import CreateUserDto from '../dto/userDTO'

export class usersService {
    async create  (createUserDto: CreateUserDto) {
        return usersModel.create(createUserDto);
    }
    
    async findbyId  (id: string) {
        return await usersModel.findById(id)
    }
    
    async findByEmail (email: string) {
        return await usersModel.findOne({email})
    }

    async deleteOne  (id: string) {
        return await usersModel.deleteOne({_id: id}) 
    }

    async updateStatus(id: string, status: 'Active' | 'Pending') {
        return await usersModel.updateOne({_id: id}, {status})
    }

    async updatePassword(id: string, password: string) {
        return await usersModel.updateOne({_id: id}, {password})
    }
}