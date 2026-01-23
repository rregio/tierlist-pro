const jsonInput = document.getElementById('jsonInput');
const itemBank = document.getElementById('itemBank');
const listTitle = document.getElementById('listTitle');
const downloadBtn = document.getElementById('downloadBtn');

// 1. Escutar quando um arquivo for selecionado
jsonInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            renderTierList(data);
        } catch (err) {
            alert("Erro ao ler o arquivo JSON. Verifique o formato.");
        }
    };
    reader.readAsText(file);
});

// 2. Renderizar os itens na tela
function renderTierList(data) {
    listTitle.innerText = data.title;
    itemBank.innerHTML = ''; 

    data.lista.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.draggable = true;
        card.id = `item-${index}`;
        
        // Define o nome do item (suportando diferentes chaves no JSON)
        const nomeItem = item.jogo || item.nome || item.item || "Item";
        card.title = nomeItem;

        if (item.imagem && item.imagem.trim() !== "") {
            const img = document.createElement('img');
            img.src = item.imagem;
            img.alt = nomeItem;
            card.appendChild(img);
        } else {
            // LÓGICA NOVA: 3 primeiras letras + última letra
            const initials = document.createElement('span');
            initials.className = 'item-initials';
            initials.innerText = formatNameInitials(nomeItem);
            card.appendChild(initials);
        }

        card.addEventListener('dragstart', dragStart);
        itemBank.appendChild(card);
    });
}

// Função para formatar o texto (Ex: Javascript -> Javt)
function formatNameInitials(name) {
    // Remove espaços para não contar espaço como caractere
    const cleanName = name.replace(/\s+/g, '');
    
    if (cleanName.length <= 4) {
        return cleanName; // Se o nome for curto (C++, PHP, Go), mostra ele todo
    }

    const firstThree = cleanName.substring(0, 3); // Pega as 3 primeiras
    const lastLetter = cleanName.slice(-1);       // Pega a última
    return firstThree + lastLetter;
}

// 3. Lógica de Drag and Drop
let draggedItem = null;

function dragStart(e) {
    draggedItem = this;
    setTimeout(() => this.style.display = 'none', 0);
}

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

// 4. Lógica do Botão de Download (Foto)
downloadBtn.addEventListener('click', function() {
    const tierListArea = document.querySelector('.tier-container');

    html2canvas(tierListArea, {
        backgroundColor: "#121212",
        useCORS: true,
        scale: 2 // Melhora a qualidade da imagem
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'minha-tierlist.png';
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});
