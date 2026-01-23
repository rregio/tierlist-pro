const jsonInput = document.getElementById('jsonInput');
const itemBank = document.getElementById('itemBank');
const listTitle = document.getElementById('listTitle');

// 1. Escutar quando um arquivo for selecionado
jsonInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = JSON.parse(e.target.result);
        renderTierList(data);
    };
    reader.readAsText(file);
});

// 2. Renderizar os itens na tela
function renderTierList(data) {
    listTitle.innerText = data.title;
    itemBank.innerHTML = ''; // Limpa o banco atual

    data.lista.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.draggable = true;
        card.id = `item-${index}`;
        
        // O nome do item é usado como "title" (texto ao passar o mouse)
        const nomeItem = item.jogo || item.nome || "Item";
        card.title = nomeItem;

        if (item.imagem && item.imagem.trim() !== "") {
            const img = document.createElement('img');
            img.src = item.imagem;
            img.alt = nomeItem;
            card.appendChild(img);
        } else {
            // Se não tiver imagem, cria a sigla
            const initials = document.createElement('span');
            initials.className = 'item-initials';
            initials.innerText = getInitials(nomeItem);
            card.appendChild(initials);
        }

        // Eventos de Drag para o Card
        card.addEventListener('dragstart', dragStart);
        itemBank.appendChild(card);
    });
}

// Função auxiliar para pegar iniciais (Ex: Super Mario -> SM)
function getInitials(name) {
    return name.split(' ').map(word => word[0]).join('').slice(0, 3);
}

// 3. Lógica de Drag and Drop
let draggedItem = null;

function dragStart(e) {
    draggedItem = this;
    setTimeout(() => this.style.display = 'none', 0);
}

// Configurar todas as zonas de drop
const dropzones = document.querySelectorAll('.tier-dropzone');

dropzones.forEach(zone => {
    zone.addEventListener('dragover', e => e.preventDefault());
    
    zone.addEventListener('dragenter', function(e) {
        e.preventDefault();
        this.style.backgroundColor = 'rgba(255,255,255,0.1)';
    });

    zone.addEventListener('dragleave', function() {
        this.style.backgroundColor = 'transparent';
    });

    zone.addEventListener('drop', function() {
        this.style.backgroundColor = 'transparent';
        this.appendChild(draggedItem);
        draggedItem.style.display = 'flex';
    });
});
const downloadBtn = document.getElementById('downloadBtn');

downloadBtn.addEventListener('click', function() {
    // Selecionamos a área que queremos "fotografar"
    const tierListArea = document.querySelector('.tier-container');

    // Usamos a biblioteca html2canvas
    html2canvas(tierListArea, {
        backgroundColor: "#121212", // Garante o fundo escuro na imagem
        useCORS: true // Permite carregar imagens de outros sites
    }).then(originalCanvas => {
        // Criamos um novo canvas para adicionar o rodapé com a atribuição
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const footerHeight = 40;

        canvas.width = originalCanvas.width;
        canvas.height = originalCanvas.height + footerHeight;

        // Preenchemos o fundo com a mesma cor da TierList
        ctx.fillStyle = "#121212";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Desenhamos a TierList original
        ctx.drawImage(originalCanvas, 0, 0);

        // Adicionamos o texto de atribuição
        ctx.fillStyle = "#888888";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Desenvolvido por https://youtube.com/@naoehpro", canvas.width / 2, originalCanvas.height + 25);

        // Criamos um link temporário para o download
        const link = document.createElement('a');
        link.download = 'minha-tierlist.png';
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});