const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const operators = ["+", "-", "*", "/"];

class Calculator {
  displayElement = null;
  displayValue = "0";
  currentTheme = calculatorTheme.original;

  constructor() {
    this.displayElement = document.getElementById("display");

    

    document.querySelectorAll("#buttons button").forEach((buttonElem) => {
      buttonElem.addEventListener("click", this.proccessClick.bind(this));
    });

    document.addEventListener("keydown", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const name = event.key;
      const code = event.code;

      console.log(name, code);
    });
  }

  getDisplayValue() {
    return this.displayElement.innerText;
  }

  setDisplayValue(text) {
    this.displayElement.innerText = text;
  }

  proccessClick(event) {
    let newDisplayValue = "";
    const currentDisplayValue = this.getDisplayValue();
    const pressedButtonValue = event.target.dataset.value;
    const lastCaractereOnDisaplay = currentDisplayValue.substring(
      currentDisplayValue.length - 1
    );

    if (pressedButtonValue == "AC") {
      this.setDisplayValue("0");
      return;
    }

    if (numbers.includes(pressedButtonValue)) {
      newDisplayValue = currentDisplayValue + pressedButtonValue;
      this.setDisplayValue(newDisplayValue);
      return;
    }

    if (operators.includes(pressedButtonValue)) {
      const isPressedButtonAnOperator = operators.includes(
        lastCaractereOnDisaplay
      );

      if (!isPressedButtonAnOperator) {
        newDisplayValue = currentDisplayValue + pressedButtonValue;
        this.setDisplayValue(newDisplayValue);
      }
      return;
    }

    if (pressedButtonValue == ",") {
      const isLastNumberOnDisplayANumber = numbers.includes(
        lastCaractereOnDisaplay
      );
      if (isLastNumberOnDisplayANumber) {
        newDisplayValue = currentDisplayValue + pressedButtonValue;
        this.setDisplayValue(newDisplayValue);
      }
      return;
    }

    if (pressedButtonValue == "=") {
      const isLastNumberOnDisplayANumber = numbers.includes(
        lastCaractereOnDisaplay
      );

      if (isLastNumberOnDisplayANumber) {
        const result = eval(currentDisplayValue);
        this.setDisplayValue(result);
      }
      return;
    }
  }
}

new Calculator();
