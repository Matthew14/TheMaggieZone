import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
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
                    placeholder: 'Type your username'
                },
                password: {
                    label: 'Password:',
                    type: 'password',
                    placeholder: 'PWizzle'
                }
            },
            async authorize(credentials) {
                const prisma = new PrismaClient()

                if (!credentials?.password || !credentials.username) {
                    return null;
                }
                const user = await prisma.applicationUser.findUnique({
                    where: { username: credentials.username }
                })

                if (!user) {
                    return null;
                }
                const isPasswordValid = await compare(
                    credentials.password,
                    user.password
                )
                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id + '',
                    email: user.email,
                    name: user.username
                }
            }

        })
    ],

    callbacks: {
        session: ({ session, token }) => {
            console.log('Session Callback', { session, token })
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                }
            }
        },
        jwt: ({ token, user }) => {
            console.log('JWT Callback', { token, user })
            if (user) {
                const u = user as unknown as any
                return {
                    ...token,
                    id: u.id
                }
            }
            return token
        }
    }
}
