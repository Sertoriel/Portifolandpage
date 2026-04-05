const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function walk(dir) {
    let files = await readdir(dir);
    files = await Promise.all(files.map(async file => {
        const filePath = path.join(dir, file);
        const stats = await stat(filePath);
        if (stats.isDirectory()) return walk(filePath);
        else if(filePath.endsWith('.jsx')) return filePath;
    }));
    return files.reduce((all, folderContents) => all.concat(folderContents), []);
}

async function run() {
    const files = await walk(path.join(__dirname, 'frontend', 'src'));
    
    files.forEach(file => {
        if(!file) return;
        let content = fs.readFileSync(file, 'utf8');
        
        // 1. Substituir strings normais: 'http://localhost:5000/api/AlgumLugar'
        // Transforma a aspa simples/dupla que abre a rota completa em backticks e injeta
        content = content.replace(/'http:\/\/localhost:5000\/api([^']*)'/g, '`${import.meta.env.VITE_API_URL}$1`');
        content = content.replace(/"http:\/\/localhost:5000\/api([^"]*)"/g, '`${import.meta.env.VITE_API_URL}$1`');
        
        // 2. Substituir rotas que já são literals backticks: `http://localhost:5000/api/AlgumLugar/${id}`
        // Transforma o texto em template string natural
        content = content.replace(/`http:\/\/localhost:5000\/api(.*?)`/g, '`${import.meta.env.VITE_API_URL}$1`');
        
        fs.writeFileSync(file, content, 'utf8');
    });
    console.log("Substituição global de Endpoint concluída!");
}
run();
