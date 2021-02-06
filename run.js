var port = 5001;
var ogre = require('./')
ogre.createServer().listen(port)
console.log(`Ogre listening on port ${port}`)
