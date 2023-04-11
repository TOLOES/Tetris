// Créer un canevas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var cellSize = 20;

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



  // Fonction de gestionnaire d'événement pour les touches relâchées
  function handleKeyUp(event) {
    // Ne fait rien pour le moment
  }

  // Ajouter des gestionnaires d'événements pour les touches
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);

  // Créer un objet de pièce avec une méthode de rotation
  function Piece(shape,color) {
    this.x = 10;
    this.y = 0;
    this.shape = shape;
    this.color = color;
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
          ctx.fillStyle = 'blue';
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
          this.cells[y][x] = 1;
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
      var randomIndex = Math.floor(Math.random() * pieces.length);
      piece = new Piece(pieces[randomIndex].shape, pieces[randomIndex].color);
    }
    removeCompleteLines();
    grid.draw();
    setTimeout(draw, 300);
  }


  function removeCompleteLines() {
    for (var row = grid.height - 1; row >= 0; row--) {
      var isComplete = true;
      for (var col = 0; col < grid.width; col++) {
        if (grid.cells[row][col] == 0) {
          isComplete = false;
          break;
        }
      }
      if (isComplete) {
        // Supprimer la ligne complète
        for (var r = row; r > 0; r--) {
          for (var c = 0; c < grid.width; c++) {
            grid.cells[r][c] = grid.cells[r - 1][c];
          }
        }
        // Ajouter une nouvelle ligne vide en haut de la grille
        for (var c = 0; c < grid.width; c++) {
          grid.cells[0][c] = 0;
        }
        row++; // Recomencer la vérification pour la ligne suivante
      }
    }
  }


  function gameOver() {
    // Afficher la pop-up
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

  function getRandomPiece() {
    var randomIndex = Math.floor(Math.random() * pieces.length);
    var piece = pieces[randomIndex];
    return new Piece(piece.shape, piece.color);
  }


  // Initialiser le jeu
  var piece = getRandomPiece();
  var grid = new Grid();
  draw();
