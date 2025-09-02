
const birler = ["", "Bir", "İki", "Üç", "Dört", "Beş", "Altı", "Yedi", "Sekiz", "Dokuz"];
const onlar = ["", "On", "Yirmi", "Otuz", "Kırk", "Elli", "Altmış", "Yetmiş", "Seksen", "Doksan"];
const binler = ["", "Bin", "Milyon", "Milyar", "Trilyon", "Katrilyon"];

function ucBasamakYazi(n: number): string {
    if (n === 0) return "";
    let yazi = "";
    if (n >= 100) {
        const yuz = Math.floor(n / 100);
        yazi += (yuz > 1 ? birler[yuz] : "") + "Yüz";
        n %= 100;
    }
    if (n >= 10) {
        yazi += onlar[Math.floor(n / 10)];
        n %= 10;
    }
    if (n > 0) {
        yazi += birler[n];
    }
    return yazi;
}

export const numberToWords = (num: number, currency: 'TRY' | 'USD' | 'EUR' = 'TRY'): string => {
    if (num === null || num === undefined) return "";
    if (num === 0) return "Sıfır";

    let currencyMain = "Lira";
    let currencySub = "Kuruş";

    switch(currency) {
        case 'USD':
            currencyMain = "Dolar";
            currencySub = "Sent";
            break;
        case 'EUR':
            currencyMain = "Euro";
            currencySub = "Sent";
            break;
    }


    const numStr = num.toFixed(2);
    const [tamKisimStr, kurusKisimStr] = numStr.split('.');

    let tamKisim = parseInt(tamKisimStr, 10);
    let kurusKisim = parseInt(kurusKisimStr, 10);

    let yazi = "";

    if (tamKisim === 0) {
        // Do not add "Sıfır" if there's a kurus part
    } else {
        const parts: string[] = [];
        let i = 0;
        while (tamKisim > 0) {
            const part = tamKisim % 1000;
            if (part > 0) {
                let partYazi = ucBasamakYazi(part);
                // "Bin" special case: "Bir Bin" should be "Bin"
                if (i === 1 && part === 1) {
                    partYazi = "";
                }
                parts.unshift(partYazi + binler[i]);
            }
            tamKisim = Math.floor(tamKisim / 1000);
            i++;
        }
        yazi += parts.join("");
    }
    
    if(yazi) yazi += ` ${currencyMain}`;
    
    if (kurusKisim > 0) {
        if(yazi) yazi += " ";
        yazi += ucBasamakYazi(kurusKisim) + ` ${currencySub}`;
    }

    // Capitalize first letter
    return yazi.charAt(0).toUpperCase() + yazi.slice(1);
};
