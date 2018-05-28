{
	$name: 'JSB.Crypt.MD5',
	$singleton: true,
	
	$client: {
		$constructor: function(){
			(function(){

				// Credit: Joseph Myers
				// http://www.myersdaily.org/joseph/javascript/md5-text.html
				function add32(a, b) {
					return (a + b) & 0xFFFFFFFF;
				}


				var i;
				var MD5 = { 

					// Credit: Joseph Myers:
					// http://www.myersdaily.org/joseph/javascript/md5-text.html
					// XXX reduce the use of "add32" in these
					ff: function(a, b, c, d, k, s, t){
						var q = ((b & c) | ((~b) & d));
						var z = add32(add32(a, q), add32(k, t));
						return add32((z << s) | (z >>> (32 - s)), b);
						//return b + ((a + q + k + t) <<s);
					},
					gg: function(a, b, c, d, k, s, t){
						var q = ((b & d)  | (c & (~d)));
						var z = add32(add32(a, q), add32(k, t));
						return add32((z << s) | (z >>> (32 - s)), b);
						//return b + ((a + q + k + t) <<s);
					},
					hh: function(a, b, c, d, k, s, t){
						var q = (b ^ c ^ d);
						var z = add32(add32(a, q), add32(k, t));
						return add32((z << s) | (z >>> (32 - s)), b);
						//return b + ((a + q + k + t) <<s);
					},
					ii: function(a, b, c, d, k, s, t){
						var q = (c ^ (b | (~d)));
						var z = add32(add32(a, q), add32(k, t));
						return add32((z << s) | (z >>> (32 - s)), b);
						//return b + ((a + q + k + t) <<s);
					},
					// (END) the methods above 



					mix: function(blocks, vector){

						var a = vector[0], b = vector[1], c = vector[2], d = vector[3];
						var ff = MD5.ff, gg = MD5.gg, hh = MD5.hh, ii = MD5.ii;

						/* This process is laced with magic numbers...
						 * They're derived from the following sine operations.
						 * Reference material listed above should explain why.
						
							for(i = 0; i < 64; i++){
								MD5.sines[i] = Math.floor(4294967296 * Math.abs(Math.sin(i + 1)));
							} 

						 * This process is also "unrolled" (presumably for efficiency)
						 * 
						 * Derived from Joseph Myers' work:
						 * http://www.myersdaily.org/joseph/javascript/md5.js
						 */


						a = ff(a, b, c, d, blocks[0] || 0, 7, -680876936);
						d = ff(d, a, b, c, blocks[1] || 0, 12, -389564586);
						c = ff(c, d, a, b, blocks[2] || 0, 17,  606105819);
						b = ff(b, c, d, a, blocks[3] || 0, 22, -1044525330);
						a = ff(a, b, c, d, blocks[4] || 0, 7, -176418897);
						d = ff(d, a, b, c, blocks[5] || 0, 12,  1200080426);
						c = ff(c, d, a, b, blocks[6] || 0, 17, -1473231341);
						b = ff(b, c, d, a, blocks[7] || 0, 22, -45705983);
						a = ff(a, b, c, d, blocks[8] || 0, 7,  1770035416);
						d = ff(d, a, b, c, blocks[9] || 0, 12, -1958414417);
						c = ff(c, d, a, b, blocks[10] || 0, 17, -42063);
						b = ff(b, c, d, a, blocks[11] || 0, 22, -1990404162);
						a = ff(a, b, c, d, blocks[12] || 0, 7,  1804603682);
						d = ff(d, a, b, c, blocks[13] || 0, 12, -40341101);
						c = ff(c, d, a, b, blocks[14] || 0, 17, -1502002290);
						b = ff(b, c, d, a, blocks[15] || 0, 22,  1236535329);

						a = gg(a, b, c, d, blocks[1] || 0, 5, -165796510);
						d = gg(d, a, b, c, blocks[6] || 0, 9, -1069501632);
						c = gg(c, d, a, b, blocks[11] || 0, 14,  643717713);
						b = gg(b, c, d, a, blocks[0] || 0, 20, -373897302);
						a = gg(a, b, c, d, blocks[5] || 0, 5, -701558691);
						d = gg(d, a, b, c, blocks[10] || 0, 9,  38016083);
						c = gg(c, d, a, b, blocks[15] || 0, 14, -660478335);
						b = gg(b, c, d, a, blocks[4] || 0, 20, -405537848);
						a = gg(a, b, c, d, blocks[9] || 0, 5,  568446438);
						d = gg(d, a, b, c, blocks[14] || 0, 9, -1019803690);
						c = gg(c, d, a, b, blocks[3] || 0, 14, -187363961);
						b = gg(b, c, d, a, blocks[8] || 0, 20,  1163531501);
						a = gg(a, b, c, d, blocks[13] || 0, 5, -1444681467);
						d = gg(d, a, b, c, blocks[2] || 0, 9, -51403784);
						c = gg(c, d, a, b, blocks[7] || 0, 14,  1735328473);
						b = gg(b, c, d, a, blocks[12] || 0, 20, -1926607734);

						a = hh(a, b, c, d, blocks[5] || 0, 4, -378558);
						d = hh(d, a, b, c, blocks[8] || 0, 11, -2022574463);
						c = hh(c, d, a, b, blocks[11] || 0, 16,  1839030562);
						b = hh(b, c, d, a, blocks[14] || 0, 23, -35309556);
						a = hh(a, b, c, d, blocks[1] || 0, 4, -1530992060);
						d = hh(d, a, b, c, blocks[4] || 0, 11,  1272893353);
						c = hh(c, d, a, b, blocks[7] || 0, 16, -155497632);
						b = hh(b, c, d, a, blocks[10] || 0, 23, -1094730640);
						a = hh(a, b, c, d, blocks[13] || 0, 4,  681279174);
						d = hh(d, a, b, c, blocks[0] || 0, 11, -358537222);
						c = hh(c, d, a, b, blocks[3] || 0, 16, -722521979);
						b = hh(b, c, d, a, blocks[6] || 0, 23,  76029189);
						a = hh(a, b, c, d, blocks[9] || 0, 4, -640364487);
						d = hh(d, a, b, c, blocks[12] || 0, 11, -421815835);
						c = hh(c, d, a, b, blocks[15] || 0, 16,  530742520);
						b = hh(b, c, d, a, blocks[2] || 0, 23, -995338651);

						a = ii(a, b, c, d, blocks[0] || 0, 6, -198630844);
						d = ii(d, a, b, c, blocks[7] || 0, 10,  1126891415);
						c = ii(c, d, a, b, blocks[14] || 0, 15, -1416354905);
						b = ii(b, c, d, a, blocks[5] || 0, 21, -57434055);
						a = ii(a, b, c, d, blocks[12] || 0, 6,  1700485571);
						d = ii(d, a, b, c, blocks[3] || 0, 10, -1894986606);
						c = ii(c, d, a, b, blocks[10] || 0, 15, -1051523);
						b = ii(b, c, d, a, blocks[1] || 0, 21, -2054922799);
						a = ii(a, b, c, d, blocks[8] || 0, 6,  1873313359);
						d = ii(d, a, b, c, blocks[15] || 0, 10, -30611744);
						c = ii(c, d, a, b, blocks[6] || 0, 15, -1560198380);
						b = ii(b, c, d, a, blocks[13] || 0, 21,  1309151649);
						a = ii(a, b, c, d, blocks[4] || 0, 6, -145523070);
						d = ii(d, a, b, c, blocks[11] || 0, 10, -1120210379);
						c = ii(c, d, a, b, blocks[2] || 0, 15,  718787259);
						b = ii(b, c, d, a, blocks[9] || 0, 21, -343485551);

						vector[0] = add32(a, vector[0]);
						vector[1] = add32(b, vector[1]);
						vector[2] = add32(c, vector[2]);
						vector[3] = add32(d, vector[3]);

					},

					/** Prepare a properly-sequenced segment of 8-bit blocks from input.
					 * This method honors UTF-8 and UTF-16 encodings for multi-byte characters,
					 * and converts Unicode characters to the appropriate 8-bit representation,
					 * producing variable-length arrays of 8-bit blocks. 
					 * @param {string} input
					 * @param {number} start
					 * @param {number} howmany
					 * @return {?Array.<number>}
					 */
					load: function(buffer, input, start, howmany, support_unicode){

						var values = input.substr(start, howmany), i = values.length;
						var chars = buffer, char_val, q = 0;
						var temp, lower;


						for(q = 0; temp = -1, q < i; q++){
							// Read first byte
							char_val = values.charCodeAt(q) & 0xFFFFFFFF;

							if(support_unicode && ((char_val & 0xF800) === 0xD800)){  
								// Collect surrogate pair values in UCS-2 encoding
								temp = values.charCodeAt(++q);

								if((temp & 0xFC00) == 0xDC00){
									// Convert to UTF-16
									upper = 0;
									char_val = (((char_val & 0x3FF) <<10) + (temp & 0x3FF) + 0x10000);
									temp = -1; // reset temp
								} else {
									q--; // rewind
								}

								chars.push(char_val);
								
							} else if(support_unicode && (char_val > 0xFFFF)){ 
								chars.push(
									0xF0 | (char_val >>18),
									0x80 | ((char_val >>12) & 0x3F),
									0x80 | ((char_val >>6) & 0x3F),
									0x80 | ((char_val) & 0x3F)
								);
							} else if(support_unicode && (char_val > 0x800)){ 
								chars.push(
									((char_val >>12)) | 0xE0,
									((char_val >>6) & 0x3F) | 0x80,
									((char_val) & 0x3F) | 0x80
								);
							} else if(support_unicode && (char_val > 0x7F)){ 
								chars.push(
									(char_val >>6) | 0xC0,
									(char_val & 0x3F) | 0x80
								);
							} else {
								z = char_val;
								do {
									chars.push(z & 0xFF);
								} while(z = z >>>8);
							}
					
						}

						return buffer; // in original input order
					},

					hash: function(input){

						// Initialize output vector, 128 bits.
						var vector = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476];
						
						var readsize = 512; // How many bytes to read each time from input
						var position = 0;

						// The buffer (8-bit chunks read from input)
						var buffer = [];
						var chunk, i, blocks, last = 0, total = 0;


						do {

							// Prime/load the buffer
							MD5.load(buffer, input, position, readsize, true);
							position = position + readsize;

							rinse: { // this label lets us skip buffering (unnecessarily) if enough is already present

								// Consume the first 64 bytes (8-bits each) - total 512 bits
								chunk = buffer.splice(0,64);
								total = total + chunk.length;
								last = last || (!last && (chunk.length < 64));
								blocks = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

								// Prepare 64x little-endian 32-bit integers from 4x 8-bit chunks, for a total of 512 bits
								for(i = 0; i < 64; i += 4){
									blocks[i>>2] = chunk[i] | (chunk[i +1] <<8) | (chunk[i+2] <<16) | (chunk[i+3] <<24);
								}


								if(last){
									i = chunk.length;
									blocks[i>>2] |= (0x80 << ((i%4) <<3)); // XXX Derived from Joseph Myers' work

									if(i <56){
										// Sufficient room is availble to append the length in the existing buffer
										// Provide a 64-bit length representation (little-endian) of input size
										total = total *8; 
										blocks[14] = total & 0xFFFFFFFF;
										blocks[15] = Math.floor(total / (0xFFFFFFFF));
										last = 0;
									}

								}

								MD5.mix(blocks, vector); // Perform the massive bit-twiddling


								// "goto" jump to minimize pre-buffering
								if(buffer.length > 64)
									break rinse;
								
							}

						} while (buffer.length);

						if(last){
							// The loop wasn't able to fit the length bit into
							// the last message, so we run it here.
						
							blocks = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

							// Provide a 64-bit representation (little-endian) of input size
							total = total *8; 
							blocks[14] = total & 0xFFFFFFFF;
							blocks[15] = Math.floor(total / (0xFFFFFFFF));
							MD5.mix(blocks, vector);
						}

						return vector;

					},

					/** Encode as (8-bit reversed) hexidecimal blocks
					 * @param {Array.<Number>} hash
					 * @return {string}
					 */
					hex: function(hash){
						var result = [], i, j, k, l, m;
						for(i = 0; i < 4; i++){
							j = (hash[i] & 0xFF);
							k = (hash[i] & 0xFF00) >> 8;
							l = (hash[i] & 0xFF0000) >> 16;
							m = (hash[i] >>>24);
							result.push(j, k, l, m);
						}
						i = result.length;
						while(i--) 
							result[i] = (result[i] > 0xF ? '' : '0') + result[i].toString(16);
						return result.join('');
					}
				};


				// Exports
				var _md5 = this.md5 = function(text){
					return MD5.hex(MD5.hash(text))
				};

				_md5.test = MD5.test;
				_md5.vector = MD5.hash;
				_md5.hex = MD5.hex;
				
			}).call(this);
		}
	},

	$server: {
		$require: ['java:org.jsbeans.helpers.StringHelper'],
		
		md5: function(s){
			return '' + StringHelper.MD5(s);
		}
	}
}