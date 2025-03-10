const caractere = {
    zero: "0",
    one: "1",
    two: "2",
    tree: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    sum: "+",
    sub: "-",
    mul: "*",
    div: "/",
    dot: ".",

    clear: "AC",
    equal: "=",

    error: "#ERROR",
};

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const operators = ["+", "-", "*", "/"];

class CalculatorHistory {
    $history = document.querySelector("#history .content");
    STORAGE_KEY = "history";
    onHistory = [];
    data = [];

    constructor() {
        const history = localStorage.getItem(this.STORAGE_KEY);

        if (history) {
            this.data = JSON.parse(history);

            this.data.forEach((v) => {
                this.pushToScreen(v);
            });
        }

        document.addEventListener("click", (event) => {
            if (event.target.className == "history-button") {
                this.onHistory.forEach((f) => {
                    f(event.target.dataset.value);
                });
            }
            if (event.target.className == "clear-history") {
                this.clear();
            }
        });
    }

    push(data) {
        this.data.push(data);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
        this.pushToScreen(data);
    }

    clear() {
        this.data = [];
        localStorage.removeItem(this.STORAGE_KEY);
        this.$history.innerHTML = "";
    }

    onHistoryClick(callback) {
        this.onHistory.push(callback);
    }

    pushToScreen(data) {
        const $newItem = document.createElement("button");
        $newItem.className = "history-button";
        $newItem.setAttribute("data-value", data.expression);
        $newItem.textContent = `${data.expression}=${data.result}`;
        this.$history.appendChild($newItem);
    }
}

class Display {
    $displayElement = document.querySelector("#display p");
    element = null;
    value = [];

    constructor() {
        const displayValue = this.$displayElement.innerText;
        this.value = displayValue.split(/([+\-*\/])/).filter(Boolean);
    }

    getValueString() {
        return this.value.join("");
    }

    setValueString(expressionString) {
        this.value = expressionString.split(/([+\-*\/])/).filter(Boolean);
        return this;
    }

    getValue() {
        return this.value;
    }

    setValue(array) {
        this.value = array.map((val) => val.toString());
        return this;
    }

    getLastValue() {
        return this.value[this.value.length - 1];
    }

    setLastValue(string) {
        this.value[this.value.length - 1] = string;
        return this;
    }

    addValue(string) {
        this.value.push(string);
        return this;
    }

    addValueToLast(string) {
        this.setLastValue(this.getLastValue() + string);
        return this;
    }

    lastIsANumber() {
        return !isNaN(this.getLastValue());
    }

    lastIsAnIncompleteDecimalNumber() {
        const value = this.getLastValue();
        return value[value.length - 1] == caractere.dot;
    }

    lastIsAOperator() {
        return operators.includes(this.getLastValue());
    }

    lastIsAError() {
        return this.getLastValue() == caractere.error;
    }

    lastHasADot() {
        return this.getLastValue().includes(caractere.dot);
    }

    write() {
        this.$displayElement.classList.remove("result");
        this.$displayElement.innerText = this.value.join("");
        this.$displayElement.scrollTop = this.$displayElement.scrollHeight;
    }

    writeAsResult() {
        this.$displayElement.classList.add("result");
        this.$displayElement.innerText = this.value.join("");
        this.$displayElement.scrollTop = this.$displayElement.scrollHeight;
    }
}

class Calculator {
    clearOnNextUse = false;
    display = new Display();
    history = new CalculatorHistory();

    constructor() {
        this.display = new Display();

        document.querySelectorAll("#buttons button").forEach((buttonElem) => {
            buttonElem.addEventListener("click", (event) => {
                const key = event.target.dataset.value;
                this.proccessClick(key);
            });
        });

        document.addEventListener("keydown", (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (event.key == "h") {
                this.toggleHistory();
            }

            const key = this.getKeyFromKeyboard(event.key);
            const $button = document.querySelector(
                `button[data-value="${key}"]`
            );

            if ($button && !$button.classList.contains("active")) {
                $button.classList.add("active");
                this.proccessClick(key);
            }
        });

        document.addEventListener("keyup", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const key = this.getKeyFromKeyboard(event.key);
            const $button = document.querySelector(
                `button[data-value="${key}"]`
            );

            if ($button && $button.classList.contains("active")) {
                $button.classList.remove("active");
            }
        });

