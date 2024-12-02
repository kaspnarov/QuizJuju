const photos = [
  {src: 'Fotos/1.png', correctLabel: 'Tuberculose'},
  {src: 'Fotos/2.png', correctLabel: 'Tuberculose'},
  {src: 'Fotos/3.png', correctLabel: 'Tuberculose'},
  {src: 'Fotos/4.png', correctLabel: 'Sífilis'},
  {src: 'Fotos/5.png', correctLabel: 'Sífilis'},
  {src: 'Fotos/6.png', correctLabel: 'Sífilis'},
  {src: 'Fotos/7.png', correctLabel: 'Sífilis'},
  {src: 'Fotos/8.png', correctLabel: 'Sífilis'},
  {src: 'Fotos/9.png', correctLabel: 'Candidíase'},
  {src: 'Fotos/10.png', correctLabel: 'Candidíase'},
  {src: 'Fotos/11.png', correctLabel: 'Candidíase'},
  {src: 'Fotos/12.png', correctLabel: 'Candidíase'},
  {src: 'Fotos/13.png', correctLabel: 'Paracoccidioidomicose '},
  {src: 'Fotos/14.png', correctLabel: 'Paracoccidioidomicose '},
  {src: 'Fotos/15.png', correctLabel: 'Paracoccidioidomicose '},
  {src: 'Fotos/16.png', correctLabel: 'Paracoccidioidomicose '},
  {src: 'Fotos/17.png', correctLabel: 'Hiperplasia fibrosa'},
  {src: 'Fotos/18.png', correctLabel: 'Granuloma piogênico'},
  {src: 'Fotos/19.png', correctLabel: 'Granuloma piogênico'},
  {src: 'Fotos/20.png', correctLabel: 'Granuloma piogênico'},
  {src: 'Fotos/21.png', correctLabel: 'Fibroma ossificante periférico'},
  {src: 'Fotos/22.png', correctLabel: 'Fibroma ossificante periférico'},
  {src: 'Fotos/23.png', correctLabel: 'Fibroma ossificante periférico'},
  {src: 'Fotos/24.png', correctLabel: 'Lesão periférica de células gigantes'},
  {src: 'Fotos/25.png', correctLabel: 'Lesão periférica de células gigantes'},
  {src: 'Fotos/26.png', correctLabel: 'Lesão periférica de células gigantes'},
  {src: 'Fotos/27.png', correctLabel: 'Lipoma'},
  {src: 'Fotos/28.png', correctLabel: 'Lifangioma'},
  {src: 'Fotos/29.png', correctLabel: 'Papiloma escamoso'},
  {src: 'Fotos/30.png', correctLabel: 'Papiloma escamoso'},
  {src: 'Fotos/31.png', correctLabel: 'Papiloma escamoso'},
  {src: 'Fotos/32.png', correctLabel: 'Papiloma escamoso'},
  {src: 'Fotos/33.png', correctLabel: 'Schwannoma'},
  {src: 'Fotos/34.png', correctLabel: 'Schwannoma'},
  {src: 'Fotos/35.png', correctLabel: 'Schwannoma'}
];

let shownIndices = []; // Array para salvar os índices das fotos mostradas
let score = 0;
let selectedLabel = '';
let currentPhotoIndex = -1;
let userResponses = []; // Array para salvar as respostas do usuário

document.getElementById('next-button').addEventListener('click', nextPhoto);

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

  if (shownIndices.length < photos.length) {
    // Seleciona um novo índice aleatório que ainda não tenha sido mostrado
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * photos.length);
    } while (shownIndices.includes(randomIndex));

    // Adiciona o novo índice ao array de índices mostrados
    shownIndices.push(randomIndex);
    currentPhotoIndex = randomIndex;

    // Define a próxima foto
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

// Função para inicializar as opções do seletor como radiobox
function initializeOptions(correctLabel) {
  const container = document.getElementById('photo-options');
  const uniqueLabels = [...new Set(photos.map(photo => photo.correctLabel))];

  uniqueLabels.forEach(label => {
    const labelElement = document.createElement('label');
    labelElement.classList.add('radio-label');
    labelElement.textContent = label;

    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.name = 'photo-description';
    radioInput.value = label;
    radioInput.addEventListener('change', () => {
      selectedLabel = label;
      document.querySelectorAll('.radio-label').forEach(l => l.classList.remove('radio-label-selected'));
      labelElement.classList.add('radio-label-selected');
      toggleNextButton(true);
    });

    labelElement.prepend(radioInput);
    container.appendChild(labelElement);
  });
}

function updateCounter() {
  document.getElementById('counter').textContent = `${shownIndices.length}/${photos.length}`;
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
  resultsContainer.innerHTML = `Você acertou ${score} de ${photos.length} fotos.<br><br>`;

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
      <td>${correct ? '✅' : '&#10060;'}</td>
    `;
    table.appendChild(row);
  });

  resultsContainer.appendChild(table);
}

// Inicializa a primeira foto, opções e contador
nextPhoto();
