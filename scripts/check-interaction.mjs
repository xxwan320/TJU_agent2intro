import {build} from 'vite';
import {spawnSync} from 'node:child_process';
await build({configFile:false,logLevel:'silent',build:{outDir:'.runtime/adapter-build',emptyOutDir:false,minify:false,lib:{entry:{'map-budget':'frontend/src/transport/map-budget.ts',navigation:'frontend/src/transport/amap-navigation.ts'},formats:['es']}}});
const result=spawnSync(process.execPath,['--test','tests/maps/navigation.test.mjs','tests/transport/r3.test.mjs','tests/transport/r3-speech.test.mjs','tests/ui/tour.test.mjs','tests/speech/r3.test.mjs','tests/interaction/interaction.test.mjs','tests/interaction/page.test.mjs','tests/interaction/harness-closeout.test.mjs'],{stdio:'inherit',windowsHide:true});
process.exitCode=result.status??1;
