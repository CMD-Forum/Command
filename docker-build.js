var spawn = require('child_process').spawn;

console.log("Preparing to build Docker Image...");
const dockerbuild = spawn('docker', [
    'build',
    '--platform',
    'linux/amd64',
    '-t',
    'cmd-forum',
    '.'
], { stdio: 'inherit' });
  
dockerbuild.on('exit', (code) => {
    if (code === 0) {
        console.log('\x1b[2m%s\x1b[0m', '┌────────────────────────────────────────────────────────────────────────────┐');
        process.stdout.write('\x1b[2m│\x1b[0m');process.stdout.write('  \x1b[32m✔  Docker Build Finished\x1b[0m');process.stdout.write('                                                  \x1b[2m│\x1b[0m');console.log();
        process.stdout.write('\x1b[2m│\x1b[0m');process.stdout.write('  Your image should now be accessible through Docker as `cmd-forum`');process.stdout.write('         \x1b[2m│\x1b[0m');console.log();
        console.log('\x1b[2m%s\x1b[0m', '└────────────────────────────────────────────────────────────────────────────┘');
    } else {
        console.log('\x1b[2m%s\x1b[0m', '┌──────────────────────────────────────────────────────────────┐');
        process.stdout.write('\x1b[2m│\x1b[0m');process.stdout.write('  \x1b[31m✘  Docker Build Failed\x1b[0m');process.stdout.write('                                         \x1b[2m│\x1b[0m');console.log();
        process.stdout.write('\x1b[2m│\x1b[0m');process.stdout.write(`  Exit Code: 1\x1b[0m`);process.stdout.write('                                                \x1b[2m│\x1b[0m');console.log();
        console.log('\x1b[2m%s\x1b[0m', '└──────────────────────────────────────────────────────────────┘');
    }
});