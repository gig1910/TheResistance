/**
 * @name Cache
 * @property {?Cache} [.]           - Ветка для точки
 * @property {?Cache} [-]           - Ветка для тире
 * @property {?Number} [weight]     - Уже рассчитанный вес последовательности
 */

function work(STD_IN){
	'use strict';

	/**
	 * Номер строки, вычитываемой из файла
	 * @type {Number}
	 * @private
	 */
	var LineN = 0;

	/**
	 * Считываем строку из входного потока\
	 * @returns {string}
	 */
	function readline(){
		return STD_IN[LineN++];
	}

	/**
	 * Записываем строку в выходной поток
	 * @param {*} a
	 */
	function print(a){
		/* jshint -W117 */
		console.info(a);
		/* jshint +W117 */
	}

	/**
	 * Записываем строку в консоль отладки
	 * @param {*} a
	 */
	function printErr(a){
		/* jshint -W117 */
		console.warn(a);
		/* jshint +W117 */
	}

	//***************************************************

	/**
	 * Заданна последовательность
	 * @type {string}
	 * @const
	 */
	var codes = readline();             //Считываем кодограмму (в виде морзянки)

	/**
	 * Длина последовательности
	 * @type {Number}
	 * @const
	 */
	var codesLen = codes.length;

	/**
	 * Морзе-алфавит
	 * @type {Object}
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
	 * Кодируем слово в последовательность морзе
	 * @param {String} word
	 * @returns {String}
	 */
	function code(word){
		var _res = '';
		word     = word || '';
		var wLen = word.length;
		for(var i = 0; i < wLen; i++){
			_res += morzeABC[word[i]] || '';
		}

		return _res;
	}

	/**
	 * Кол-во слов в словаре
	 * @type {Number}
	 * @const
	 */
	var n = parseInt(readline());   //Считываем количество слов в словаре допустимых слов

	/**
	 * @name MorzeWord
	 * @property {string} code      - последовательность Морзе
	 * @property {Number} weight    - Кол-во слов, удовлетворяющих данной последовательности
	 */
	/**
	 * @name MorzeWords
	 * @type {[MorzeWord]|Object}
	 */

	/**
	 * Массив просчитанных кодовых последовательностей Морзе для заданных слов
	 * Первое измерение массива - длина последовательности
	 * Второе измерение массива - Массив самих последовательностей заданной длины
	 * @type {MorzeWords}
	 */
	var morzeRoot = {};

	/**
	 * Счётчик цикла
	 * @type {Number}
	 */
	var i;

	/**
	 * Функция поиска
	 * @param {String} word
	 * @returns {Function}
	 * @private
	 */
	var _findFunc = function(word){
		return function(el){
			Boolean(el && el.code === word);
		};
	};

	//Считываем слова и заполняем массив последовательностей Мрзе
	for(i = 0; i < n; i++){
		/**
		 * Слово
		 * @type {string}
		 */
		var word = readline().toUpperCase();

		/**
		 * Последовательность Морзе
		 * @type {String}
		 */
		var _wordInMorze = code(word);

		/**
		 * Длина последовательности Морзе
		 * @type {Number}
		 * @private
		 */
		var _len = _wordInMorze.length;

		if(!morzeRoot[_len]){
			morzeRoot[_len] = [];
		}

		/**
		 * @type {Array}
		 */
		var words = morzeRoot[_len];

		var _word = null;
		for(var j = 0; j < words.length; j++){
			if(words[j] && words[j].code === _wordInMorze){
				_word = words[j];
				break;
			}
		}

		if(_word){
			_word.words.push(word);
			_word.weight++;

		}else{
			words.push({code: _wordInMorze, words: [word], weight: 1});
		}
	}

	/**
	 * Правильный ответ
	 * @type {number}
	 */
	var RightAnswer = parseInt(readline()) || 0;

	/**
	 * @class Cache
	 * @param codesLen
	 * @constructor
	 */
	var Cache = function(){
		/**
		 * @type {{}}
		 * @private
		 */
		this.cache = {};

		/**
		 * Поиск в кеше
		 * @param {Number} pos
		 * @returns {?Number}
		 */
		this.findInCache = function(pos){
			/**
			 * @type {Cache}
			 * @private
			 */
			var _tmp = this.cache;
			var i    = pos;

			while(_tmp && i < codesLen){ //Ищёи пока либо есть куда идти, либо достигли конца слова (последовательности поиска)
				if(_tmp && _tmp.hasOwnProperty(codes[i])){
					_tmp = _tmp[codes[i]];
					i++;

				}else{
					_tmp = null;
				}
			}

			return _tmp && _tmp.weight;
		};

		/**
		 * Сохранение в кеш
		 * @param {Number} pos
		 * @param {Number} weight
		 */
		this.putInCache = function(pos, weight){
			var _tmp = this.cache;
			var i    = pos;
			while(i < codesLen){
				if(!_tmp){
					_tmp = {};
				}

				if(!_tmp[codes[i]]){
					_tmp[codes[i]] = {};
				}

				_tmp = _tmp[codes[i]];
				i++;
			}

			_tmp.weight = weight;
		};

	};

	/**
	 * Кеш проверенных вариантов
	 * @type {Cache}
	 */
	var cache = new Cache();

	/**
	 * Декодируем последовательность морзе в список допустимых слов
	 * @param {Number} pos      - номер символа, с которого перебираем последовательность
	 * @param {Number} weight   - кол-во решений (по совпадающим последовательностям слов)
	 */
	function decode(pos, weight){

		var _cacheWeight = cache.findInCache(pos); //Ищем в кеше.
		if(_cacheWeight > 0){
			answer = answer + (weight * _cacheWeight);
			return _cacheWeight; //Нашли в кеше. Возвращаем этот вариант

		}else{
			//Поиск в кеше не удался. Определяем слова и ищем их последовательно
			for(var code in morzeRoot){
				//Проход по главному циклу (в теории проход в сторону увеличения последовательностей, что позволит оптимизировать кол-во проходов)
				if(morzeRoot.hasOwnProperty(code)){
					var _morzeNode = morzeRoot[code];
					if(_morzeNode){
						var _code = parseInt(code);
						var _text = codes.substr(pos, _code); //Выделяем из входной последовательности строку, размером с проверяемые слова

						if(_text.length < _code){
							//Последовательность меньше длины слов. Выходим. Дальше проверять нет смысла. Все дальнейшие слова, если они есть, ещё длинее
							return;
						}

						for(var j = 0; j < _morzeNode.length; j++){ //Проходимся по всем словам
							if(_morzeNode[j].code === _text){   //Текст совпал
								if((pos + _code) === codesLen){ //У нас длина слова равна длине кодограммы
									// Это решение
									answer = answer + (weight * _morzeNode[j].weight);
									// cache.putInCache(pos, _morzeNode[j].weight);
									return _morzeNode[j].weight;    //Отдаём назад вес найденного слова. Надо для кеширования ответа
								}

								//Совпало, но ещё не ответ. Рекурсивно спускаемся дальше
								var _weight = decode(
									pos + _code,                    //Смещаемся на длину найденного слова
									weight * _morzeNode[j].weight   //Вычисляем вес решения
								);

								if(!isNaN(_weight)){    //Назад вернулся ответ. Кешируем проверенную последовательность
									cache.putInCache(pos, _weight * _morzeNode[j].weight);
								}
							}
						}
					}
				}
			}
		}
	}

//**********************************


	/**
	 * Счётчик вариантов
	 * @type {Number}
	 */
	var answer = 0;

	var _tStart = (new Date()).getTime();

	//Ищем ответы
	decode(0, 1);

	var _tExecute = new Date((new Date()).getTime() - _tStart).toISOString().replace(/.*T(.*)Z/, '$1');

	//Выводим ответы
	print(answer);

	console.info((answer === RightAnswer ? 'SUCCESS' : 'FAILED: ' + RightAnswer) + '  --  ' + _tExecute);
}

//***************************************************************
var fs         = require('fs');
var _testNames = [/*'test1', 'test2', 'test3', */'test4'];

for(var i = 0; i < _testNames.length; i++){
	var data = fs.readFileSync(_testNames[i] + '.txt', 'utf8');
	work(data.split('\r\n'));
}