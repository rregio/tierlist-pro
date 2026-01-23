const jsonInput = document.getElementById('jsonInput');
const itemBank = document.getElementById('itemBank');
const listTitle = document.getElementById('listTitle');
const downloadBtn = document.getElementById('downloadBtn');
const tierLabels = document.querySelectorAll('.tier-label');

const DEFAULT_RANKS = ["S", "A", "B", "C", "D"];

jsonInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            renderTierList(data);
        } catch (err) {
            alert("Erro ao processar JSON.");
        }
    };
    reader.readAsText(file);
});

function renderTierList(data) {
    listTitle.innerText = data.title;
    
    // Lógica de Customização dos Ranks
    // Só altera se o array 'rank' existir e tiver exatamente 5 itens
    const labelsParaUsar = (data.rank && data.rank.length === 5) ? data.rank : DEFAULT_RANKS;
    
    tierLabels.forEach((label, index) => {
        label.innerText = labelsParaUsar[index];
    });

    itemBank.innerHTML = ''; 
    data.lista.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.draggable = true;
        card.id = `item-${index}`;
        
        const nomeItem = item.jogo || item.nome || item.item || "Item";
        card.title = nomeItem;

        if (item.imagem && item.imagem.trim() !== "") {
            const img = document.createElement('img');
            img.src = item.imagem;
            card.appendChild(img);
        } else {
            const initials = document.createElement('span');
            initials.className = 'item-initials';
            initials.innerText = formatNameInitials(nomeItem);
            card.appendChild(initials);
        }

        card.addEventListener('dragstart', dragStart);
        itemBank.appendChild(card);
    });
}

function formatNameInitials(name) {
    const cleanName = name.replace(/\s+/g, '');
    if (cleanName.length <= 4) return cleanName;
    return cleanName.substring(0, 3) + cleanName.slice(-1);
}

// Drag and Drop
let draggedItem = null;
const dropzones = document.querySelectorAll('.tier-dropzone');

function dragStart() {
    draggedItem = this;
    setTimeout(() => this.style.display = 'none', 0);
}

dropzones.forEach(zone => {
    zone.addEventListener('dragover', e => e.preventDefault());
    zone.addEventListener('drop', function() {
        this.appendChild(draggedItem);
        draggedItem.style.display = 'flex';
    });
});

// Download
downloadBtn.addEventListener('click', () => {
    const tierArea = document.querySelector('.tier-container');
    html2canvas(tierArea, { backgroundColor: "#121212", scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'tierlist.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});