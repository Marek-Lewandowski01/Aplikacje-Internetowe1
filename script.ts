const cssStyle = document.getElementById('style') as HTMLLinkElement | null;
const styles = ["css/more_green.css", "css/more_red.css", "css/changed_bg.css"];
let i = 0;

// Funkcja zmieniająca styl
function setStyle(index: number) {
    if (cssStyle) {
        console.log(`Zmieniam styl na: ${styles[index]}`);
        cssStyle.href = styles[index];
        i = index;
        generateStyleLinks();
    } else {
        console.error("Element z id 'style' nie istnieje");
    }
}

// Generowanie nazwy linku w zależności od stylu
function getStyleName(style: string) {
    if (style.includes("more_red")) return "bardziej czerwony";
    if (style.includes("more_green")) return "bardziej zielony";
    if (style.includes("changed_bg")) return "zmienione tło";
    return "Styl " + (styles.indexOf(style) + 1);
}

// Inicjalizacja pierwszego stylu po wejściu na stronę
function initStyle() {
    if (cssStyle) {
        console.log(`Pierwszy styl to ${styles[i]}`);
        cssStyle.href = styles[i];
    } else {
        console.error("Element z id 'style' nie istnieje");
    }
}

// Dynamiczne generowanie linków
function generateStyleLinks() {
    const linksContainer = document.getElementById('style-links') as HTMLDivElement | null;
    if (linksContainer) {
        linksContainer.innerHTML = ''; // Wyczyść istniejące linki przed dodaniem nowych
        styles.forEach((style, index) => {
            if (index !== i) {  // Jeśli nie aktualny styl -> generuj link
                const link = document.createElement('a');
                link.href = '#';
                link.innerText = getStyleName(style); // Określenie nazwy linku
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    setStyle(index);
                });
                linksContainer.appendChild(link);
                linksContainer.appendChild(document.createElement('br')); // Dodanie odstępu między linkami
            }
        });

        // Wyświetlanie aktualnego stylu
        const currentStyle = document.createElement('span');
        currentStyle.innerText = `Aktualny styl: ${getStyleName(styles[i])}`;
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