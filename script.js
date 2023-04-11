// Créer un canevas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var cellSize = 20;

// Fonction de gestionnaire d'événement pour les touches enfoncées
function handleKeyDown(event) {
    if (event.keyCode == 37) { // Flèche gauche
      if (piece.x > 0) { // Vérifier que la pièce ne sort pas de la grille à gauche
        piece.x--;
      }
    } else if (event.keyCode == 39) { // Flèche droite
      if (piece.x + piece.shape.length < grid.width) { // Vérifier que la pièce ne sort pas de la grille à droite
        piece.x++;
      }
    } else if (event.keyCode == 38) { // Flèche haut
      piece.rotate();
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
  function Piece() {
    this.x = 10;
    this.y = 0;
    this.shape = [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0]
    ];
  }
  Piece.prototype.draw = function() {
    for (var row = 0; row < this.shape.length; row++) {
      for (var col = 0; col < this.shape[row].length; col++) {
        if (this.shape[row][col]) {
          ctx.fillStyle = 'red';
          ctx.fillRect((this.x + col) * cellSize, (this.y + row) * cellSize, cellSize, cellSize);
        }
      }
    }
  };
  Piece.prototype.rotate = function() {
    var newShape = [];
    for (var row = 0; row < this.shape.length; row++) {
      newShape[row] = [];
      for (var col = 0; col < this.shape[row].length; col++) {
        newShape[row][col] = this.shape[col][this.shape.length - row - 1];
      }
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
      piece = new Piece();
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

  // Initialiser le jeu
  var piece = new Piece();
  var grid = new Grid();
  draw();
