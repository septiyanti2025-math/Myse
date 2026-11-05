const result = document.getElementById("result");
const history = document.getElementById("history");
const buttons = document.querySelectorAll("button");

let expression = "";
let isFinished = false;

function updateDisplay() {
    result.value = expression || "0";
}

function calculate() {
    if (!expression) return;

    try {
        // Memastikan ekspresi hanya berisi karakter matematika
        if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
            throw new Error("Ekspresi tidak valid");
        }

        const answer = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!Number.isFinite(answer)) {
            throw new Error("Hasil tidak valid");
        }

        history.textContent = expression + " =";

        expression = String(
            Number(answer.toPrecision(12))
        );

        updateDisplay();
        isFinished = true;

    } catch {
        result.value = "Error";
        expression = "";
        isFinished = true;
    }
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (action === "clear") {
            expression = "";
            history.textContent = "";
            isFinished = false;
            updateDisplay();
            return;
        }

        if (action === "delete") {
            expression = expression.slice(0, -1);
            updateDisplay();
            return;
        }

        if (action === "calculate") {
            calculate();
            return;
        }

        if (action === "percent") {
            const match = expression.match(
                /(\d*\.?\d+)$/
            );

            if (match) {
                const number = Number(match[0]) / 100;

                expression = expression.slice(
                    0, -match[0].length
                ) + number;

                updateDisplay();
            }
            return;
        }

        if (action === "sign") {
            if (expression) {
                expression = expression.startsWith("-")
                    ? expression.slice(1)
                    : "-" + expression;

                updateDisplay();
            }
            return;
        }

        if (value !== undefined) {
            if (isFinished) {
                expression = "";
                history.textContent = "";
                isFinished = false;
            }

            expression += value;
            updateDisplay();
        }
    });
});

// Mendukung penggunaan keyboard
document.addEventListener("keydown", event => {
    if (/^[0-9.+\-*/]$/.test(event.key)) {
        expression += event.key;
        isFinished = false;
        updateDisplay();
    }

    if (event.key === "Enter") {
        calculate();
    }

    if (event.key === "Backspace") {
        expression = expression.slice(0, -1);
        updateDisplay();
    }

    if (event.key === "Escape") {
        expression = "";
        history.textContent = "";
        updateDisplay();
    }
});
