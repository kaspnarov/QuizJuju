let shownIndices = []; // Array para salvar os �ndices das fotos mostradas
let score = 0;
let selectedLabel = '';
let currentPhotoIndex = -1;
let userResponses = []; // Array para salvar as respostas do usu�rio
let totalQuestions = 1;

const difficultyOptions = document.querySelectorAll('.difficulty-option');
difficultyOptions.forEach(option => {
  option.addEventListener('click', selectDifficulty);
});
document.getElementById('start-quiz-button').addEventListener('click', startQuiz);
document.getElementById('next-button').addEventListener('click', nextPhoto);

// Adiciona o efeito de escala e desatura��o para as op��es que n�o s�o escolhidas
function selectDifficulty(event) {
  difficultyOptions.forEach(option => {
    option.classList.remove('difficulty-option-selected');
    option.style.transform = 'scale(0.95)'; // Escala menor para as n�o escolhidas
    option.style.filter = 'grayscale(50%)'; // Desatura��o para as n�o escolhidas
  });
  event.currentTarget.classList.add('difficulty-option-selected');
  event.currentTarget.style.transform = 'scale(1)'; // Tamanho normal para a escolhida
  event.currentTarget.style.filter = 'none'; // Sem desatura��o para a escolhida
  totalQuestions = parseInt(event.currentTarget.getAttribute('data-questions'));
  document.getElementById('start-quiz-button').disabled = false; // Habilita o bot�o ap�s selecionar a dificuldade
}

// Definir a op��o padr�o como "Puxado"
window.onload = function() {
  const defaultOption = document.querySelector('.difficulty-option:nth-child(4)');
  defaultOption.click();
};

function startQuiz() {
  document.getElementById('start-container').style.display = 'none';
  document.getElementById('quiz-container').style.display = 'flex';
  nextPhoto();
}

function nextPhoto() {
  if (currentPhotoIndex !== -1) {
    userResponses.push({
      photoIndex: currentPhotoIndex,
      correctLabel: photos[currentPhotoIndex].correctLabel,
      userLabel: selectedLabel,
      correct: selectedLabel === photos[currentPhotoIndex].correctLabel
    });
    if (selectedLabel === photos[currentPhotoIndex].correctLabel) {
      score++;
    }
  }

  if (shownIndices.length < totalQuestions) {
    // Seleciona um novo �ndice aleat�rio que ainda n�o tenha sido mostrado
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * photos.length);
    } while (shownIndices.includes(randomIndex));

    // Adiciona o novo �ndice ao array de �ndices mostrados
    shownIndices.push(randomIndex);
    currentPhotoIndex = randomIndex;

    // Define a pr�xima foto
    const nextPhoto = photos[randomIndex];
    document.getElementById('photo').src = nextPhoto.src;
    document.getElementById('photo-options').innerHTML = '';
    initializeOptions(nextPhoto.correctLabel);
    selectedLabel = '';
    updateCounter();
    toggleNextButton(false);
  } else {
    showResults();
  }
}

function updateCounter() {
  document.getElementById('counter').textContent = `${shownIndices.length}/${totalQuestions}`;
}

function toggleNextButton(enabled) {
  const nextButton = document.getElementById('next-button');
  if (enabled) {
    nextButton.disabled = false;
  } else {
    nextButton.disabled = true;
  }
}

