exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://moosecraft:80529357@ds123311.mlab.com:23311/notes-db';
                      
exports.PORT = process.env.PORT || 8080;