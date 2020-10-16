import express from 'express';
const router = express.Router();
import client from '@src/bot';

router.get('/', async (req: express.Request, res: express.Response) => {
  if (!req?.session?.user) { res.redirect('/'); return }
  if (!req?.session?.guilds) { res.redirect('/'); return }
  res.render('servers', { user: req.session.user, guilds: req.session.guilds, djsclient: client })
})

module.exports = router
