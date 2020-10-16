const router = require('express').Router();
import BotConfig from '@bot_config';
const fetch = require('node-fetch');
const FormData = require('form-data');
import express from 'express';
import logger from '@modules/logger';

const { DISCORD_REDIRECT_URI, clientId, clientSecret } = process.env;

router.get('/', (req: express.Request, res: express.Response) => {
    if (req?.session?.user) return res.redirect('/');

    if (typeof DISCORD_REDIRECT_URI !== 'string') {
        throw new Error('Environment DISCORD_REDIRECT_URI is not set');
    }

    const authorizeUrl = `https://discordapp.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=${BotConfig.scopes.join('%20')}`;
    res.redirect(authorizeUrl);
});

router.get('/callback', async (req: express.Request, res: express.Response) => {
    if (req?.session?.user) return res.redirect('/');

    const accessCode = req.query.code;

    if (req.query.error === 'access_denied') {
        req.flash('user.auth', 'You have cancelled your login via Discord.');
        return res.redirect('/');
    }

    if (!accessCode) {
        req.flash('user.auth', 'Login failed, please try it again. (Missing Discord access code)')
        res.redirect('/');
        throw new Error('No access code returned from Discord.');
    }

    const data = new FormData();
    data.append('client_id', clientId);
    data.append('client_secret', clientSecret);
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', DISCORD_REDIRECT_URI);
    data.append('scope', BotConfig.scopes.join(' '));
    data.append('code', accessCode);

    try {

        let authTokenRes = await fetch('https://discordapp.com/api/oauth2/token', {
            method: 'POST',
            body: data
        });

        if (!authTokenRes.ok) {
            console.log('Failed to fetch access token from Discord auth server.');
            throw new Error(
                await authTokenRes.text()
            );
        }

        let response = await authTokenRes.json();

        let [userResponse, guildResponse] = await Promise.all(
            [
                fetch('https://discordapp.com/api/users/@me', {
                    method: 'GET',
                    headers: {
                        authorization: `${response.token_type} ${response.access_token}`
                    },
                }),
                fetch('https://discordapp.com/api/users/@me/guilds', {
                    method: 'GET',
                    headers: {
                        authorization: `${response.token_type} ${response.access_token}`
                    }
                })
            ]
        );

        if (!userResponse.ok) {
            console.log('Failed to fetch user info from Discord server.');
            req.flash('Failed to login, unable to fetch your basic user info from Discord.')
            res.redirect('/');
            throw new Error(
                await userResponse.text()
            );
        }

        userResponse = await userResponse.json();

        if (!guildResponse.ok) {
            console.log('Failed to fetch user guild info from Discord');
            req.flash('user.auth', 'Failed to login, unable to fetch your guild info from Discord.');
            res.redirect('/');
            throw new Error(
                await guildResponse.text()
            );
        }

        userResponse.username = `${userResponse.username}`;
        userResponse.id = `${userResponse.id}`;
        userResponse.tag = `${userResponse.discriminator}`;
        userResponse.tagName = `${userResponse.username}#${userResponse.discriminator}`;
        userResponse.avatarURL = userResponse.avatar ? `https://cdn.discordapp.com/avatars/${userResponse.id}/${userResponse.avatar}.png?size=1024` : null;
        // @ts-ignore
        req.session.user = userResponse;
        // @ts-ignore
        req.session.guilds = await guildResponse.json();
        res.set('credentials', 'include');
        res.redirect('/');

    } catch (err) {
        console.log('Failed to login a user in with Discord credentials.');
        req.flash('user.auth', 'Fail to login, something terrible has happened.');
        res.redirect('/');
        throw new Error(err);
    }


});

router.get('/logout', (req: express.Request, res: express.Response) => {
    req?.session?.destroy(err => {
        logger.error(`Fail to destroy user session\n ${err}`)
    });
    return res.redirect('/');
});

module.exports = router;
