var log = require('./logger');
var redis = require('redis');

module.exports=function(redisConfig){
    log.info('connecting to redis server:"'+redisConfig.host+'"');
    return redis.createClient(redisConfig.port,redisConfig.host, {
        auth_pass: redisConfig.accessKey,
        tls: {
            servername: redisConfig.host
        },
        retry_strategy: function(options){
            if(options.error){
                if(options.error.code === 'ECONNREFUSED'){
                    var msg = 'The redis server ' + redisConfig.host + ':' + redisConfig.port + ' refused the connection.';
                    log.error(msg);
                    return new Error(msg);
                }
                else{
                    log.error(options.error);
                }
            }

            return Math.min(options.attempt*100,3000);
        }
    });
}
