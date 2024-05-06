export function isEmail(email) {
    if (email.includes('@')) {
        return true;
    } else {
        return false;
    }
}

export function isNotEmpty(value) {
    if (value.length != 0) {
        return true;
    } else {
        return false;
    }
}

export function isPassword(password) {
    if (password.length < 7) {
        return false;
    } else {
        return true;
    }
}

export function isDisplayName(displayName) {
    if (displayName.length < 4) {
        return false;
    } else {
        return true;
    }
}

export function isPasswordMatch(password, confirmPassword) {
    if (password === confirmPassword) {
        return true;
    } else {
        return false;
    }
}
