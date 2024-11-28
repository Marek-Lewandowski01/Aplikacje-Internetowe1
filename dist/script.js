/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


var cssStyle = document.getElementById('style');
var styles = ["css/more_green.css", "css/more_red.css", "css/changed_bg.css"];
var i = 0;
// Funkcja zmieniająca styl
function setStyle(index) {
  if (cssStyle) {
    console.log("Zmieniam styl na: ".concat(styles[index]));
    cssStyle.href = styles[index];
    i = index;
    generateStyleLinks();
  } else {
    console.error("Element z id 'style' nie istnieje");
  }
}
// Generowanie nazwy linku w zależności od stylu
function getStyleName(style) {
  if (style.includes("more_red")) return "bardziej czerwony";
  if (style.includes("more_green")) return "bardziej zielony";
  if (style.includes("changed_bg")) return "zmienione tło";
  return "Styl " + (styles.indexOf(style) + 1);
}
// Inicjalizacja pierwszego stylu po wejściu na stronę
function initStyle() {
  if (cssStyle) {
    console.log("Pierwszy styl to ".concat(styles[i]));
    cssStyle.href = styles[i];
  } else {
    console.error("Element z id 'style' nie istnieje");
  }
}
// Dynamiczne generowanie linków
function generateStyleLinks() {
  var linksContainer = document.getElementById('style-links');
  if (linksContainer) {
    linksContainer.innerHTML = ''; // Wyczyść istniejące linki przed dodaniem nowych
    styles.forEach(function (style, index) {
      if (index !== i) {
        // Jeśli nie aktualny styl -> generuj link
        var link = document.createElement('a');
        link.href = '#';
        link.innerText = getStyleName(style); // Określenie nazwy linku
        link.addEventListener('click', function (event) {
          event.preventDefault();
          setStyle(index);
        });
        linksContainer.appendChild(link);
        linksContainer.appendChild(document.createElement('br')); // Dodanie odstępu między linkami
      }
    });
    // Wyświetlanie aktualnego stylu
    var currentStyle = document.createElement('span');
    currentStyle.innerText = "Aktualny styl: ".concat(getStyleName(styles[i]));
    currentStyle.style.fontWeight = 'bold';
    linksContainer.appendChild(currentStyle);
  } else {
    console.error("Kontener 'style-links' nie istnieje");
  }
}
// Inicjalizacja stylu
initStyle();
// Generowanie linków
generateStyleLinks();
/******/ })()
;