function showResults() {
  document.getElementById('quiz-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = `Voc� acertou ${score} de ${totalQuestions} fotos.<br><br>`;

  const table = document.createElement('table');
  table.innerHTML = `
    <tr>
      <th>Foto</th>
      <th>Gabarito</th>
      <th>Resposta</th>
      <th>Resultado</th>
    </tr>
  `;

  userResponses.forEach(response => {
    const {photoIndex, correctLabel, userLabel, correct} = response;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${photoIndex + 1}</td>
      <td style="text-align: left; padding-left: 10px;">${correctLabel}</td>
      <td style="text-align: left; padding-left: 10px;">${userLabel}</td>
      <td>${correct ? '?' : '&#10060;'}</td>
    `;
    table.appendChild(row);
  });

  resultsContainer.appendChild(table);
}

let currentDropdownIndex = -1; // �ndice atual na lista de dropdown
let optionSelected = false; // Vari�vel para verificar se uma op��o foi selecionada

// Fun��o para inicializar as op��es com caixa de texto autocomplet�vel
function initializeOptions(correctLabel) {
  const container = document.getElementById('photo-options');
  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'auto-complete-input';
  input.placeholder = 'Digite para procurar...';
  container.appendChild(input);

  const dropdown = document.createElement('div');
  dropdown.id = 'dropdown-options';
  dropdown.classList.add('dropdown');
  container.appendChild(dropdown);

  input.addEventListener('input', function() {
    const query = this.value.toLowerCase();

    // Obter r�tulos �nicos e em ordem alfab�tica
    const uniqueLabels = [...new Set(photos.map(photo => photo.correctLabel))].sort((a, b) => a.localeCompare(b));

    const filteredOptions = uniqueLabels.filter(label => label.toLowerCase().includes(query));

    dropdown.innerHTML = '';
    currentDropdownIndex = -1; // Reiniciar �ndice quando o usu�rio come�a a digitar
    optionSelected = false; // Reiniciar flag quando o usu�rio come�a a digitar
    if (filteredOptions.length > 0) {
      dropdown.style.display = 'block'; // Mostra a dropdown se houver op��es
      filteredOptions.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.textContent = option;
        optionElement.classList.add('dropdown-item');
        optionElement.addEventListener('click', () => {
          input.value = option;
          selectedLabel = option;
          dropdown.innerHTML = '';
          dropdown.style.display = 'none'; // Esconde a dropdown ao selecionar uma op��o
          toggleNextButton(true);
          optionSelected = true; // Marca como selecionada
        });
        dropdown.appendChild(optionElement);
      });
    } else {
      dropdown.style.display = 'none'; // Esconde a dropdown se n�o houver op��es
    }
  });

  input.addEventListener('keydown', function(event) {
    const dropdownItems = dropdown.getElementsByClassName('dropdown-item');
    if (dropdownItems.length > 0) {
      if (event.key === 'ArrowDown' || event.key === 'Tab') {
        // Navegar para baixo
        event.preventDefault(); // Impede a a��o padr�o do Tab
        currentDropdownIndex = (currentDropdownIndex + 1) % dropdownItems.length;
        highlightOption(dropdownItems);
        dropdownItems[currentDropdownIndex].scrollIntoView({ block: 'nearest' });
      } else if (event.key === 'ArrowUp') {
        // Navegar para cima
        event.preventDefault(); // Impede a a��o padr�o
        currentDropdownIndex = (currentDropdownIndex - 1 + dropdownItems.length) % dropdownItems.length;
        highlightOption(dropdownItems);
        dropdownItems[currentDropdownIndex].scrollIntoView({ block: 'nearest' });
      } else if (event.key === 'Enter') {
        // Selecionar a op��o destacada se n�o houver uma op��o selecionada, ou passar para a pr�xima foto se houver uma op��o selecionada
        event.preventDefault(); // Impede que o formul�rio seja enviado
        if (!optionSelected && currentDropdownIndex >= 0) {
          input.value = dropdownItems[currentDropdownIndex].textContent;
          selectedLabel = input.value;
          dropdown.innerHTML = '';
          dropdown.style.display = 'none'; // Esconde a dropdown ao selecionar uma op��o
          toggleNextButton(true);
          optionSelected = true; // Marca como selecionada
        } else if (optionSelected) {
          nextPhoto(); // Passar para a pr�xima foto
        }
      }
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target !== input) {
      dropdown.innerHTML = '';
      dropdown.style.display = 'none'; // Esconde a dropdown ao clicar fora
    }
  });
}

function highlightOption(dropdownItems) {
  Array.from(dropdownItems).forEach((item, index) => {
    if (index === currentDropdownIndex) {
      item.classList.add('highlighted');
    } else {
      item.classList.remove('highlighted');
    }
  });
}

// Estilo CSS para a op��o destacada
const style = document.createElement('style');
style.innerHTML = `
  .dropdown-item.highlighted {
    background-color: #ddd;
  }
`;
document.head.appendChild(style);
