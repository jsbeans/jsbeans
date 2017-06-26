# Generate bundle from sources

$ git clone https://github.com/goodybag/mongo-sql
$ npm install -g browserify // may need sudo or use local module
$ browserify -s MongoSQL index.js > mongo-sql-bundle.js