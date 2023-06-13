let displayValue = "0"

let $display = document.getElementById("display")

document.querySelectorAll("#buttons button").forEach(buttonElem => {
    buttonElem.addEventListener("click", () => {
        const newDisplayValue = getDisplayValue() + "a"
        setDisplayValue(newDisplayValue)
    })
})

function getDisplayValue() {
    return $display.innerText
}

function setDisplayValue(text) {
    displayValue = text
    $display.innerText = text
}