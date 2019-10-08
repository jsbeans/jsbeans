/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name:'JSB.Text.Translit',
	$singleton: true,
	
	tblCL: {
		'а': {'a': 1},
		'ндр$': {'nder': 1, 'ndr': 0.8},
		'б': {'b': 1},
		'в': {'v': 1, 'w': 0.7},
		'в$': {'v': 1, 'w': 0.4, 'ff': 0.5},
		'г': {'g': 1, 'h': 0.4, 'gu':0.1},
		'гв': {'gv': 0.8, 'gw': 0.6, 'gu':1},
		'гз': {'gz':1, 'x':0.3},
		'д': {'d': 1},
		'дж': {'dzh': 0.8, 'j':1, 'g':0.2},
		'е': {'e':1, 'ye':0.3, 'je':0.2, 'ie':0.1},
		'ё': {'e':0.7, 'yo':1, 'io':0.8, 'ye':0.1, 'ie':0.1, 'jo':0.7, 'je':0.1},
		'ж': {'zh':0.8, 'g':1, 'j':0.9},
		'з': {'z':1, 's':0.3},
		'и': {'i':1, 'y':0.5},
		'ия': {'ia':1, 'iya':0.8, 'ija':0.7},
		'й': {'y':1, 'i':0.8},
		'ий$': {'y':0.8, 'iy':1, 'i':0.5, 'ii':0.3},
		'ый$': {'y':0.8, 'iy':1, 'i':0.5, 'ii':0.3},
		'к': {'k':1, 'c':0.6, 'ch':0.3},
		'викт': {'vikt':0.8, 'vict':1},
		'кс': {'ks':0.9, 'x':1},
		'кв': {'kv':0.8, 'kw':0.7, 'qu':1},
		'л': {'l':1, 'll':0.3},
		'м': {'m':1},
		'н': {'n':1},
		'о': {'o':1},
		'п': {'p':1, 'pp':0.2},
		'^п': {'p':1, 'pp':0.1},
		'п$': {'p':1, 'pp':0.8},
		'липп$': {'lip':1, 'lipp':0.8},
		'р': {'r':1, 'rr':0.1},
		'с': {'s':1, 'c':0.3, 'ss':0.2},
		'^с': {'s':1, 'c':0.2, 'ss':0.1},
		'с$': {'s':1, 'c':0.3, 'ss':0.7},
		'т': {'t':1, 'th':0.3},
		'у': {'u':1, 'oo':0.3, 'ou':0.2},
		'ф': {'f':1, 'ph':0.8},
		'^ф': {'f':0.8, 'ph':1},
		'х': {'kh':0.8, 'h':1},
		'ц': {'ts':1, 'tz':0.6, 'c':0.7},
		'ч': {'ch':1, 'tch':0.2},
		'ш': {'sh':1, 'ch':0.2},
		'щ': {'shch':0.8, 'sch':1},
		'ь': {'':1, '\'':0.8},
		'ъ': {'':1, '\'':0.8},
		'ы': {'y':1, 'i':0.7},
		'э': {'e':1, 'a':0.2},
		'^э': {'e':1, 'oe': 0.8, 'a':0.2},
		'ю': {'yu':0.9, 'u':1, 'ju':0.9, 'iu':0.2},
		'я': {'ya':1, 'ia':0.6, 'a':0.3, 'ja':0.7}
	},
	tblLC : {
		"a" : { "а" : 1, "э" : 0.8, "я" : 0.1 },
		"nder$" : { "ндр" : 1 },
		"ndr$" : { "ндр" : 1 },
		"b" : { "б" : 1 },
		"v" : { "в" : 1 },
		"w" : { "в" : 1 },
		"v$" : { "в" : 1 },
		"w$" : { "в" : 1 },
		"ff$" : { "в" : 1 },
		"g" : { "г" : 1, "дж" : 0.2, "ж" : 0.8 },
		"h" : { "г" : 0.4, "х" : 1 },
		"gu" : { "г" : 0.1, "гв" : 1 },
		"x" : { "гз" : 0.2, "кс" : 1 },
		"d" : { "д" : 1 },
		"dzh" : { "дж" : 1 },
		"j" : { "дж" : 1, "ж" : 0.8 },
		"e" : { "е" : 1, "ё" : 0.1, "э" : 0.8 },
		"^e" : { "е" : 0.9, "ё" : 0.1, "э" : 1 },
		"ye" : { "е" : 1, "ё" : 0.1 },
		"je" : { "е" : 1, "ё" : 0.1 },
		"ie" : { "е" : 0.5, "ие": 1, "йе": 0.4, "ё" : 0.1 },
		"yo" : { "ё" : 1 },
		"^yo": { "ё" : 1, "йо": 0.9 },
		"io" : { "ио": 1, "ё" : 0.8 },
		"jo" : { "ё" : 1 },
		"^jo" : { "ё" : 1, "йо": 0.9 },
		"zh" : { "ж" : 1 },
		"z" : { "з" : 1 },
		"s" : { "з" : 0.3, "с" : 1 },
		"i" : { "и" : 1, "й" : 0.6, "ы" : 0.7 },
		"y" : { "и" : 0.6, "й" : 0.3, "ы" : 1 },
		"y$" : { "и" : 0.6, "й" : 1, "ы" : 0.7, "ий" : 0.8, "ый" : 0.8 },
		"ia" : { "ия" : 1, "я" : 0.6 },
		"iya" : { "ия" : 1 },
		"ija" : { "ия" : 1 },
		"iy$" : { "ий" : 1, "ый" : 0.9 },
		"i$" : { "и": 1, "й": 0.7, "ий" : 0.6, "ый" : 0.5 },
		"ii$" : { "ий" : 1, "ый" : 0.9 },
		"k" : { "к" : 1 },
		"vict" : { "викт" : 1},
		"c" : { "к" : 0.8, "с" : 0.6, "ц" : 1 },
		"ch" : { "к" : 0.3, "ч" : 1, "ш" : 0.2 },
		"qu" : { "кв" : 1 },
		"l" : { "л" : 1 },
		"ll$" : { "л" : 1, "лл": 0.8 },
		"m" : { "м" : 1 },
		"n" : { "н" : 1 },
		"o" : { "о" : 1 },
		"p" : { "п" : 1 },
		"pp" : { "п" : 1, "пп": 0.8 },
		"p$" : { "п" : 1, "пп": 0.8 },
		"lip$" : { "лип" : 0.8, "липп": 1 },
		"^pp" : { "п" : 1 },
		"r" : { "р" : 1 },
		"rr" : { "р" : 1, "рр": 0.8 },
		"r$" : { "р" : 1, "рр": 0.8 },
		"t" : { "т" : 1 },
		"th" : { "т" : 1, 'з': 0.8 },
		"u" : { "у" : 1, "ю" : 0.9 },
		"oo" : { "у" : 1, 'оо': 0.8 },
		"ou" : { "оу": 1, "у" : 0.2 },
		"f" : { "ф" : 1 },
		"ph" : { "ф" : 1 },
		"kh" : { "х" : 1 },
		"ts" : { "ц" : 1 },
		"tz" : { "ц" : 1 },
		"tch" : { "ч" : 1, "тщ": 0.5 },
		"sh" : { "ш" : 1 },
		"shch" : { "щ" : 1 },
		"sch" : { "щ" : 1 },
		"'" : { "ь" : 1, "ъ" : 0.8 },
		"yu" : { "ю" : 0.9 },
		"ju" : { "ю" : 0.9 },
		"iu" : { "иу": 1, "ю" : 0.9 },
		"ya" : { "я" : 1 },
		"ja" : { "я" : 1 }
	},
	
	$constructor: function(){
		$base();
		this.generateLC();
	},
	
	generateLC: function(){
		for(var r in this.tblCL){
			for(var e in this.tblCL[r]){
				if(e.length === 0){
					continue;
				}
				var cyr = r.match(/([А-яЁё]+)/i)[1];
				var lat = r.replace(/([А-яЁё]+)/gi, e);
				if(!this.tblLC[lat]){
					this.tblLC[lat] = {};
				}
				this.tblLC[lat][cyr] = this.tblCL[r][e];
			}
		}
/*			
			// fixup weights
			for(var e in this.tblLC){
				var sum = 0;
				for(var r in this.tblLC[e]){
					sum += this.tblLC[e][r];
				}
				for(var r in this.tblLC[e]){
					this.tblLC[e][r] /= sum;
				}
			}
*/			
	},
	
	doTranslit: function(str, tbl, takeFirst){
		var order = [];
		if(!takeFirst){
			takeFirst = 5;
		}
		for(var i in tbl){
			order.push(i);
		}
		order.sort(function(a, b){
			return b.length - a.length;
		});
		var tokens = str.split(/\s+/gi);
		var result = {results:[], tokens:{}};
		for(var t in tokens){
			var variants = [{value: tokens[t], w: 0, rCnt: 0}];
			while(true){
				var bReplace = false;
				for(var i in order){
					var newVars = [];
					var rx = new RegExp(order[i], 'i');
					var rpVals = tbl[order[i]];
					if(!rx.test(variants[0].value)){
						continue;
					}
					bReplace = true;
					for(var j in variants){
						var curVar = variants[j];
						for(var rpVal in rpVals){
							newVars.push({
								value: curVar.value.replace(rx, rpVal),
								w: curVar.w + rpVals[rpVal],
								rCnt: curVar.rCnt + 1
							});
						}
					}
					
					variants = newVars;
					
					variants.sort(function(a, b){
						return b.w - a.w;
					});
					
					if(takeFirst){
						if(variants.length > takeFirst){
							variants = variants.slice(0, takeFirst);
						}
					}
				}
				if(!bReplace){
					break;
				}
			}
			
			for(var i in variants){
				variants[i].w /= variants[i].rCnt
				delete variants[i].rCnt;
			}
			
			variants.sort(function(a, b){
				return b.w - a.w;
			});
			
			if(takeFirst){
				if(variants.length > takeFirst){
					variants = variants.slice(0, takeFirst);
				}
			}
			
			result.tokens[tokens[t]] = variants;
		}
		
		// generate permutations
		var tokenState = [];
		for(var i in tokens){
			tokenState.push({token: tokens[i], idx: 0});
		}
		
		var nextState = function(){
			for(var i in tokenState){
				tokenState[i].idx++;
				if(tokenState[i].idx < result.tokens[tokenState[i].token].length){
					return true;
				}
				tokenState[i].idx = 0;
			}
			return false;
		};
		
		do {
			var str = '';
			var w = 0;
			for(var i in tokenState){
				if(str.length > 0){
					str += ' ';
				}
				var token = tokenState[i].token;
				var idx = tokenState[i].idx;
				str += result.tokens[token][idx].value;
				w += result.tokens[token][idx].w;
			}
			result.results.push({value: str, w: w / tokenState.length});
		} while(nextState());
		
		result.results.sort(function(a, b){
			return b.w - a.w;
		});
		
		return result;
	},
	
	l2c: function(str, takeFirst){
		return this.doTranslit(str, this.tblLC, takeFirst);
	},
	
	c2l: function(str, takeFirst){
		return this.doTranslit(str, this.tblCL, takeFirst);
	},
	
	perform: function(str, takeFirst){
		if(this.lang(str) == 'cyr'){
			return this.c2l(str, takeFirst);
		} else {
			return this.l2c(str, takeFirst);
		}
	},
	
	lang: function(str){
		var lm = str.match(/\w/gi);
		var cm = str.match(/[А-яёЁ]/gi);
		if((lm && !cm) || (lm && lm.length > cm.length)){
			return 'lat';
		} else if((cm && !lm) || (cm && cm.length > lm.length)){
			return 'cyr';
		} else {
			return null;
		}
	},
	
	match: function(query, result, takeFirst){
		if(!takeFirst){
			takeFirst = 0;
		}
		// split to tokens
		var queryTokens = query.split(/\s+/gi);
		var resultTokens = result.split(/\s+/gi);
		
		for(var q = queryTokens.length - 1; q >= 0; q-- ){
			var queryToken = queryTokens[q].toLowerCase();
			var bEqual = false;
			for(var r = resultTokens.length - 1; r >= 0; r-- ){
				var resultToken = resultTokens[r].toLowerCase();
				var qVars = [];
				var rVars = [];
				// detect query lang
				var qLang = this.lang(queryToken);
				var rLang = this.lang(resultToken);
				if(qLang == rLang){
					qVars.push(queryToken);
					rVars.push(resultToken);
				} else if(qLang == 'cyr'){
					var tRes = this.c2l(queryToken, takeFirst).tokens[queryToken];
					for(var i in tRes){
						qVars.push(tRes[i].value);
					}
					rVars.push(resultToken);
				} else {
					var tRes = this.c2l(resultToken, takeFirst).tokens[resultToken];
					for(var i in tRes){
						rVars.push(tRes[i].value);
					}
					qVars.push(queryToken);
				}
				
				// compare variants
				
				for(var i in qVars){
					for(var j in rVars){
						if(qVars[i] == rVars[j]){
							bEqual = true;
							break;
						}
					}
					if(bEqual){
						break;
					}
				}
				
				if(bEqual){
					// remove q and r from arrays
					resultTokens.splice(r, 1);
					queryTokens.splice(q, 1);
					break;
				}
			}
		}
		if(queryTokens.length == 0 || resultTokens.length == 0){
			return true;
		}
		
		return false;
	}
}