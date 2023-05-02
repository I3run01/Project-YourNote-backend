type CreateUserDto = {
    name: string | null
    email: string
    password: string
    avatarImage: string | null
    confirmationCode?: string
}

export default CreateUserDto
