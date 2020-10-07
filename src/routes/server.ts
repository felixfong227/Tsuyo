import epxress from 'express';
import logger from '@modules/logger';

const router = epxress.Router();
const client = require('../bot.js');

function MissingUserSessionHandler(req: Express.Request, res: epxress.Response) {
  if (!req.session) {
    logger.warn('Missing a user session');
    return res.end('User session is missing');
  }
}

router.get('/', MissingUserSessionHandler, async (req: epxress.Request, res: epxress.Response) => {
  //if (!req.session.user) return res.redirect('/')
  //if (!req.session.guilds) return res.redirect('/')
  //if (!client.guilds.has(req.query.id)) return res.redirect('/')
  //if (!client.guilds.get(req.query.id).members.has(req.session.user.id)) return res.redirect('/')
  res.render('server/members', { user: req?.session?.user, guild: req.query.id, djsclient: client });
})

router.get('/config', MissingUserSessionHandler, async (req: epxress.Request, res: epxress.Response) => {
  if (!req?.session?.user) return res.redirect('/')
  //if (!req.session.guilds) return res.redirect('/')
  if (!client.guilds.has(req.query.id)) return res.redirect('/')

  if (client.guilds.get(req.query.id).members.get(req.session.user.id).hasPermission('ADMINISTRATOR')) return res.redirect('/guild/config?id=' + req.query.id)

  res.render('server/config', { user: req.session.user, guild: req.query.id, djsclient: client })
})

router.post('/config', MissingUserSessionHandler, async (req: epxress.Request, res: epxress.Response) => {
  if (!req?.session?.user) return res.redirect('/')
  if (!req?.session?.guilds) return res.redirect('/')
  if (!client.guilds.has(req.query.id)) return res.redirect('/')
  if (!client.guilds.get(req.query.id).members.has(req.session.user.id)) return res.redirect('/')

  if (!client.guilds.get(req.query.id).members.get(req.session.user.id).hasPermission('MANAGE_SERVER')) return console.log("nope")

  client.settings.set(req.query.id, req.body)
  res.render('server/config', { user: req.session.user, guild: req.query.id, djsclient: client })
})

module.exports = router
