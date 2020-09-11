const ogre = require('./')
const app = ogre.createServer();

app.set('port', process.env.NODE_PORT || 3000);
app.listen(app.get('port'), () => {
	console.log(`Ogre listening on port ${app.get('port')}`)
})
