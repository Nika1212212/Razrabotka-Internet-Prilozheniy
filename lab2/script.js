window.onload = function() { 
    // Оперативная память калькулятора (Пункт 3 методички)
    let a = '';                   // Буфер первого операнда
    let b = '';                   // Буфер второго операнда
    let selectedOperation = null; // Буфер выбранной бинарной операции
    let expressionResult = '';    // Промежуточный результат расчета

    // Доступ к HTML-дисплею по ID (Пункт 2 методички)
    const outputElement = document.getElementById("result");
    
    // Получение коллекции всех цифровых кнопок по селектору атрибута начала ID
    const digitButtons = document.querySelectorAll('[id^="btn_digit_"]');

    // Функция динамического масштабирования шрифта под длину текста (Полная защита от троеточий)
    function adjustFontSize(text) {
        let length = text.toString().length;
        
        if (length > 14) {
            outputElement.style.fontSize = "1.1rem"; // Максимальное сжатие для гигантских строк
        } else if (length > 11) {
            outputElement.style.fontSize = "1.35rem"; // Среднее сжатие
        } else if (length > 8) {
            outputElement.style.fontSize = "1.6rem";  // Легкое сжатие
        } else {
            outputElement.style.fontSize = "1.9rem";  // Стандартный крупный шрифт Яндекса
        }
    }

    // Вспомогательная функция для динамического округления чисел строго до 10 значащих цифр
    function formatOutputValue(value) {
        let num = parseFloat(value);
        if (isNaN(num)) return value;
        
        // Жесткий лимит на максимальное количество отображаемых цифр
        const MAX_DIGITS = 10;

        // Вычисляем длину целой части числа (без знака минус)
        let integralPartLength = Math.floor(Math.abs(num)).toString().length;
        
        // 1. Если целая часть сама по себе превышает лимит экрана
        if (integralPartLength >= MAX_DIGITS) {
            return Math.round(num).toString().slice(0, MAX_DIGITS);
        }

        // 2. Если это дробное число (округление хвоста под размер экрана)
        if (num % 1 !== 0) {
            let availableDigitsForFraction = MAX_DIGITS - integralPartLength;

            if (availableDigitsForFraction > 0) {
                let fixedStr = num.toFixed(availableDigitsForFraction);
                return parseFloat(fixedStr).toString(); // Удаляем хвостовые системные нули
            } else {
                return Math.round(num).toString();
            }
        }
        
        return num.toString();
    }

    // Универсальная функция одновременного вывода данных и автоматического подбора размера букв
    function updateDisplay(displayValue) {
        let formatted = formatOutputValue(displayValue);
        outputElement.innerHTML = formatted;
        adjustFontSize(formatted);
    }

    // Функция обработки ввода цифр, точки и спец-символов (Шаг 3)
    function onDigitButtonClicked(digit) {
        if (!selectedOperation) {
            // Защита ввода первого числа от превышения 10 цифр
            let digitsOnly = a.replace('.', '');
            if (digitsOnly.length >= 10 && digit !== '.' && digit !== '000') return;
            if (digit === '000' && digitsOnly.length > 7) return;

            if (digit === '000') {
                if (a !== '' && a !== '0') a += '000';
            } else if (digit === '.') {
                if (!a.includes('.')) a += (a === '' ? '0.' : '.');
            } else {
                if (a === '0') a = digit;
                else a += digit;
            }
            updateDisplay(a === '' ? '0' : a);
        } else {
            // Защита ввода второго числа от превышения 10 цифр
            let digitsOnlyB = b.replace('.', '');
            if (digitsOnlyB.length >= 10 && digit !== '.' && digit !== '000') return;
            if (digit === '000' && digitsOnlyB.length > 7) return;

            if (digit === '000') {
                if (b !== '' && b !== '0') b += '000';
            } else if (digit === '.') {
                if (!b.includes('.')) b += (b === '' ? '0.' : '.');
            } else {
                if (b === '0') b = digit;
                else b += digit;
            }
            updateDisplay(b === '' ? '0' : b);
        }
    }

    // Регистрация кликов для всех цифровых плиток через итератор forEach (Шаг 4 методички)
    digitButtons.forEach(button => {
        button.onclick = function() {
            const digitValue = button.innerHTML;
            onDigitButtonClicked(digitValue);
        };
    });

    // Функция управления бинарными операторами (Поддержка цепочки накапливаемых вычислений)
    function handleOperation(op) {
        if (a === '') return;
        if (a !== '' && b !== '' && selectedOperation) {
            calculateResult();
        }
        selectedOperation = op;
    }

    // Привязка обработчиков событий для арифметических кнопок через свойства элементов
    document.getElementById("btn_op_plus").onclick = () => handleOperation('+');
    document.getElementById("btn_op_minus").onclick = () => handleOperation('-');
    document.getElementById("btn_op_mult").onclick = () => handleOperation('x');
    document.getElementById("btn_op_div").onclick = () => handleOperation('/');

    // 1. Кнопка ПОЛНОЙ мгновенной очистки «AC» (Все буферы сбрасываются в исходное состояние)
    document.getElementById("btn_op_clear_all").onclick = function() {
        a = ''; 
        b = ''; 
        selectedOperation = null; 
        expressionResult = '';
        updateDisplay('0');
    };

    // 2. Операция вычисления процента % (Задание 2 самостоятельной работы)
    document.getElementById("btn_op_percent").onclick = function() {
        if (!selectedOperation) {
            if (a !== '') { a = (parseFloat(a) / 100).toString(); updateDisplay(a); }
        } else {
            if (b !== '') { b = (parseFloat(b) / 100).toString(); updateDisplay(b); }
        }
    };

    // 3. Умная кнопка Backspace на базе клавиши 'C' (Посимвольное удаление через .slice)
    document.getElementById("btn_op_clear").onclick = function() {
        if (selectedOperation && b !== '') {
            b = b.slice(0, -1);
            updateDisplay(b === '' ? '0' : b);
        } else if (!selectedOperation && a !== '') {
            a = a.slice(0, -1);
            updateDisplay(a === '' ? '0' : a);
        } else {
            // Если символов не осталось — дефолтный сброс (Шаг 5 методички)
            a = ''; b = ''; selectedOperation = null; expressionResult = '';
            updateDisplay('0');
        }
    };

    // 4. Запрограммированная операция извлечения квадратного корня √ (Задание 5)
    document.getElementById("btn_op_sqrt").onclick = function() {
        if (a === '') return;
        let val = parseFloat(selectedOperation ? b : a);
        if (val < 0) {
            outputElement.innerHTML = "Ошибка";
            adjustFontSize("Ошибка");
            a = ''; b = ''; selectedOperation = null;
        } else {
            let resNum = Math.sqrt(val);
            let res = resNum.toString();
            if (!selectedOperation) { a = res; updateDisplay(a); } 
            else { b = res; updateDisplay(b); }
        }
    };

    // 5. Операция возведения числа в квадрат x² (Задание 6)
    document.getElementById("btn_op_sqr").onclick = function() {
        if (a === '') return;
        if (!selectedOperation) {
            a = (parseFloat(a) * parseFloat(a)).toString(); updateDisplay(a);
        } else if (b !== '') {
            b = (parseFloat(b) * parseFloat(b)).toString(); updateDisplay(b);
        }
    };

    // 6. Вычисление факториала числа N! через итерационный цикл (Задание 7)
    document.getElementById("btn_op_fact").onclick = function() {
        let val = parseInt(selectedOperation ? b : a);
        if (isNaN(val) || val < 0) return;
        
        // Жесткая верхняя граница для предотвращения переполнения экрана
        if (val > 13) {
            outputElement.innerHTML = "Слишком много";
            adjustFontSize("Слишком много");
            return;
        }
        
        let fact = 1;
        for (let i = 1; i <= val; i++) { fact *= i; }
        
        if (!selectedOperation) { a = fact.toString(); updateDisplay(a); } 
        else { b = fact.toString(); updateDisplay(b); }
    };

    // Главная логика вычисления математического выражения по операторам (Шаг 6 методички)
    function calculateResult() {
        if (a === '' || b === '' || !selectedOperation) return;

        let numA = parseFloat(a);
        let numB = parseFloat(b);

        switch(selectedOperation) {
            case '+': expressionResult = numA + numB; break;
            case '-': expressionResult = numA - numB; break;
            case 'x': expressionResult = numA * numB; break;
            case '/': expressionResult = numB === 0 ? "Ошибка" : numA / numB; break;
            default: return;
        }

        a = expressionResult.toString();
        b = '';
        selectedOperation = null;
        
        updateDisplay(a);
        
        // Синхронизируем буфер памяти 'a' с округленным значением
        a = formatOutputValue(a);
    }

    // Регистрация события клика на кнопку равенства
    document.getElementById("btn_op_equal").onclick = calculateResult;
};
