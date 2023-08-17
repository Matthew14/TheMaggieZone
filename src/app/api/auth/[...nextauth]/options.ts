import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials'; 

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: { 
                username: {
                    label: 'Username:',
                    type: 'text',
                    placeholder: 'username goes here'
                },
                password: {
                    label: 'Password:',
                    type: 'password'
                }
            },
            async authorize(credentials) {
                const user = { id: "1", name: 'matthew', password: 'myPAss' }
                if(credentials?.username === user.name && credentials?.password === user.password) {
                    return user
                }
                else { return null }
            }
            
        })
    ],
}
