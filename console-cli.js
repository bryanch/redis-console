const readline = require('readline');
const log=require('./logger');

function factory(prompt, cmdHandler){
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: prompt
    });

    rl.prompt();

    rl.on('line', (cmd) => {
            cmdHandler(cmd).then(function(result){
                if(!result || !result.cmdEnd){
                    switch(cmd){
                        case 'exit': quit();break;
                        case '': break;
                        default:
                            log.error('unknown command, type \'exit\' to quit.');
                            break;
                    }
                }

                rl.prompt();
            }, function(err){
                log.error(err);
                rl.prompt();
            })
        })
        .on('close', () => {
            log.info('Have a great day!');
            process.exit(0);
        });

    function quit(){
        rl.close();
    }
}

module.exports = factory;