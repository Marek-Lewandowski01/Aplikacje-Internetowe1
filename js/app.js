document.addEventListener("DOMContentLoaded", function () {
  const locationButton = document.getElementById("getLocationButton");
  const saveButton = document.getElementById("saveMapButton");

  let map = L.map("map").setView([51.505, -0.09], 13); // Londyn
  L.tileLayer.provider("Esri.WorldImagery").addTo(map);

  function addMarker(lat, lng) {
    L.marker([lat, lng]).addTo(map).bindPopup("Twoja lokalizacja").openPopup();
  }

  locationButton.addEventListener("click", function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Latitude: ", position.coords.latitude);
          console.log("Longitude: ", position.coords.longitude);
          addMarker(position.coords.latitude, position.coords.longitude);
          map.setView(
            [position.coords.latitude, position.coords.longitude],
            13,
          );
        },
        (error) => {
          console.error("Error Code: " + error.code + " - " + error.message);
          alert("Nie udało się pobrać lokalizacji");
        },
      );
    } else {
      alert("Twoja przeglądarka nie obsługuje geolokalizacji");
    }
  });

  // Zapisanie mapy
  saveButton.addEventListener("click", function () {
    leafletImage(map, function (err, canvas) {
      // canvas
      let rasterMap = document.getElementById("rasterMap");
      const targetWidth = 1000;
      const targetHeight = 600;
      rasterMap.width = targetWidth;
      rasterMap.height = targetHeight;

      let rasterContext = rasterMap.getContext("2d");

      rasterContext.drawImage(
        canvas,
        0,
        0,
        canvas.width,
        canvas.height,
        0,
        0,
        targetWidth,
        targetHeight,
      );

      // Podzielenie obrazu na kawałki i stworzenie układanki
      const puzzleBoard = document.getElementById("puzzle-board");
      const puzzlePiecesContainer = document.getElementById("puzzle-pieces");
      puzzleBoard.innerHTML = "";
      puzzlePiecesContainer.innerHTML = "";

      const pieceWidth = rasterMap.width / 4;
      const pieceHeight = rasterMap.height / 4;
      const pieces = [];

      // Tworzenie slotów na planszy układanki
      for (let i = 0; i < 16; i++) {
        const slot = document.createElement("div");
        slot.classList.add("puzzle-slot");
        slot.dataset.index = i;
        puzzleBoard.appendChild(slot);
      }

      // Tworzenie kawałków układanki
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const pieceCanvas = document.createElement("canvas");
          pieceCanvas.width = pieceWidth;
          pieceCanvas.height = pieceHeight;
          pieceCanvas.classList.add("puzzle-piece");
          pieceCanvas.draggable = true;
          pieceCanvas.dataset.index = row * 4 + col;

          const pieceContext = pieceCanvas.getContext("2d");
          pieceContext.drawImage(
            rasterMap,
            col * pieceWidth,
            row * pieceHeight,
            pieceWidth,
            pieceHeight,
            0,
            0,
            pieceWidth,
            pieceHeight
          );

          pieces.push(pieceCanvas);
        }
      }

      // Mieszanie i wyświetlanie kawałków układanki
      shuffleArray(pieces);
      pieces.forEach(piece => {
        puzzlePiecesContainer.appendChild(piece);
      });

      // Implementacja funkcji drag & drop
      implementDragAndDrop();
    });
  });

  function requestNotificationPermission() {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Dziękujemy za zgodę na otrzymywanie powiadomień!");
        }
      });
    } else {
      alert("Twoja przeglądarka nie obsługuje powiadomień");
    }
  }

  // Wywołanie funkcji pobierającej zgodę na powiadomienia
  requestNotificationPermission();

  // Mieszanie tablicy
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
  }

  function implementDragAndDrop() {
    const pieces = document.querySelectorAll(".puzzle-piece");
    const slots = document.querySelectorAll(".puzzle-slot");

    pieces.forEach(piece => {
      piece.addEventListener("dragstart", dragStart);
    });

    slots.forEach(slot => {
      slot.addEventListener("dragover", dragOver);
      slot.addEventListener("drop", drop);
    });

    let draggedPiece = null;

    function dragStart(event) {
      draggedPiece = event.target;
      event.dataTransfer.setData("text/plain", event.target.dataset.index);
    }

    function dragOver(event) {
      event.preventDefault();
    }

    function drop(event) {
      event.preventDefault();
      const slot = event.target;
      if (slot.classList.contains("puzzle-slot") && slot.children.length === 0) {
        slot.appendChild(draggedPiece);

        // Sprawdzenie, czy kawałek jest na właściwym miejscu
        if (draggedPiece.dataset.index === slot.dataset.index) {
          draggedPiece.style.border = "2px solid green";
        } else {
          draggedPiece.style.border = "2px solid red";
        }

        // Sprawdzenie, czy układanka jest ukończona
        checkPuzzleCompletion();
      }
    }
  }

  function checkPuzzleCompletion() {
    const slots = document.querySelectorAll(".puzzle-slot");
    let isComplete = true;

    slots.forEach(slot => {
      const piece = slot.children[0];
      if (!piece || piece.dataset.index !== slot.dataset.index) {
        isComplete = false;
      }
    });

    if (isComplete) {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Udało się ułożyć układankę!");
      }
      showCompletionOverlay();

    }
  }

  function showCompletionOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "completion-overlay";
    overlay.innerHTML = "<h2>Udało się ułożyć!</h2>";

    const puzzleBoard = document.getElementById("puzzle-board");
    puzzleBoard.style.position = "relative";
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";

    puzzleBoard.appendChild(overlay);
  }

});
