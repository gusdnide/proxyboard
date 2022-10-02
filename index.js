const spawn = require('child_process').spawn
const fs = require('fs')
const { Signale } = require('signale')

const Debug = new Signale({
    scope: "ProxyGraber",
    config: {
        displayTimestamp: true,
    }
})
async function main() {

    checker = spawn('python3.10', ['scrape.py'])
    fs.copyFileSync('./tiny.conf.b', './tiny.conf')
    let count = {
        "http": 0,
        "socks4": 0,
        "socks5": 0
    };
    Debug.info("Atualizando proxys...")
    checker.stdout.on('data', function (data) {
        let proxie = data.toString().trimEnd()
        if (!proxie.includes("://") || !proxie.includes("Proxy:  ")) {
            return;
        }
        let scheema = proxie.trim().split('://')[0].split(':')[1].trim()
        let [host, port] = proxie.trim().split('//')[1].split(':')
        count[scheema] += 1
        Debug.success(scheema, host, port)
        fs.appendFileSync('tiny.conf', `upstream	http	${host}:${port}\n`);
        //Debug.success(proxie)
    });
    checker.on('exit', function (code) {
        Debug.info(count)
        spawn('pkill', ['tinyproxy']);
        spawn('tinyproxy', "-c tiny.conf".split(' '));
    });
}

main().then(r => {setInterval(main, 1000 * 60 * 60)})