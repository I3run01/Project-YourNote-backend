import UsersModel from '../models/usersModel'
import { UserDocument } from '../models/usersModel';
import CreateUserDto from '../dto/usersDTO'

export class usersService {
    create  (createUserDto: CreateUserDto): Promise<UserDocument> {
        return UsersModel.create(createUserDto);
    }
    
    findbyId  (id: string): Promise<UserDocument | null> {
        return UsersModel.findById(id)
    }
    
    findByEmail (email: string): Promise<UserDocument | null> {
        return UsersModel.findOne({email})
    }

    deleteUser  (id: string): Promise<{ ok?: number; n?: number } & { deletedCount?: number }> {
        return UsersModel.deleteOne({_id: id}) 
    }

    async updateStatus(id: string, status: 'Active' | 'Pending'): Promise<UserDocument> {
        const user = await UsersModel.findByIdAndUpdate(id, { status }, { new: true });
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        return user;
    }

    async updatePassword(id: string, password: string): Promise<UserDocument> {
        const user = await UsersModel.findByIdAndUpdate(id, { password }, { new: true });
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        return user;
    }
}