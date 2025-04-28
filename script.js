// script.js

const display = document.getElementById('display');
const historyList = document.getElementById('historyList');
const buttons = document.querySelectorAll('.btn');
const darkToggle = document.getElementById('darkModeToggle');
const themeToggle = document.getElementById('themeToggle');
const equalsBtn = document.getElementById('equals');
const deleteBtn = document.getElementById('delete');
const clearBtn = document.getElementById('clear');
const sqrtBtn = document.getElementById('sqrt');
const logBtn = document.getElementById('log');
const powBtn = document.getElementById('pow');
const expBtn = document.getElementById('exp');
const absBtn = document.getElementById('abs');
const memAddBtn = document.getElementById('memAdd');
const memSubBtn = document.getElementById('memSub');
const memRecBtn = document.getElementById('memRec');
const memClearBtn = document.getElementById('memClear');
const toggleDegRad = document.getElementById('toggleDegRad');
const clearHistoryBtn = document.getElementById('clearHistory');

let memory = 0;
let degreeMode = true;
let history = [];
let isResultDisplayed = false;

// THEME CUSTOMIZER
const themes = [
  {
    '--primary-color': '#667eea',
    '--secondary-color': '#764ba2',
    '--accent-color': '#ff7b00'
  },
  {
    '--primary-color': '#11998e',
    '--secondary-color': '#38ef7d',
    '--accent-color': '#2c3e50'
  },
  {
    '--primary-color': '#fc466b',
    '--secondary-color': '#3f5efb',
    '--accent-color': '#ffb347'
  }
];

let currentTheme = 0;

themeToggle.addEventListener('click', () => {
  currentTheme = (currentTheme + 1) % themes.length;
  const theme = themes[currentTheme];
  for (const variable in theme) {
    document.documentElement.style.setProperty(variable, theme[variable]);
  }
});

// DARK MODE
darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// BUTTON CLICK → ADD VALUE
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    if (value) {
      if (isResultDisplayed) {
        display.value = '';
        isResultDisplayed = false;
      }
      if (value === "sin(" || value === "cos(" || value === "tan(") {
        display.value += value;
      }
      else if (value === "Math.PI") {
        display.value += "3.1415926535"; // real Pi number
      }
      else if (value === "Math.E") {
        display.value += "2.7182818284"; // real E number
      }
      else {
        display.value += value;
      }
    }
    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), 150);
  });
});

// MAIN CALCULATION
equalsBtn.addEventListener('click', () => {
  try {
    let input = display.value;
    input = autoCloseParenthesis(input);
    const result = evaluateExpression(input);
    addToHistory(`${input} = ${result}`);
    display.value = result;
    isResultDisplayed = true;
  } catch {
    display.value = "Error";
  }
});

// Automatically close open "(" parentheses
function autoCloseParenthesis(input) {
  const openCount = (input.match(/\(/g) || []).length;
  const closeCount = (input.match(/\)/g) || []).length;
  return input + ')'.repeat(openCount - closeCount);
}

// Evaluate Expression
function evaluateExpression(expr) {
  expr = expr.replace(/sin|cos|tan/g, match => `Math.${match}`);
  if (degreeMode) {
    expr = expr.replace(/Math\.sin\(([^)]+)\)/g, 'Math.sin(($1)*Math.PI/180)');
    expr = expr.replace(/Math\.cos\(([^)]+)\)/g, 'Math.cos(($1)*Math.PI/180)');
    expr = expr.replace(/Math\.tan\(([^)]+)\)/g, 'Math.tan(($1)*Math.PI/180)');
  }
  const result = Function('"use strict";return (' + expr + ')')();
  return formatResult(result);
}

// FORMAT RESULT (Smart Rounding)
function formatResult(num) {
  if (isNaN(num)) return "Error";
  if (Math.abs(num) > 1e10 || Math.abs(num) < 1e-5) {
    return num.toExponential(4);
  } else {
    return Math.round(num * 1000000) / 1000000;
  }
}

// MEMORY FUNCTIONS
memAddBtn.addEventListener('click', () => {
  if (!isNaN(parseFloat(display.value))) {
    memory += parseFloat(display.value);
  }
});

memSubBtn.addEventListener('click', () => {
  if (!isNaN(parseFloat(display.value))) {
    memory -= parseFloat(display.value);
  }
});

memRecBtn.addEventListener('click', () => {
  display.value = memory;
});

memClearBtn.addEventListener('click', () => {
  memory = 0;
});

// SPECIAL FUNCTIONS
clearBtn.addEventListener('click', () => {
  display.value = '';
  isResultDisplayed = false;
});

deleteBtn.addEventListener('click', () => {
  display.value = display.value.slice(0, -1);
});

sqrtBtn.addEventListener('click', () => {
  try {
    display.value = formatResult(Math.sqrt(eval(display.value)));
  } catch {
    display.value = "Error";
  }
});

logBtn.addEventListener('click', () => {
  try {
    display.value = formatResult(Math.log10(eval(display.value)));
  } catch {
    display.value = "Error";
  }
});

powBtn.addEventListener('click', () => {
  display.value += "**";
});

expBtn.addEventListener('click', () => {
  try {
    display.value = formatResult(Math.exp(eval(display.value)));
  } catch {
    display.value = "Error";
  }
});

absBtn.addEventListener('click', () => {
  try {
    display.value = formatResult(Math.abs(eval(display.value)));
  } catch {
    display.value = "Error";
  }
});

// DEGREE/RADIAN TOGGLE
toggleDegRad.addEventListener('click', () => {
  degreeMode = !degreeMode;
  toggleDegRad.textContent = degreeMode ? "Deg" : "Rad";
});

// HISTORY FUNCTIONS
function addToHistory(entry) {
  history.unshift(entry);
  if (history.length > 10) history.pop();
  historyList.innerHTML = history.map(h => `<div>${h}</div>`).join('');
}

clearHistoryBtn.addEventListener('click', () => {
  history = [];
  historyList.innerHTML = '';
});

// KEYBOARD SUPPORT
document.addEventListener('keydown', (e) => {
  if (e.key.match(/[0-9+\-*/.^()]/)) {
    if (isResultDisplayed) {
      display.value = '';
      isResultDisplayed = false;
    }
    display.value += e.key;
  } else if (e.key === 'Enter') {
    equalsBtn.click();
  } else if (e.key === 'Backspace') {
    deleteBtn.click();
  } else if (e.key === 'Escape') {
    clearBtn.click();
  }
});
