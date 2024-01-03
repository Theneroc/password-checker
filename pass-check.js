let advice = []; // This will have strings of advice to improve password strength
let passwordStrength = {
    rank: "",
    entropyBits: "",
    varianceBits: ""
}

const isTooShort = (password) => { // checks if the password is too short
    return password.length < 12;
}

const isTooLong = (password) => { // checks if the password is too long
    return password.length > 256;
}

const hasUpperCase = (password) => { // checks if password has at least one uppercase letter
    return password != password.toLowerCase();
}

const hasLowerCase = (password) => { // checks if password has at least one lowercase letter
    return password != password.toUpperCase();
}

const hasNumber = (password) => { // checks if password has at least one number
    for (c of password) {
        if (!isNaN(c))
            return true;
    }
    // default is false
}

// checks if password has at least one special character 
const hasSpecial = (password) => { // using UTF-16 --> unicode 15.1 standards (the latest unicode has up to 149813 unique characters)
    for (c of password) {
        if ((c.charCodeAt(0) > 31 && c.charCodeAt(0) < 48) || (c.charCodeAt(0) > 57 && c.charCodeAt(0) < 65) || (c.charCodeAt(0) > 90 && c.charCodeAt(0) < 97) || c.charCodeAt(0) > 122)
            return true;
    }
    // default is false
}

const updateAdvice = (password) => { // updates the advice list to improve password quality
    if (isTooShort(password))
        advice.push("The password should be at least 12 characters long");
    if (isTooLong(password))
        advice.push("The password should be at most 256 characters long");
    if (!hasLowerCase(password))
        advice.push("The password should have at least 1 lowercase letter");
    if (!hasUpperCase(password))
        advice.push("The password should have at least 1 lowercase letter");
    if (!hasNumber(password))
        advice.push("The password should have at least 1 number");
    if (!hasSpecial(password))
        advice.push("The password should have at least 1 special character");
}

const getEntropy = (password) => { // gets the entropy of the password in bits
    let complexity = 0;

    if (hasLowerCase(password))
        complexity += 26;
    if (hasUpperCase(password))
        complexity += 26;
    if (hasNumber(password))
        complexity += 10;
    if (hasSpecial(password))
        complexity += 149751;

    return Math.floor(Math.log2(Math.pow(complexity,password.length)));
}

const getMean = (password) => { // gets the mean of the password from character unicode
    let sum = 0;

    for (c of password)
        sum += c.charCodeAt(0);

    return sum / password.length;
}

const getVariance = (password) => { // gets the variance of the password from character unicode
    const mean = getMean(password);
    let sum = 0;

    for (c of password) 
        sum += Math.pow((c.charCodeAt(0) - mean), 2);
      
    return Math.floor(sum / password.length);
}

function checkStrength() { // main function checks and prints password strength and prints advice list
    
    const password = document.getElementById('input').value;
    advice = []
    updateAdvice(password);
    const entropy = getEntropy(password);
    const variance = getVariance(password);


    passwordStrength.entropyBits = entropy.toString();
    passwordStrength.varianceBits = variance.toString();

    if ((entropy < 64 && variance < 12) || (entropy < 128 && variance < 12) || (entropy < 64 && variance < 366))
        passwordStrength.rank = "Weak";
    else if ( (entropy < 128 && variance < 366) || (entropy < 128 && variance >= 366) || (entropy >= 128 && variance <366))
        passwordStrength.rank = "Medium";
    else
        passwordStrength.rank = "Strong";
    
    const info = document.getElementById('info');
    info.innerHTML = ``; // empties changed element from previous run

    const strengthInfo = document.createElement('div');

    strengthInfo.innerHTML = `
        <div>
        <p>Password Strength: ${passwordStrength.rank}</p>
        <p>Entropy in bits: ${passwordStrength.entropyBits}</p>
        <p>Variance in bits: ${passwordStrength.varianceBits}</p>
        </div>
    `;

    info.appendChild(strengthInfo);

    for (let s of advice) {
        const div = document.createElement('div');
        div.style.color = 'red';
        div.textContent = "* " + s;
        info.appendChild(div);
    }

    document.body.appendChild(info);
}