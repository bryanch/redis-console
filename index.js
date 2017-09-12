const cli=require('./console-cli');
const log=require('./logger');
const redis=require('./redisclient');
const util=require('util');
const Q = require('q');

module.exports = function(config){
    var redisClient =redis(config);

    redisClient.on("message", function(channel, message){
        log.info("Message of '"+channel+"':"+message);
    });

    redisClient.on("subscribe", function(channel, count){
        log.info("Subscribe to '"+channel+"':"+count);
    });

    function cmdHandler(cmd){
        if(!cmd)return Q.resolve({});

        var defer = Q.defer();
        function print(err, result){
            if(err)log.error(err);
            else{
                if(util.isArray(result)){
                    result.forEach(function(r, i){
                        log.info(i+' - ' + r);
                    });
                }
                else if(util.isObject(result)){
                    log.info('Reply:'+ JSON.stringify(result));
                }
                else{
                    log.info('Reply:'+result);
                }
            }

            defer.resolve({cmdEnd:true});
        };

        var parts= cmd.split(' ').map(function(s){return s.trim();}).filter(function(s){return s.length>0;});
        if(parts.length>0){
            var args=parts.slice(1);
            if(parts[0] in redisClient){
                redisClient[parts[0]](args, print);
            }
            else {
                return Q.resolve(parts[0]+' is not found.');
            }
        }

        return defer.promise;
    }

    cli(config.host+'>', cmdHandler);
}

