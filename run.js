var port = 3002;
var ogre = require('./')
ogre.createServer().listen(port)
console.log(`Ogre listening on port ${port}`)
