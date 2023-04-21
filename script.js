// Crée un canevas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var cellSize = 20;

var previewCanvas = document.getElementById('previsualisation');
var previewCtx = previsualisation.getContext('2d');

var score = 0;



// Fonction de gestionnaire d'événement pour les touches enfoncées
function handleKeyDown(event) {
    switch (event.keyCode) {
      case 37: // Flèche gauche
        if (piece.x > 0) {
          piece.x--;
        }
        break;
      case 39: // Flèche droite
        if (piece.x + piece.shape[0].length < grid.width) {
          piece.x++;
        }
        break;
      case 38: // Flèche du haut
        piece.rotate();
        break;
      default:
        break;
    }
  }

  Piece.prototype.drawPreview = function() {
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    for (var row = 0; row < this.shape.length; row++) {
      for (var col = 0; col < this.shape[row].length; col++) {
        if (this.shape[row][col]) {
          previewCtx.fillStyle = this.color;
          previewCtx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }
  };

  // Fonction de gestionnaire d'événement pour les touches relâchées
  function handleKeyUp(event) {
    // Ne fait rien pour le moment mais essentiel au fonctionnement de l'application
  }

  // Ajoute des gestionnaires d'événements pour les touches
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);

  // Crée un objet de pièce avec une méthode de rotation
  function Piece(shape,color) {
    this.x = 10;
    this.y = 0;
    this.shape = shape;
    this.color = color;
    this.originalColor = color; // Ajout d'une propriété pour enregistrer la couleur d'origine
  }
  var pieces = [
    { shape: [[1, 1], [1, 1]], color: 'yellow' },
    { shape: [[1, 0],[1, 1]], color: 'pink' },
    { shape: [[0, 1], [1, 1]], color: 'brown' },
    { shape: [[1, 1, 1, 1]], color: 'cyan' },
    { shape: [[1, 1, 1], [0, 0, 1]], color: 'blue' },
    { shape: [[1, 1, 1], [0, 1, 0]], color: 'orange' },
    { shape: [[1, 1, 0], [0, 1, 1]], color: 'purple' },
    { shape: [[0, 1, 1], [1, 1, 0]], color: 'green' },
  ];
  Piece.prototype.draw = function() {
    for (var row = 0; row < this.shape.length; row++) {
      for (var col = 0; col < this.shape[row].length; col++) {
        if (this.shape[row][col]) {
          ctx.fillStyle = this.color;
          ctx.fillRect((this.x + col) * cellSize, (this.y + row) * cellSize, cellSize, cellSize);
        }
      }
    }
  };
  Piece.prototype.rotate = function() {
    var newShape = [];
    for (var col = 0; col < this.shape[0].length; col++) {
      var newRow = [];
      for (var row = this.shape.length - 1; row >= 0; row--) {
        newRow.push(this.shape[row][col]);
      }
      newShape.push(newRow);
    }
    this.shape = newShape;
  };

  Piece.prototype.drawPreview = function() {
    previewCtx.clearRect(0, 0, previsualisation.width, previsualisation.height);
    const offsetX = (previsualisation.width - this.shape[0].length * cellSize) / 2;
    const offsetY = (previsualisation.height - this.shape.length * cellSize) / 2;

    for (var row = 0; row < this.shape.length; row++) {
      for (var col = 0; col < this.shape[row].length; col++) {
        if (this.shape[row][col]) {
          previewCtx.fillStyle = this.color;
          previewCtx.fillRect(offsetX + col * cellSize, offsetY + row * cellSize, cellSize, cellSize);
        }
      }
    }
  };



  // Créer un objet de grille
  function Grid() {
    this.width = 21;
    this.height = 30;
    this.cells = [];
    for (var row = 0; row < this.height; row++) {
      this.cells[row] = [];
      for (var col = 0; col < this.width; col++) {
        this.cells[row][col] = 0;
      }
    }
  }
  Grid.prototype.draw = function() {
    for (var row = 0; row < this.cells.length; row++) {
      for (var col = 0; col < this.cells[row].length; col++) {
        if (this.cells[row][col]) {
          ctx.fillStyle = this.cells[row][col]; // Utiliser la couleur enregistrée dans la grille
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }
  };

  Grid.prototype.canPlacePiece = function(piece) {
    for (var row = 0; row < piece.shape.length; row++) {
      for (var col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          var x = piece.x + col;
          var y = piece.y + row;
          if (y >= this.height || x < 0 || x >= this.width || this.cells[y][x]) {
            return false;
          }
        }
      }
    }
    return true;
  };
  Grid.prototype.placePiece = function(piece) {
    for (var row = 0; row < piece.shape.length; row++) {
      for (var col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          var x = piece.x + col;
          var y = piece.y + row;
          this.cells[y][x] = piece.originalColor; // Enregistre la couleur d'origine de la pièce dans la grille
        }
      }
    }
  };


  // Fonction de dessin pour le jeu

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    piece.y++;
    if (piece.y + piece.shape.length <= grid.height && grid.canPlacePiece(piece)) {
      piece.draw();
    } else {
      piece.y--;
      grid.placePiece(piece);
      if (piece.y == 0) {
        gameOver();
        return;
      }
      piece = nextPiece;
    nextPiece = getRandomPiece();
    nextPiece.drawPreview();

    }
    removeCompleteLines();
    grid.draw();
    setTimeout(draw, 260);
  }


  function removeCompleteLines() {
    var linesCompleted = 0;
    for (var row = grid.height - 1; row >= 0; row--) {
      var isComplete = true;
      for (var col = 0; col < grid.width; col++) {
        if (grid.cells[row][col] == 0) {
          isComplete = false;
          break;
        }
      }
      if (isComplete) {
        // Supprime la ligne complète
        for (var r = row; r > 0; r--) {
          for (var c = 0; c < grid.width; c++) {
            grid.cells[r][c] = grid.cells[r - 1][c];
          }
        }
        // Ajoute une nouvelle ligne vide en haut de la grille
        for (var c = 0; c < grid.width; c++) {
          grid.cells[0][c] = 0;
        }
        row++; // Recommence la vérification pour la ligne suivante

        // Augmente le compteur de lignes complétées
        linesCompleted++;
      }
    }
        // Met à jour le score en fonction du nombre de lignes complétées
    switch (linesCompleted) {
      case 1:
        score += 40;
        break;
      case 2:
        score += 100;
        break;
      case 3:
        score += 300;
        break;
      case 4:
        score += 1200;
        break;
      default:
        break;
    }
    // Met à jour l'affichage du score
    if (linesCompleted > 0) {
      updateScoreDisplay();
    }
  }

  function updateScoreDisplay() {
    document.getElementById('score').innerText = "Score: " + score;
  }


  function gameOver() {
    // Affiche la pop-up
    var popup = document.getElementById("popup");
    popup.style.display = "block";
  }

  function restartGame() {
    location.reload();
  }

  // Fonction de fin de jeu, recommencer le jeu
  function restartGame() {
    location.reload();
  }

  var nextPiece = getRandomPiece();
  nextPiece.drawPreview();

  function getRandomPiece() {
    var randomIndex = Math.floor(Math.random() * pieces.length);
    var piece = pieces[randomIndex];
    return new Piece(piece.shape, piece.color);

  }

  // Initialise le jeu
  var piece = getRandomPiece();
  var grid = new Grid();
  draw();
