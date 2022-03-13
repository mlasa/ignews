import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { query } from 'faunadb';

import { fauna } from '../../../services/fauna';

export default NextAuth({
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: 'read:user, user:email'
                }
            },
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            const { email } = user;

            await fauna.query(
                query.Create(
                    query.Collection('users'),
                    { data: email }
                )
            )

            return true;
        }
    }
});