        this.history.onHistoryClick((expression) => {
            this.display.setValueString(expression).write();
            this.clearOnNextUse = false;
            this.toggleHistory();
        });
    }

    isNumber(text) {
        return numbers.includes(text);
    }

    isOperator(text) {
        return operators.includes(text);
    }

    getKeyFromKeyboard(keyboardKey) {
        if (keyboardKey == "Enter") {
            return caractere.equal;
        }
        if (keyboardKey == "Backspace") {
            return caractere.clear;
        }

        if ([",", "."].includes(keyboardKey)) {
            return caractere.dot;
        }

        return keyboardKey;
    }

    proccessClick(key) {
        const isANumberKey = this.isNumber(key);
        const isAnOperatorKey = this.isOperator(key);
        const isDotKey = key == caractere.dot;
        const isClearKey = key == caractere.clear;
        const isEqualKey = key == caractere.equal;

        if (isClearKey) {
            this.clearOnNextUse = false;
            this.display.setValue([caractere.zero]).write();
            return;
        }

        if (isEqualKey) {
            if (this.clearOnNextUse || this.display.lastIsAError()) {
                this.clearOnNextUse = false;
                13;
                this.display.setValue([caractere.zero]).write();
                return;
            }
            if (this.display.lastIsAOperator()) {
                return;
            }
            const expressionString = this.display.getValueString();
            let solved = eval(expressionString);
            if (isFinite(solved)) {
                const expression = this.display.getValue();
                solved = parseFloat(solved.toFixed(5));
                this.display.setValue([solved]).writeAsResult();
                if (expression.length > 1) {
                    this.history.push({
                        expression: expressionString,
                        result: solved,
                    });
                }
            } else {
                this.display.setValue([caractere.error]).writeAsResult();
            }
            this.clearOnNextUse = true;
            return;
        }

        if (isANumberKey) {
            if (this.clearOnNextUse) {
                this.clearOnNextUse = false;
                this.display.setValue([key]).write();
                return;
            }
            if (this.display.lastIsAError()) {
                this.display.setValue([key]).write();
                return;
            }
            if (this.display.lastIsANumber()) {
                if (this.display.getLastValue() == caractere.zero) {
                    this.display.setLastValue("");
                }

                const newLastValue = this.display.getLastValue() + key;
                this.display.setLastValue(newLastValue).write();
            } else {
                this.display.addValue(key).write();
            }
            return;
        }

        if (isAnOperatorKey) {
            this.clearOnNextUse = false;
            if (this.display.lastIsAError()) {
                return;
            }
            if (this.display.lastIsAnIncompleteDecimalNumber()) {
                let newLastValue = this.display.getLastValue();
                newLastValue = newLastValue.replace(".", "");
                this.display.setLastValue(newLastValue);
                this.display.addValue(key);
                this.display.write(key);
                return;
            }
            if (this.display.lastIsANumber()) {
                this.display.addValue(key).write();
                return;
            }
            if (this.display.lastIsAOperator()) {
                this.display.setLastValue(key).write();
                return;
            }
        }

        if (isDotKey) {
            if (this.display.lastIsAError()) {
                return;
            }
            if (this.display.lastIsAOperator()) {
                this.display
                    .addValue(`${caractere.zero}${caractere.dot}`)
                    .write();
                return;
            }
            if (!this.display.lastHasADot()) {
                this.clearOnNextUse = false;
                this.display.addValueToLast(key).write();
                return;
            }
        }
    }

    toggleHistory() {
        if (document.getElementById("calculator").style.display == "none") {
            document.getElementById("calculator").style.display = "block";
            document.getElementById("history").style.display = "none";
        } else {
            document.getElementById("calculator").style.display = "none";
            document.getElementById("history").style.display = "flex";
        }
    }
}

new Calculator();
