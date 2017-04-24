function work(STD_IN) {
    /**
     * Номер строки, вычитываемой из файла
     * @type {number}
     * @private
     */
    var LineN = 0;

    /**
     * Считываем строку из входного потока\
     * @returns {string}
     */
    function readline() {
        return STD_IN[LineN++];
    }

    /**
     * Записываем строку в выходной поток
     * @param {*} a
     */
    function print(a) {
        console.info(a);
    }

    /**
     * Записываем строку в консоль отладки
     * @param {*} a
     */
    function printErr(a) {
        console.warn(a);
    }

    //***************************************************

    /**
     * Морзе-алфавит
     * @type {{A: string, B: string, C: string, D: string, E: string, F: string, G: string, H: string, I: string, J: string, K: string, L: string, M: string, N: string, O: string, P: string, Q: string, R: string, S: string, T: string, U: string, V: string, W: string, X: string, Y: string, Z: string}}
     * @const
     */
    var morzeABC = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..'
    };

    /**
     * Счётчик вариантов
     * @type {Number}
     */
    var answer = 0;

    /**
     * @name MorzeTree
     * @property {?MorzeTree} "." - Ветка для точки
     * @property {?MorzeTree} "-" - Ветка для тире
     * @property {String} word   - Закодированное слово
     */

    /**
     * Дерево вариантов кодировки слов из словаря в бинарном дереве
     * Есть две ветки и признак окончания конкретного слова
     * @type {MorzeTree}
     */
    var morzeRoot = {};

    /**
     * Кодируем слово в последовательность морзе
     * @param {String} word
     * @returns {?String}
     */
    function code(word) {
        var _res = '';
        word = word || '';
        var wLen = word.length;
        for (var i = 0; i < wLen; i++) {
            _res += morzeABC[word[i]] || '';
        }

        return _res;
    }

    var codes = readline();         //Считываем кодограмму (в виде морзянки)
    var n = parseInt(readline());   //Считываем количество слов в словаре допустимых слов

    /**
     * Минимальный размер слова
     * @type {number}
     */
    var minWord = 9999999;

    //Разбираем словарик на дерево слов морзе
    for (var i = 0; i < n; i++) {
        var word = readline().toUpperCase();
        var _wordInMorze = code(word);

        var _morzeNode = morzeRoot;                         //Устанавливаемся на корень и строим ветку для слова
        for (var j = 0; j < _wordInMorze.length; j++) {
            if (!_morzeNode[_wordInMorze[j]]) {
                _morzeNode[_wordInMorze[j]] = {};
            }
            _morzeNode = _morzeNode[_wordInMorze[j]];
        }

        minWord = Math.min(minWord, j);         //Запоминаем размер самого маленького слова (попытка ещё больше соптимизироваться :( )

        if (_morzeNode.word) {
            printErr('Кодовая последовательность слова "' + word + '" совпадает с кодовой последовательностью слова "' + _morzeNode.word + '"');
            printErr('Учитываться будет только первое слово "' + _morzeNode.word + '"');
            printErr('Но при совпадении кол-во вариантов посчитаем +1');
            _morzeNode.incCount++;

        } else {
            _morzeNode.word = word;                         //Записываем построенное слово. Это же у нас и признак того что такая последовательность это терминатор
            _morzeNode.incCount = 1;
        }
    }

    /**
     * Правильный ответ
     * @type {number}
     */
    var RightAnswer = parseInt(readline()) || 0;

    var codesLen = codes.length - 1;

    var _timestampStart = (new Date()).getTime();

    /**
     * Декодируем последовательность морзе в список допустимых слов
     * @param {number} i - номер символа, с которого перебираем последовательность
     * @param {number} lev - уровень рекурсии
     */
    function decode(i, lev) {
        if (codesLen < minWord) {
            return;             //Остаток меньше любого слова. Выходим. Но это получается не совсем потоковый алгоритм :)
        }

        var _morzeNode = morzeRoot;                             //В начале каждого входа устанавливаемся на корень дерева слов (у нас слова могут быть повторяться :) )

        while (i <= codesLen) {
            if (_morzeNode.hasOwnProperty(codes[i])) {
                _morzeNode = _morzeNode[codes[i]];                  //Получаем ветку для текущего символа
                var _word = _morzeNode.hasOwnProperty('word') && _morzeNode.word;

                if (_morzeNode) {                       //Ветка есть. Проверяем её
                    if (_word) {
                        if (i === codesLen) {   //У нас конец кодограммы и конец слова. Это вариант ответа
                            answer = answer +(_morzeNode.incCount || 1);   //Увеличиваем счётчик и выходим из рекурсии. В данной итерации нам ловить нечего
                            if ((answer % 10000) === 0) {
                                //Расчёт оставщегося времени
                                var _timeMS = (new Date()).getTime() - _timestampStart; //Кол-во прошедших мс
                                var _prc = parseFloat((answer / RightAnswer * 100).toFixed(6));
                                if(_prc > 0){
                                    var _calcTime = (_timeMS * 100 / _prc);
                                    var _d = (new Date(_calcTime)).toISOString().replace(/\d{4}-\d{2}-(\d{2})T(.*)Z/, '$1d $2');
                                    var _lastT = (new Date(_timeMS)).toISOString().replace(/\d{4}-\d{2}-\d{2}T(.*)Z/, '$1');

                                    printErr(lev + '  :  ' + answer + ' (' + _prc.toFixed(6) + '%) last time: ' + _lastT + '$ estimated time: ' + _d);
                                }else{
                                    printErr(lev + '  :  ' + answer + ' (' + _prc + ')');
                                }
                            }
                            return;

                        } else {
                            decode(i + 1, lev + 1);                //У нас есть вариант подходящего слова. Вызываем рекурсию с этого места. Потом продолжим перебирать варианты
                        }
                    }

                    i++;                                //Переход к следующему символу

                } else {
                    return;                             //Вариантов продолжение бянкета больше нет. Выходим.
                }

            } else {
                return;                                 //Вариантов продолжение бянкета больше нет. Выходим.
            }
        }
    }

    //Ищем ответы
    decode(0, 1);

    //Выводим ответы
    print(answer);

    console.info(answer === RightAnswer ? 'SUCCESS' : 'FAILED');
}

//***************************************************************
var fs = require('fs');
var _testNames = ['test1', 'test2', 'test3', 'test4'];

for (var i = 0; i < _testNames.length; i++) {
    var data = fs.readFileSync(_testNames[i] + '.txt', 'utf8');
    work(data.split('\r\n'));
}