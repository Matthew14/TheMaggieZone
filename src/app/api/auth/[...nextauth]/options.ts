import { prisma } from '@/lib/prisma';
import { clearFailures, isRateLimited, recordFailure } from '@/lib/rateLimit';
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
            async authorize(credentials, req) {
                if (!credentials?.password || !credentials.username) {
                    return null;
                }
                const forwardedFor = req.headers?.['x-forwarded-for'];
                const ip = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)?.split(',')[0]?.trim() ?? 'unknown';
                if (isRateLimited(ip)) {
                    return null;
                }
                const user = await prisma.applicationUser.findUnique({
                    where: { username: credentials.username }
                })

                if (!user) {
                    recordFailure(ip);
                    return null;
                }
                const isPasswordValid = await compare(
                    credentials.password,
                    user.password
                )
                if (!isPasswordValid) {
                    recordFailure(ip);
                    return null
                }
                clearFailures(ip);

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
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                }
            }
        },
        jwt: ({ token, user }) => {
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
