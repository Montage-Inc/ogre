var port = 3001;
var ogre = require('./')
ogre.createServer().listen(port)
console.log(`Ogre listening on port ${port}`)
