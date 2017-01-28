exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/restaurants-app';
                      'mongodb://jwthinkful:happy45@ds133249.mlab.com:33249/mlab'
exports.PORT = process.env.PORT || 8080;
