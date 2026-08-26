// Standalone Surge runtime.
/*
Third-party components bundled below use the MIT License.

fflate
Copyright (c) 2023 Arjun Barrett

@noble/ciphers
Copyright (c) 2022 Paul Miller (https://paulmillr.com)
Copyright (c) 2016 Thomas Pornin <pornin@bolet.org>

@noble/hashes
Copyright (c) 2022 Paul Miller (https://paulmillr.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(() => {
  // YouTube protobuf codec
  var fi = Object.create, Me = Object.defineProperty, di = Object.getOwnPropertyDescriptor, pi = Object.getOwnPropertyNames, yi = Object.getPrototypeOf, hi = Object.prototype.hasOwnProperty;
  var gi = (l, e) => () => (e || l((e = { exports: {} }).exports, e), e.exports), bi = (l, e, t, n) => {
    if (e && typeof e == "object" || typeof e == "function")
      for (let i of pi(e))
        !hi.call(l, i) && i !== t && Me(l, i, {
          get: () => e[i],
          enumerable: !(n = di(e, i)) || n.enumerable
        });
    return l;
  }, g = (l, e, t) => (t = l != null ? fi(yi(l)) : {}, bi(
    e || !l || !l.__esModule ? Me(t, "default", { value: l, enumerable: !0 }) : t,
    l
  ));
  var h = gi((Nr) => {
    "use strict";
    (function(l) {
      function e() {
      }
      function t() {
      }
      var n = String.fromCharCode, i = {}.toString, r = i.call(l.SharedArrayBuffer), c = i(), o = l.Uint8Array, s = o || Array, a = o ? ArrayBuffer : s, u = a.isView || function(I) {
        return I && "length" in I;
      }, B = i.call(a.prototype);
      a = t.prototype;
      var w = l.TextEncoder, b = new (o ? Uint16Array : s)(32);
      e.prototype.decode = function(I) {
        if (!u(I)) {
          var $ = i.call(I);
          if ($ !== B && $ !== r && $ !== c)
            throw TypeError(
              "Failed to execute 'decode' on 'TextDecoder': The provided value is not of type '(ArrayBuffer or ArrayBufferView)'"
            );
          I = o ? new s(I) : I || [];
        }
        for (var N = $ = "", k = 0, C = I.length | 0, de = C - 32 | 0, U, S, A = 0, J = 0, V, j = 0, M = -1; k < C; ) {
          for (U = k <= de ? 32 : C - k | 0; j < U; k = k + 1 | 0, j = j + 1 | 0) {
            switch (S = I[k] & 255, S >> 4) {
              case 15:
                if (V = I[k = k + 1 | 0] & 255, V >> 6 !== 2 || 247 < S) {
                  k = k - 1 | 0;
                  break;
                }
                A = (S & 7) << 6 | V & 63, J = 5, S = 256;
              case 14:
                V = I[k = k + 1 | 0] & 255, A <<= 6, A |= (S & 15) << 6 | V & 63, J = V >> 6 === 2 ? J + 4 | 0 : 24, S = S + 256 & 768;
              case 13:
              case 12:
                V = I[k = k + 1 | 0] & 255, A <<= 6, A |= (S & 31) << 6 | V & 63, J = J + 7 | 0, k < C && V >> 6 === 2 && A >> J && 1114112 > A ? (S = A, A = A - 65536 | 0, 0 <= A && (M = (A >> 10) + 55296 | 0, S = (A & 1023) + 56320 | 0, 31 > j ? (b[j] = M, j = j + 1 | 0, M = -1) : (V = M, M = S, S = V))) : (S >>= 8, k = k - S - 1 | 0, S = 65533), A = J = 0, U = k <= de ? 32 : C - k | 0;
              default:
                b[j] = S;
                continue;
              case 11:
              case 10:
              case 9:
              case 8:
            }
            b[j] = 65533;
          }
          if (N += n(
            b[0],
            b[1],
            b[2],
            b[3],
            b[4],
            b[5],
            b[6],
            b[7],
            b[8],
            b[9],
            b[10],
            b[11],
            b[12],
            b[13],
            b[14],
            b[15],
            b[16],
            b[17],
            b[18],
            b[19],
            b[20],
            b[21],
            b[22],
            b[23],
            b[24],
            b[25],
            b[26],
            b[27],
            b[28],
            b[29],
            b[30],
            b[31]
          ), 32 > j && (N = N.slice(0, j - 32 | 0)), k < C) {
            if (b[0] = M, j = ~M >>> 31, M = -1, N.length < $.length)
              continue;
          } else M !== -1 && (N += n(M));
          $ += N, N = "";
        }
        return $;
      }, a.encode = function(I) {
        I = I === void 0 ? "" : "" + I;
        var $ = I.length | 0, N = new s(($ << 1) + 8 | 0), k, C = 0, de = !o;
        for (k = 0; k < $; k = k + 1 | 0, C = C + 1 | 0) {
          var U = I.charCodeAt(k) | 0;
          if (127 >= U) N[C] = U;
          else {
            if (2047 >= U) N[C] = 192 | U >> 6;
            else {
              e: {
                if (55296 <= U)
                  if (56319 >= U) {
                    var S = I.charCodeAt(k = k + 1 | 0) | 0;
                    if (56320 <= S && 57343 >= S) {
                      if (U = (U << 10) + S - 56613888 | 0, 65535 < U) {
                        N[C] = 240 | U >> 18, N[C = C + 1 | 0] = 128 | U >> 12 & 63, N[C = C + 1 | 0] = 128 | U >> 6 & 63, N[C = C + 1 | 0] = 128 | U & 63;
                        continue;
                      }
                      break e;
                    }
                    U = 65533;
                  } else 57343 >= U && (U = 65533);
                !de && k << 1 < C && k << 1 < (C - 7 | 0) && (de = !0, S = new s(3 * $), S.set(N), N = S);
              }
              N[C] = 224 | U >> 12, N[C = C + 1 | 0] = 128 | U >> 6 & 63;
            }
            N[C = C + 1 | 0] = 128 | U & 63;
          }
        }
        return o ? N.subarray(0, C) : N.slice(0, C);
      }, w || (l.TextDecoder = e, l.TextEncoder = t);
    })(
      typeof global > "u" ? typeof globalThis > "u" ? Nr : globalThis : global
    );
  }), Wc = g(h(), 1), tc = g(h(), 1), jo = g(h()), Xi = g(h());
  function Be(l) {
    let e = typeof l;
    if (e == "object") {
      if (Array.isArray(l)) return "array";
      if (l === null) return "null";
    }
    return e;
  }
  function Sr(l) {
    return l !== null && typeof l == "object" && !Array.isArray(l);
  }
  var Yi = g(h()), v = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(
    ""
  ), Ie = [];
  for (let l = 0; l < v.length; l++) Ie[v[l].charCodeAt(0)] = l;
  Ie[45] = v.indexOf("+");
  Ie[95] = v.indexOf("/");
  function Te(l) {
    let e = l.length * 3 / 4;
    l[l.length - 2] == "=" ? e -= 2 : l[l.length - 1] == "=" && (e -= 1);
    let t = new Uint8Array(e), n = 0, i = 0, r, c = 0;
    for (let o = 0; o < l.length; o++) {
      if (r = Ie[l.charCodeAt(o)], r === void 0)
        switch (l[o]) {
          case "=":
            i = 0;
          case `
`:
          case "\r":
          case "	":
          case " ":
            continue;
          default:
            throw Error("invalid base64 string.");
        }
      switch (i) {
        case 0:
          c = r, i = 1;
          break;
        case 1:
          t[n++] = c << 2 | (r & 48) >> 4, c = r, i = 2;
          break;
        case 2:
          t[n++] = (c & 15) << 4 | (r & 60) >> 2, c = r, i = 3;
          break;
        case 3:
          t[n++] = (c & 3) << 6 | r, i = 0;
          break;
      }
    }
    if (i == 1) throw Error("invalid base64 string.");
    return t.subarray(0, n);
  }
  function Q(l) {
    let e = "", t = 0, n, i = 0;
    for (let r = 0; r < l.length; r++)
      switch (n = l[r], t) {
        case 0:
          e += v[n >> 2], i = (n & 3) << 4, t = 1;
          break;
        case 1:
          e += v[i | n >> 4], i = (n & 15) << 2, t = 2;
          break;
        case 2:
          e += v[i | n >> 6], e += v[n & 63], t = 0;
          break;
      }
    return t && (e += v[i], e += "=", t == 1 && (e += "=")), e;
  }
  var Zi = g(h()), d;
  (function(l) {
    l.symbol = Symbol.for("protobuf-ts/unknown"), l.onRead = (t, n, i, r, c) => {
      (e(n) ? n[l.symbol] : n[l.symbol] = []).push({
        no: i,
        wireType: r,
        data: c
      });
    }, l.onWrite = (t, n, i) => {
      for (let { no: r, wireType: c, data: o } of l.list(n)) i.tag(r, c).raw(o);
    }, l.list = (t, n) => {
      if (e(t)) {
        let i = t[l.symbol];
        return n ? i.filter((r) => r.no == n) : i;
      }
      return [];
    }, l.last = (t, n) => l.list(t, n).slice(-1)[0];
    let e = (t) => t && Array.isArray(t[l.symbol]);
  })(d || (d = {}));
  var f;
  (function(l) {
    l[l.Varint = 0] = "Varint", l[l.Bit64 = 1] = "Bit64", l[l.LengthDelimited = 2] = "LengthDelimited", l[l.StartGroup = 3] = "StartGroup", l[l.EndGroup = 4] = "EndGroup", l[l.Bit32 = 5] = "Bit32";
  })(f || (f = {}));
  var la = g(h()), ra = g(h()), ea = g(h());
  function Or() {
    let l = 0, e = 0;
    for (let n = 0; n < 28; n += 7) {
      let i = this.buf[this.pos++];
      if (l |= (i & 127) << n, !(i & 128))
        return this.assertBounds(), [l, e];
    }
    let t = this.buf[this.pos++];
    if (l |= (t & 15) << 28, e = (t & 112) >> 4, !(t & 128))
      return this.assertBounds(), [l, e];
    for (let n = 3; n <= 31; n += 7) {
      let i = this.buf[this.pos++];
      if (e |= (i & 127) << n, !(i & 128))
        return this.assertBounds(), [l, e];
    }
    throw new Error("invalid varint");
  }
  function xe(l, e, t) {
    for (let r = 0; r < 28; r = r + 7) {
      let c = l >>> r, o = !(!(c >>> 7) && e == 0), s = (o ? c | 128 : c) & 255;
      if (t.push(s), !o) return;
    }
    let n = l >>> 28 & 15 | (e & 7) << 4, i = !!(e >> 3);
    if (t.push((i ? n | 128 : n) & 255), !!i) {
      for (let r = 3; r < 31; r = r + 7) {
        let c = e >>> r, o = !!(c >>> 7), s = (o ? c | 128 : c) & 255;
        if (t.push(s), !o) return;
      }
      t.push(e >>> 31 & 1);
    }
  }
  var Ce = 65536 * 65536;
  function ve(l) {
    let e = l[0] == "-";
    e && (l = l.slice(1));
    let t = 1e6, n = 0, i = 0;
    function r(c, o) {
      let s = Number(l.slice(c, o));
      i *= t, n = n * t + s, n >= Ce && (i = i + (n / Ce | 0), n = n % Ce);
    }
    return r(-24, -18), r(-18, -12), r(-12, -6), r(-6), [e, n, i];
  }
  function We(l, e) {
    if (e >>> 0 <= 2097151) return "" + (Ce * e + (l >>> 0));
    let t = l & 16777215, n = (l >>> 24 | e << 8) >>> 0 & 16777215, i = e >> 16 & 65535, r = t + n * 6777216 + i * 6710656, c = n + i * 8147497, o = i * 2, s = 1e7;
    r >= s && (c += Math.floor(r / s), r %= s), c >= s && (o += Math.floor(c / s), c %= s);
    function a(u, B) {
      let w = u ? String(u) : "";
      return B ? "0000000".slice(w.length) + w : w;
    }
    return a(o, 0) + a(c, o) + a(r, 1);
  }
  function Ge(l, e) {
    if (l >= 0) {
      for (; l > 127; ) e.push(l & 127 | 128), l = l >>> 7;
      e.push(l);
    } else {
      for (let t = 0; t < 9; t++) e.push(l & 127 | 128), l = l >> 7;
      e.push(1);
    }
  }
  function Pr() {
    let l = this.buf[this.pos++], e = l & 127;
    if (!(l & 128)) return this.assertBounds(), e;
    if (l = this.buf[this.pos++], e |= (l & 127) << 7, !(l & 128))
      return this.assertBounds(), e;
    if (l = this.buf[this.pos++], e |= (l & 127) << 14, !(l & 128))
      return this.assertBounds(), e;
    if (l = this.buf[this.pos++], e |= (l & 127) << 21, !(l & 128))
      return this.assertBounds(), e;
    l = this.buf[this.pos++], e |= (l & 15) << 28;
    for (let t = 5; l & 128 && t < 10; t++) l = this.buf[this.pos++];
    if (l & 128) throw new Error("invalid varint");
    return this.assertBounds(), e >>> 0;
  }
  var x;
  function ki() {
    let l = new DataView(new ArrayBuffer(8));
    x = globalThis.BigInt !== void 0 && typeof l.getBigInt64 == "function" && typeof l.getBigUint64 == "function" && typeof l.setBigInt64 == "function" && typeof l.setBigUint64 == "function" ? {
      MIN: BigInt("-9223372036854775808"),
      MAX: BigInt("9223372036854775807"),
      UMIN: BigInt("0"),
      UMAX: BigInt("18446744073709551615"),
      C: BigInt,
      V: l
    } : void 0;
  }
  ki();
  function Ur(l) {
    if (!l)
      throw new Error(
        "BigInt unavailable, see https://github.com/timostamm/protobuf-ts/blob/v1.0.8/MANUAL.md#bigint-support"
      );
  }
  var Er = /^-?[0-9]+$/, Se = 4294967296, Ne = 2147483648, Oe = class {
    constructor(e, t) {
      this.lo = e | 0, this.hi = t | 0;
    }
    isZero() {
      return this.lo == 0 && this.hi == 0;
    }
    toNumber() {
      let e = this.hi * Se + (this.lo >>> 0);
      if (!Number.isSafeInteger(e))
        throw new Error("cannot convert to safe number");
      return e;
    }
  }, O = class extends Oe {
    static from(e) {
      if (x)
        switch (typeof e) {
          case "string":
            if (e == "0") return this.ZERO;
            if (e == "") throw new Error("string is no integer");
            e = x.C(e);
          case "number":
            if (e === 0) return this.ZERO;
            e = x.C(e);
          case "bigint":
            if (!e) return this.ZERO;
            if (e < x.UMIN) throw new Error("signed value for ulong");
            if (e > x.UMAX) throw new Error("ulong too large");
            return x.V.setBigUint64(0, e, !0), new O(x.V.getInt32(0, !0), x.V.getInt32(4, !0));
        }
      else
        switch (typeof e) {
          case "string":
            if (e == "0") return this.ZERO;
            if (e = e.trim(), !Er.test(e))
              throw new Error("string is no integer");
            let [t, n, i] = ve(e);
            if (t) throw new Error("signed value for ulong");
            return new O(n, i);
          case "number":
            if (e == 0) return this.ZERO;
            if (!Number.isSafeInteger(e))
              throw new Error("number is no integer");
            if (e < 0) throw new Error("signed value for ulong");
            return new O(e, e / Se);
        }
      throw new Error("unknown value " + typeof e);
    }
    toString() {
      return x ? this.toBigInt().toString() : We(this.lo, this.hi);
    }
    toBigInt() {
      return Ur(x), x.V.setInt32(0, this.lo, !0), x.V.setInt32(4, this.hi, !0), x.V.getBigUint64(0, !0);
    }
  };
  O.ZERO = new O(0, 0);
  var T = class extends Oe {
    static from(e) {
      if (x)
        switch (typeof e) {
          case "string":
            if (e == "0") return this.ZERO;
            if (e == "") throw new Error("string is no integer");
            e = x.C(e);
          case "number":
            if (e === 0) return this.ZERO;
            e = x.C(e);
          case "bigint":
            if (!e) return this.ZERO;
            if (e < x.MIN) throw new Error("signed long too small");
            if (e > x.MAX) throw new Error("signed long too large");
            return x.V.setBigInt64(0, e, !0), new T(x.V.getInt32(0, !0), x.V.getInt32(4, !0));
        }
      else
        switch (typeof e) {
          case "string":
            if (e == "0") return this.ZERO;
            if (e = e.trim(), !Er.test(e))
              throw new Error("string is no integer");
            let [t, n, i] = ve(e);
            if (t) {
              if (i > Ne || i == Ne && n != 0)
                throw new Error("signed long too small");
            } else if (i >= Ne) throw new Error("signed long too large");
            let r = new T(n, i);
            return t ? r.negate() : r;
          case "number":
            if (e == 0) return this.ZERO;
            if (!Number.isSafeInteger(e)) throw new Error("number is no integer");
            return e > 0 ? new T(e, e / Se) : new T(-e, -e / Se).negate();
        }
      throw new Error("unknown value " + typeof e);
    }
    isNegative() {
      return (this.hi & Ne) !== 0;
    }
    negate() {
      let e = ~this.hi, t = this.lo;
      return t ? t = ~t + 1 : e += 1, new T(t, e);
    }
    toString() {
      if (x) return this.toBigInt().toString();
      if (this.isNegative()) {
        let e = this.negate();
        return "-" + We(e.lo, e.hi);
      }
      return We(this.lo, this.hi);
    }
    toBigInt() {
      return Ur(x), x.V.setInt32(0, this.lo, !0), x.V.setInt32(4, this.hi, !0), x.V.getBigInt64(0, !0);
    }
  };
  T.ZERO = new T(0, 0);
  var Fr = { readUnknownField: !0, readerFactory: (l) => new Ke(l) };
  function Lr(l) {
    return l ? Object.assign(Object.assign({}, Fr), l) : Fr;
  }
  var Ke = class {
    constructor(e, t) {
      this.varint64 = Or, this.uint32 = Pr, this.buf = e, this.len = e.length, this.pos = 0, this.view = new DataView(e.buffer, e.byteOffset, e.byteLength), this.textDecoder = t ?? new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
    }
    tag() {
      let e = this.uint32(), t = e >>> 3, n = e & 7;
      if (t <= 0 || n < 0 || n > 5)
        throw new Error("illegal tag: field no " + t + " wire type " + n);
      return [t, n];
    }
    skip(e) {
      let t = this.pos;
      switch (e) {
        case f.Varint:
          for (; this.buf[this.pos++] & 128; ) ;
          break;
        case f.Bit64:
          this.pos += 4;
        case f.Bit32:
          this.pos += 4;
          break;
        case f.LengthDelimited:
          let n = this.uint32();
          this.pos += n;
          break;
        case f.StartGroup:
          let i;
          for (; (i = this.tag()[1]) !== f.EndGroup; ) this.skip(i);
          break;
        default:
          throw new Error("cant skip wire type " + e);
      }
      return this.assertBounds(), this.buf.subarray(t, this.pos);
    }
    assertBounds() {
      if (this.pos > this.len) throw new RangeError("premature EOF");
    }
    int32() {
      return this.uint32() | 0;
    }
    sint32() {
      let e = this.uint32();
      return e >>> 1 ^ -(e & 1);
    }
    int64() {
      return new T(...this.varint64());
    }
    uint64() {
      return new O(...this.varint64());
    }
    sint64() {
      let [e, t] = this.varint64(), n = -(e & 1);
      return e = (e >>> 1 | (t & 1) << 31) ^ n, t = t >>> 1 ^ n, new T(e, t);
    }
    bool() {
      let [e, t] = this.varint64();
      return e !== 0 || t !== 0;
    }
    fixed32() {
      return this.view.getUint32((this.pos += 4) - 4, !0);
    }
    sfixed32() {
      return this.view.getInt32((this.pos += 4) - 4, !0);
    }
    fixed64() {
      return new O(this.sfixed32(), this.sfixed32());
    }
    sfixed64() {
      return new T(this.sfixed32(), this.sfixed32());
    }
    float() {
      return this.view.getFloat32((this.pos += 4) - 4, !0);
    }
    double() {
      return this.view.getFloat64((this.pos += 8) - 8, !0);
    }
    bytes() {
      let e = this.uint32(), t = this.pos;
      return this.pos += e, this.assertBounds(), this.buf.subarray(t, t + e);
    }
    string() {
      return this.textDecoder.decode(this.bytes());
    }
  }, ha = g(h()), ua = g(h());
  function R(l, e) {
    if (!l) throw new Error(e);
  }
  var Ri = 34028234663852886e22, wi = -34028234663852886e22, Bi = 4294967295, Ii = 2147483647, Ti = -2147483648;
  function H(l) {
    if (typeof l != "number") throw new Error("invalid int 32: " + typeof l);
    if (!Number.isInteger(l) || l > Ii || l < Ti)
      throw new Error("invalid int 32: " + l);
  }
  function X(l) {
    if (typeof l != "number") throw new Error("invalid uint 32: " + typeof l);
    if (!Number.isInteger(l) || l > Bi || l < 0)
      throw new Error("invalid uint 32: " + l);
  }
  function ee(l) {
    if (typeof l != "number") throw new Error("invalid float 32: " + typeof l);
    if (Number.isFinite(l) && (l > Ri || l < wi))
      throw new Error("invalid float 32: " + l);
  }
  var Ar = { writeUnknownFields: !0, writerFactory: () => new He() };
  function Dr(l) {
    return l ? Object.assign(Object.assign({}, Ar), l) : Ar;
  }
  var He = class {
    constructor(e) {
      this.stack = [], this.textEncoder = e ?? new TextEncoder(), this.chunks = [], this.buf = [];
    }
    finish() {
      this.chunks.push(new Uint8Array(this.buf));
      let e = 0;
      for (let i = 0; i < this.chunks.length; i++) e += this.chunks[i].length;
      let t = new Uint8Array(e), n = 0;
      for (let i = 0; i < this.chunks.length; i++)
        t.set(this.chunks[i], n), n += this.chunks[i].length;
      return this.chunks = [], t;
    }
    fork() {
      return this.stack.push({ chunks: this.chunks, buf: this.buf }), this.chunks = [], this.buf = [], this;
    }
    join() {
      let e = this.finish(), t = this.stack.pop();
      if (!t) throw new Error("invalid state, fork stack empty");
      return this.chunks = t.chunks, this.buf = t.buf, this.uint32(e.byteLength), this.raw(e);
    }
    tag(e, t) {
      return this.uint32((e << 3 | t) >>> 0);
    }
    raw(e) {
      return this.buf.length && (this.chunks.push(new Uint8Array(this.buf)), this.buf = []), this.chunks.push(e), this;
    }
    uint32(e) {
      for (X(e); e > 127; ) this.buf.push(e & 127 | 128), e = e >>> 7;
      return this.buf.push(e), this;
    }
    int32(e) {
      return H(e), Ge(e, this.buf), this;
    }
    bool(e) {
      return this.buf.push(e ? 1 : 0), this;
    }
    bytes(e) {
      return this.uint32(e.byteLength), this.raw(e);
    }
    string(e) {
      let t = this.textEncoder.encode(e);
      return this.uint32(t.byteLength), this.raw(t);
    }
    float(e) {
      ee(e);
      let t = new Uint8Array(4);
      return new DataView(t.buffer).setFloat32(0, e, !0), this.raw(t);
    }
    double(e) {
      let t = new Uint8Array(8);
      return new DataView(t.buffer).setFloat64(0, e, !0), this.raw(t);
    }
    fixed32(e) {
      X(e);
      let t = new Uint8Array(4);
      return new DataView(t.buffer).setUint32(0, e, !0), this.raw(t);
    }
    sfixed32(e) {
      H(e);
      let t = new Uint8Array(4);
      return new DataView(t.buffer).setInt32(0, e, !0), this.raw(t);
    }
    sint32(e) {
      return H(e), e = (e << 1 ^ e >> 31) >>> 0, Ge(e, this.buf), this;
    }
    sfixed64(e) {
      let t = new Uint8Array(8), n = new DataView(t.buffer), i = T.from(e);
      return n.setInt32(0, i.lo, !0), n.setInt32(4, i.hi, !0), this.raw(t);
    }
    fixed64(e) {
      let t = new Uint8Array(8), n = new DataView(t.buffer), i = O.from(e);
      return n.setInt32(0, i.lo, !0), n.setInt32(4, i.hi, !0), this.raw(t);
    }
    int64(e) {
      let t = T.from(e);
      return xe(t.lo, t.hi, this.buf), this;
    }
    sint64(e) {
      let t = T.from(e), n = t.hi >> 31, i = t.lo << 1 ^ n, r = (t.hi << 1 | t.lo >>> 31) ^ n;
      return xe(i, r, this.buf), this;
    }
    uint64(e) {
      let t = O.from(e);
      return xe(t.lo, t.hi, this.buf), this;
    }
  }, ga = g(h()), $r = {
    emitDefaultValues: !1,
    enumAsInteger: !1,
    useProtoFieldName: !1,
    prettySpaces: 0
  }, jr = { ignoreUnknownFields: !1 };
  function Vr(l) {
    return l ? Object.assign(Object.assign({}, jr), l) : jr;
  }
  function Mr(l) {
    return l ? Object.assign(Object.assign({}, $r), l) : $r;
  }
  var ka = g(h()), Pe = Symbol.for("protobuf-ts/message-type"), Ao = g(h()), Ta = g(h()), wa = g(h());
  function _e(l) {
    let e = !1, t = [];
    for (let n = 0; n < l.length; n++) {
      let i = l.charAt(n);
      i == "_" ? e = !0 : /\d/.test(i) ? (t.push(i), e = !0) : e ? (t.push(i.toUpperCase()), e = !1) : n == 0 ? t.push(i.toLowerCase()) : t.push(i);
    }
    return t.join("");
  }
  var p;
  (function(l) {
    l[l.DOUBLE = 1] = "DOUBLE", l[l.FLOAT = 2] = "FLOAT", l[l.INT64 = 3] = "INT64", l[l.UINT64 = 4] = "UINT64", l[l.INT32 = 5] = "INT32", l[l.FIXED64 = 6] = "FIXED64", l[l.FIXED32 = 7] = "FIXED32", l[l.BOOL = 8] = "BOOL", l[l.STRING = 9] = "STRING", l[l.BYTES = 12] = "BYTES", l[l.UINT32 = 13] = "UINT32", l[l.SFIXED32 = 15] = "SFIXED32", l[l.SFIXED64 = 16] = "SFIXED64", l[l.SINT32 = 17] = "SINT32", l[l.SINT64 = 18] = "SINT64";
  })(p || (p = {}));
  var L;
  (function(l) {
    l[l.BIGINT = 0] = "BIGINT", l[l.STRING = 1] = "STRING", l[l.NUMBER = 2] = "NUMBER";
  })(L || (L = {}));
  var ye;
  (function(l) {
    l[l.NO = 0] = "NO", l[l.PACKED = 1] = "PACKED", l[l.UNPACKED = 2] = "UNPACKED";
  })(ye || (ye = {}));
  function vr(l) {
    var e, t, n, i;
    return l.localName = (e = l.localName) !== null && e !== void 0 ? e : _e(l.name), l.jsonName = (t = l.jsonName) !== null && t !== void 0 ? t : _e(l.name), l.repeat = (n = l.repeat) !== null && n !== void 0 ? n : ye.NO, l.opt = (i = l.opt) !== null && i !== void 0 ? i : l.repeat || l.oneof ? !1 : l.kind == "message", l;
  }
  var Oa = g(h()), xa = g(h());
  function Gr(l) {
    if (typeof l != "object" || l === null || !l.hasOwnProperty("oneofKind"))
      return !1;
    switch (typeof l.oneofKind) {
      case "string":
        return l[l.oneofKind] === void 0 ? !1 : Object.keys(l).length == 2;
      case "undefined":
        return Object.keys(l).length == 1;
      default:
        return !1;
    }
  }
  var Ue = class {
    constructor(e) {
      var t;
      this.fields = (t = e.fields) !== null && t !== void 0 ? t : [];
    }
    prepare() {
      if (this.data) return;
      let e = [], t = [], n = [];
      for (let i of this.fields)
        if (i.oneof)
          n.includes(i.oneof) || (n.push(i.oneof), e.push(i.oneof), t.push(i.oneof));
        else
          switch (t.push(i.localName), i.kind) {
            case "scalar":
            case "enum":
              (!i.opt || i.repeat) && e.push(i.localName);
              break;
            case "message":
              i.repeat && e.push(i.localName);
              break;
            case "map":
              e.push(i.localName);
              break;
          }
      this.data = { req: e, known: t, oneofs: Object.values(n) };
    }
    is(e, t, n = !1) {
      if (t < 0) return !0;
      if (e == null || typeof e != "object") return !1;
      this.prepare();
      let i = Object.keys(e), r = this.data;
      if (i.length < r.req.length || r.req.some((c) => !i.includes(c)) || !n && i.some((c) => !r.known.includes(c)))
        return !1;
      if (t < 1) return !0;
      for (let c of r.oneofs) {
        let o = e[c];
        if (!Gr(o)) return !1;
        if (o.oneofKind === void 0) continue;
        let s = this.fields.find((a) => a.localName === o.oneofKind);
        if (!s || !this.field(o[o.oneofKind], s, n, t)) return !1;
      }
      for (let c of this.fields)
        if (c.oneof === void 0 && !this.field(e[c.localName], c, n, t)) return !1;
      return !0;
    }
    field(e, t, n, i) {
      let r = t.repeat;
      switch (t.kind) {
        case "scalar":
          return e === void 0 ? t.opt : r ? this.scalars(e, t.T, i, t.L) : this.scalar(e, t.T, t.L);
        case "enum":
          return e === void 0 ? t.opt : r ? this.scalars(e, p.INT32, i) : this.scalar(e, p.INT32);
        case "message":
          return e === void 0 ? !0 : r ? this.messages(e, t.T(), n, i) : this.message(e, t.T(), n, i);
        case "map":
          if (typeof e != "object" || e === null) return !1;
          if (i < 2) return !0;
          if (!this.mapKeys(e, t.K, i)) return !1;
          switch (t.V.kind) {
            case "scalar":
              return this.scalars(Object.values(e), t.V.T, i, t.V.L);
            case "enum":
              return this.scalars(Object.values(e), p.INT32, i);
            case "message":
              return this.messages(Object.values(e), t.V.T(), n, i);
          }
          break;
      }
      return !0;
    }
    message(e, t, n, i) {
      return n ? t.isAssignable(e, i) : t.is(e, i);
    }
    messages(e, t, n, i) {
      if (!Array.isArray(e)) return !1;
      if (i < 2) return !0;
      if (n) {
        for (let r = 0; r < e.length && r < i; r++)
          if (!t.isAssignable(e[r], i - 1)) return !1;
      } else
        for (let r = 0; r < e.length && r < i; r++)
          if (!t.is(e[r], i - 1)) return !1;
      return !0;
    }
    scalar(e, t, n) {
      let i = typeof e;
      switch (t) {
        case p.UINT64:
        case p.FIXED64:
        case p.INT64:
        case p.SFIXED64:
        case p.SINT64:
          switch (n) {
            case L.BIGINT:
              return i == "bigint";
            case L.NUMBER:
              return i == "number" && !isNaN(e);
            default:
              return i == "string";
          }
        case p.BOOL:
          return i == "boolean";
        case p.STRING:
          return i == "string";
        case p.BYTES:
          return e instanceof Uint8Array;
        case p.DOUBLE:
        case p.FLOAT:
          return i == "number" && !isNaN(e);
        default:
          return i == "number" && Number.isInteger(e);
      }
    }
    scalars(e, t, n, i) {
      if (!Array.isArray(e)) return !1;
      if (n < 2) return !0;
      if (Array.isArray(e)) {
        for (let r = 0; r < e.length && r < n; r++)
          if (!this.scalar(e[r], t, i)) return !1;
      }
      return !0;
    }
    mapKeys(e, t, n) {
      let i = Object.keys(e);
      switch (t) {
        case p.INT32:
        case p.FIXED32:
        case p.SFIXED32:
        case p.SINT32:
        case p.UINT32:
          return this.scalars(
            i.slice(0, n).map((r) => parseInt(r)),
            t,
            n
          );
        case p.BOOL:
          return this.scalars(
            i.slice(0, n).map((r) => r == "true" ? !0 : r == "false" ? !1 : r),
            t,
            n
          );
        default:
          return this.scalars(i, t, n, L.STRING);
      }
    }
  }, Ma = g(h()), Ea = g(h());
  function D(l, e) {
    switch (e) {
      case L.BIGINT:
        return l.toBigInt();
      case L.NUMBER:
        return l.toNumber();
      default:
        return l.toString();
    }
  }
  var Ee = class {
    constructor(e) {
      this.info = e;
    }
    prepare() {
      var e;
      if (this.fMap === void 0) {
        this.fMap = {};
        let t = (e = this.info.fields) !== null && e !== void 0 ? e : [];
        for (let n of t)
          this.fMap[n.name] = n, this.fMap[n.jsonName] = n, this.fMap[n.localName] = n;
      }
    }
    assert(e, t, n) {
      if (!e) {
        let i = Be(n);
        throw (i == "number" || i == "boolean") && (i = n.toString()), new Error(`Cannot parse JSON ${i} for ${this.info.typeName}#${t}`);
      }
    }
    read(e, t, n) {
      this.prepare();
      let i = [];
      for (let [r, c] of Object.entries(e)) {
        let o = this.fMap[r];
        if (!o) {
          if (!n.ignoreUnknownFields)
            throw new Error(
              `Found unknown field while reading ${this.info.typeName} from JSON format. JSON key: ${r}`
            );
          continue;
        }
        let s = o.localName, a;
        if (o.oneof) {
          if (c === null && (o.kind !== "enum" || o.T()[0] !== "google.protobuf.NullValue"))
            continue;
          if (i.includes(o.oneof))
            throw new Error(
              `Multiple members of the oneof group "${o.oneof}" of ${this.info.typeName} are present in JSON.`
            );
          i.push(o.oneof), a = t[o.oneof] = { oneofKind: s };
        } else a = t;
        if (o.kind == "map") {
          if (c === null) continue;
          this.assert(Sr(c), o.name, c);
          let u = a[s];
          for (let [B, w] of Object.entries(c)) {
            this.assert(w !== null, o.name + " map value", null);
            let b;
            switch (o.V.kind) {
              case "message":
                b = o.V.T().internalJsonRead(w, n);
                break;
              case "enum":
                if (b = this.enum(o.V.T(), w, o.name, n.ignoreUnknownFields), b === !1)
                  continue;
                break;
              case "scalar":
                b = this.scalar(w, o.V.T, o.V.L, o.name);
                break;
            }
            this.assert(b !== void 0, o.name + " map value", w);
            let I = B;
            o.K == p.BOOL && (I = I == "true" ? !0 : I == "false" ? !1 : I), I = this.scalar(I, o.K, L.STRING, o.name).toString(), u[I] = b;
          }
        } else if (o.repeat) {
          if (c === null) continue;
          this.assert(Array.isArray(c), o.name, c);
          let u = a[s];
          for (let B of c) {
            this.assert(B !== null, o.name, null);
            let w;
            switch (o.kind) {
              case "message":
                w = o.T().internalJsonRead(B, n);
                break;
              case "enum":
                if (w = this.enum(o.T(), B, o.name, n.ignoreUnknownFields), w === !1)
                  continue;
                break;
              case "scalar":
                w = this.scalar(B, o.T, o.L, o.name);
                break;
            }
            this.assert(w !== void 0, o.name, c), u.push(w);
          }
        } else
          switch (o.kind) {
            case "message":
              if (c === null && o.T().typeName != "google.protobuf.Value") {
                this.assert(o.oneof === void 0, o.name + " (oneof member)", null);
                continue;
              }
              a[s] = o.T().internalJsonRead(c, n, a[s]);
              break;
            case "enum":
              let u = this.enum(o.T(), c, o.name, n.ignoreUnknownFields);
              if (u === !1) continue;
              a[s] = u;
              break;
            case "scalar":
              a[s] = this.scalar(c, o.T, o.L, o.name);
              break;
          }
      }
    }
    enum(e, t, n, i) {
      if (e[0] == "google.protobuf.NullValue" && R(
        t === null || t === "NULL_VALUE",
        `Unable to parse field ${this.info.typeName}#${n}, enum ${e[0]} only accepts null.`
      ), t === null)
        return 0;
      switch (typeof t) {
        case "number":
          return R(
            Number.isInteger(t),
            `Unable to parse field ${this.info.typeName}#${n}, enum can only be integral number, got ${t}.`
          ), t;
        case "string":
          let r = t;
          e[2] && t.substring(0, e[2].length) === e[2] && (r = t.substring(e[2].length));
          let c = e[1][r];
          return typeof c > "u" && i ? !1 : (R(
            typeof c == "number",
            `Unable to parse field ${this.info.typeName}#${n}, enum ${e[0]} has no value for "${t}".`
          ), c);
      }
      R(
        !1,
        `Unable to parse field ${this.info.typeName}#${n}, cannot parse enum value from ${typeof t}".`
      );
    }
    scalar(e, t, n, i) {
      let r;
      try {
        switch (t) {
          case p.DOUBLE:
          case p.FLOAT:
            if (e === null) return 0;
            if (e === "NaN") return Number.NaN;
            if (e === "Infinity") return Number.POSITIVE_INFINITY;
            if (e === "-Infinity") return Number.NEGATIVE_INFINITY;
            if (e === "") {
              r = "empty string";
              break;
            }
            if (typeof e == "string" && e.trim().length !== e.length) {
              r = "extra whitespace";
              break;
            }
            if (typeof e != "string" && typeof e != "number") break;
            let c = Number(e);
            if (Number.isNaN(c)) {
              r = "not a number";
              break;
            }
            if (!Number.isFinite(c)) {
              r = "too large or small";
              break;
            }
            return t == p.FLOAT && ee(c), c;
          case p.INT32:
          case p.FIXED32:
          case p.SFIXED32:
          case p.SINT32:
          case p.UINT32:
            if (e === null) return 0;
            let o;
            if (typeof e == "number" ? o = e : e === "" ? r = "empty string" : typeof e == "string" && (e.trim().length !== e.length ? r = "extra whitespace" : o = Number(e)), o === void 0)
              break;
            return t == p.UINT32 ? X(o) : H(o), o;
          case p.INT64:
          case p.SFIXED64:
          case p.SINT64:
            if (e === null) return D(T.ZERO, n);
            if (typeof e != "number" && typeof e != "string") break;
            return D(T.from(e), n);
          case p.FIXED64:
          case p.UINT64:
            if (e === null) return D(O.ZERO, n);
            if (typeof e != "number" && typeof e != "string") break;
            return D(O.from(e), n);
          case p.BOOL:
            if (e === null) return !1;
            if (typeof e != "boolean") break;
            return e;
          case p.STRING:
            if (e === null) return "";
            if (typeof e != "string") {
              r = "extra whitespace";
              break;
            }
            try {
              encodeURIComponent(e);
            } catch (s) {
              s = "invalid UTF8";
              break;
            }
            return e;
          case p.BYTES:
            if (e === null || e === "") return new Uint8Array(0);
            if (typeof e != "string") break;
            return Te(e);
        }
      } catch (c) {
        r = c.message;
      }
      this.assert(!1, i + (r ? " - " + r : ""), e);
    }
  }, Ja = g(h()), Fe = class {
    constructor(e) {
      var t;
      this.fields = (t = e.fields) !== null && t !== void 0 ? t : [];
    }
    write(e, t) {
      let n = {}, i = e;
      for (let r of this.fields) {
        if (!r.oneof) {
          let a = this.field(r, i[r.localName], t);
          a !== void 0 && (n[t.useProtoFieldName ? r.name : r.jsonName] = a);
          continue;
        }
        let c = i[r.oneof];
        if (c.oneofKind !== r.localName) continue;
        let o = r.kind == "scalar" || r.kind == "enum" ? Object.assign(Object.assign({}, t), { emitDefaultValues: !0 }) : t, s = this.field(r, c[r.localName], o);
        R(s !== void 0), n[t.useProtoFieldName ? r.name : r.jsonName] = s;
      }
      return n;
    }
    field(e, t, n) {
      let i;
      if (e.kind == "map") {
        R(typeof t == "object" && t !== null);
        let r = {};
        switch (e.V.kind) {
          case "scalar":
            for (let [s, a] of Object.entries(t)) {
              let u = this.scalar(e.V.T, a, e.name, !1, !0);
              R(u !== void 0), r[s.toString()] = u;
            }
            break;
          case "message":
            let c = e.V.T();
            for (let [s, a] of Object.entries(t)) {
              let u = this.message(c, a, e.name, n);
              R(u !== void 0), r[s.toString()] = u;
            }
            break;
          case "enum":
            let o = e.V.T();
            for (let [s, a] of Object.entries(t)) {
              R(a === void 0 || typeof a == "number");
              let u = this.enum(o, a, e.name, !1, !0, n.enumAsInteger);
              R(u !== void 0), r[s.toString()] = u;
            }
            break;
        }
        (n.emitDefaultValues || Object.keys(r).length > 0) && (i = r);
      } else if (e.repeat) {
        R(Array.isArray(t));
        let r = [];
        switch (e.kind) {
          case "scalar":
            for (let s = 0; s < t.length; s++) {
              let a = this.scalar(e.T, t[s], e.name, e.opt, !0);
              R(a !== void 0), r.push(a);
            }
            break;
          case "enum":
            let c = e.T();
            for (let s = 0; s < t.length; s++) {
              R(t[s] === void 0 || typeof t[s] == "number");
              let a = this.enum(c, t[s], e.name, e.opt, !0, n.enumAsInteger);
              R(a !== void 0), r.push(a);
            }
            break;
          case "message":
            let o = e.T();
            for (let s = 0; s < t.length; s++) {
              let a = this.message(o, t[s], e.name, n);
              R(a !== void 0), r.push(a);
            }
            break;
        }
        (n.emitDefaultValues || r.length > 0 || n.emitDefaultValues) && (i = r);
      } else
        switch (e.kind) {
          case "scalar":
            i = this.scalar(e.T, t, e.name, e.opt, n.emitDefaultValues);
            break;
          case "enum":
            i = this.enum(
              e.T(),
              t,
              e.name,
              e.opt,
              n.emitDefaultValues,
              n.enumAsInteger
            );
            break;
          case "message":
            i = this.message(e.T(), t, e.name, n);
            break;
        }
      return i;
    }
    enum(e, t, n, i, r, c) {
      if (e[0] == "google.protobuf.NullValue") return !r && !i ? void 0 : null;
      if (t === void 0) {
        R(i);
        return;
      }
      if (!(t === 0 && !r && !i))
        return R(typeof t == "number"), R(Number.isInteger(t)), c || !e[1].hasOwnProperty(t) ? t : e[2] ? e[2] + e[1][t] : e[1][t];
    }
    message(e, t, n, i) {
      return t === void 0 ? i.emitDefaultValues ? null : void 0 : e.internalJsonWrite(t, i);
    }
    scalar(e, t, n, i, r) {
      if (t === void 0) {
        R(i);
        return;
      }
      let c = r || i;
      switch (e) {
        case p.INT32:
        case p.SFIXED32:
        case p.SINT32:
          return t === 0 ? c ? 0 : void 0 : (H(t), t);
        case p.FIXED32:
        case p.UINT32:
          return t === 0 ? c ? 0 : void 0 : (X(t), t);
        case p.FLOAT:
          ee(t);
        case p.DOUBLE:
          return t === 0 ? c ? 0 : void 0 : (R(typeof t == "number"), Number.isNaN(t) ? "NaN" : t === Number.POSITIVE_INFINITY ? "Infinity" : t === Number.NEGATIVE_INFINITY ? "-Infinity" : t);
        case p.STRING:
          return t === "" ? c ? "" : void 0 : (R(typeof t == "string"), t);
        case p.BOOL:
          return t === !1 ? c ? !1 : void 0 : (R(typeof t == "boolean"), t);
        case p.UINT64:
        case p.FIXED64:
          R(typeof t == "number" || typeof t == "string" || typeof t == "bigint");
          let o = O.from(t);
          return o.isZero() && !c ? void 0 : o.toString();
        case p.INT64:
        case p.SFIXED64:
        case p.SINT64:
          R(typeof t == "number" || typeof t == "string" || typeof t == "bigint");
          let s = T.from(t);
          return s.isZero() && !c ? void 0 : s.toString();
        case p.BYTES:
          return R(t instanceof Uint8Array), t.byteLength ? Q(t) : c ? "" : void 0;
      }
    }
  }, io = g(h()), Za = g(h());
  function he(l, e = L.STRING) {
    switch (l) {
      case p.BOOL:
        return !1;
      case p.UINT64:
      case p.FIXED64:
        return D(O.ZERO, e);
      case p.INT64:
      case p.SFIXED64:
      case p.SINT64:
        return D(T.ZERO, e);
      case p.DOUBLE:
      case p.FLOAT:
        return 0;
      case p.BYTES:
        return new Uint8Array(0);
      case p.STRING:
        return "";
      default:
        return 0;
    }
  }
  var Le = class {
    constructor(e) {
      this.info = e;
    }
    prepare() {
      var e;
      if (!this.fieldNoToField) {
        let t = (e = this.info.fields) !== null && e !== void 0 ? e : [];
        this.fieldNoToField = new Map(t.map((n) => [n.no, n]));
      }
    }
    read(e, t, n, i) {
      this.prepare();
      let r = i === void 0 ? e.len : e.pos + i;
      for (; e.pos < r; ) {
        let [c, o] = e.tag(), s = this.fieldNoToField.get(c);
        if (!s) {
          let w = n.readUnknownField;
          if (w == "throw")
            throw new Error(
              `Unknown field ${c} (wire type ${o}) for ${this.info.typeName}`
            );
          let b = e.skip(o);
          w !== !1 && (w === !0 ? d.onRead : w)(this.info.typeName, t, c, o, b);
          continue;
        }
        let a = t, u = s.repeat, B = s.localName;
        switch (s.oneof && (a = a[s.oneof], a.oneofKind !== B && (a = t[s.oneof] = { oneofKind: B })), s.kind) {
          case "scalar":
          case "enum":
            let w = s.kind == "enum" ? p.INT32 : s.T, b = s.kind == "scalar" ? s.L : void 0;
            if (u) {
              let N = a[B];
              if (o == f.LengthDelimited && w != p.STRING && w != p.BYTES) {
                let k = e.uint32() + e.pos;
                for (; e.pos < k; ) N.push(this.scalar(e, w, b));
              } else N.push(this.scalar(e, w, b));
            } else a[B] = this.scalar(e, w, b);
            break;
          case "message":
            if (u) {
              let N = a[B], k = s.T().internalBinaryRead(e, e.uint32(), n);
              N.push(k);
            } else a[B] = s.T().internalBinaryRead(e, e.uint32(), n, a[B]);
            break;
          case "map":
            let [I, $] = this.mapEntry(s, e, n);
            a[B][I] = $;
            break;
        }
      }
    }
    mapEntry(e, t, n) {
      let i = t.uint32(), r = t.pos + i, c, o;
      for (; t.pos < r; ) {
        let [s, a] = t.tag();
        switch (s) {
          case 1:
            e.K == p.BOOL ? c = t.bool().toString() : c = this.scalar(t, e.K, L.STRING);
            break;
          case 2:
            switch (e.V.kind) {
              case "scalar":
                o = this.scalar(t, e.V.T, e.V.L);
                break;
              case "enum":
                o = t.int32();
                break;
              case "message":
                o = e.V.T().internalBinaryRead(t, t.uint32(), n);
                break;
            }
            break;
          default:
            throw new Error(
              `Unknown field ${s} (wire type ${a}) in map entry for ${this.info.typeName}#${e.name}`
            );
        }
      }
      if (c === void 0) {
        let s = he(e.K);
        c = e.K == p.BOOL ? s.toString() : s;
      }
      if (o === void 0)
        switch (e.V.kind) {
          case "scalar":
            o = he(e.V.T, e.V.L);
            break;
          case "enum":
            o = 0;
            break;
          case "message":
            o = e.V.T().create();
            break;
        }
      return [c, o];
    }
    scalar(e, t, n) {
      switch (t) {
        case p.INT32:
          return e.int32();
        case p.STRING:
          return e.string();
        case p.BOOL:
          return e.bool();
        case p.DOUBLE:
          return e.double();
        case p.FLOAT:
          return e.float();
        case p.INT64:
          return D(e.int64(), n);
        case p.UINT64:
          return D(e.uint64(), n);
        case p.FIXED64:
          return D(e.fixed64(), n);
        case p.FIXED32:
          return e.fixed32();
        case p.BYTES:
          return e.bytes();
        case p.UINT32:
          return e.uint32();
        case p.SFIXED32:
          return e.sfixed32();
        case p.SFIXED64:
          return D(e.sfixed64(), n);
        case p.SINT32:
          return e.sint32();
        case p.SINT64:
          return D(e.sint64(), n);
      }
    }
  }, uo = g(h()), Ae = class {
    constructor(e) {
      this.info = e;
    }
    prepare() {
      if (!this.fields) {
        let e = this.info.fields ? this.info.fields.concat() : [];
        this.fields = e.sort((t, n) => t.no - n.no);
      }
    }
    write(e, t, n) {
      this.prepare();
      for (let r of this.fields) {
        let c, o, s = r.repeat, a = r.localName;
        if (r.oneof) {
          let u = e[r.oneof];
          if (u.oneofKind !== a) continue;
          c = u[a], o = !0;
        } else c = e[a], o = !1;
        switch (r.kind) {
          case "scalar":
          case "enum":
            let u = r.kind == "enum" ? p.INT32 : r.T;
            if (s)
              if (R(Array.isArray(c)), s == ye.PACKED)
                this.packed(t, u, r.no, c);
              else for (let B of c) this.scalar(t, u, r.no, B, !0);
            else c === void 0 ? R(r.opt) : this.scalar(t, u, r.no, c, o || r.opt);
            break;
          case "message":
            if (s) {
              R(Array.isArray(c));
              for (let B of c) this.message(t, n, r.T(), r.no, B);
            } else this.message(t, n, r.T(), r.no, c);
            break;
          case "map":
            R(typeof c == "object" && c !== null);
            for (let [B, w] of Object.entries(c)) this.mapEntry(t, n, r, B, w);
            break;
        }
      }
      let i = n.writeUnknownFields;
      i !== !1 && (i === !0 ? d.onWrite : i)(this.info.typeName, e, t);
    }
    mapEntry(e, t, n, i, r) {
      e.tag(n.no, f.LengthDelimited), e.fork();
      let c = i;
      switch (n.K) {
        case p.INT32:
        case p.FIXED32:
        case p.UINT32:
        case p.SFIXED32:
        case p.SINT32:
          c = Number.parseInt(i);
          break;
        case p.BOOL:
          R(i == "true" || i == "false"), c = i == "true";
          break;
      }
      switch (this.scalar(e, n.K, 1, c, !0), n.V.kind) {
        case "scalar":
          this.scalar(e, n.V.T, 2, r, !0);
          break;
        case "enum":
          this.scalar(e, p.INT32, 2, r, !0);
          break;
        case "message":
          this.message(e, t, n.V.T(), 2, r);
          break;
      }
      e.join();
    }
    message(e, t, n, i, r) {
      r !== void 0 && (n.internalBinaryWrite(r, e.tag(i, f.LengthDelimited).fork(), t), e.join());
    }
    scalar(e, t, n, i, r) {
      let [c, o, s] = this.scalarInfo(t, i);
      (!s || r) && (e.tag(n, c), e[o](i));
    }
    packed(e, t, n, i) {
      if (!i.length) return;
      R(t !== p.BYTES && t !== p.STRING), e.tag(n, f.LengthDelimited), e.fork();
      let [, r] = this.scalarInfo(t);
      for (let c = 0; c < i.length; c++) e[r](i[c]);
      e.join();
    }
    scalarInfo(e, t) {
      let n = f.Varint, i, r = t === void 0, c = t === 0;
      switch (e) {
        case p.INT32:
          i = "int32";
          break;
        case p.STRING:
          c = r || !t.length, n = f.LengthDelimited, i = "string";
          break;
        case p.BOOL:
          c = t === !1, i = "bool";
          break;
        case p.UINT32:
          i = "uint32";
          break;
        case p.DOUBLE:
          n = f.Bit64, i = "double";
          break;
        case p.FLOAT:
          n = f.Bit32, i = "float";
          break;
        case p.INT64:
          c = r || T.from(t).isZero(), i = "int64";
          break;
        case p.UINT64:
          c = r || O.from(t).isZero(), i = "uint64";
          break;
        case p.FIXED64:
          c = r || O.from(t).isZero(), n = f.Bit64, i = "fixed64";
          break;
        case p.BYTES:
          c = r || !t.byteLength, n = f.LengthDelimited, i = "bytes";
          break;
        case p.FIXED32:
          n = f.Bit32, i = "fixed32";
          break;
        case p.SFIXED32:
          n = f.Bit32, i = "sfixed32";
          break;
        case p.SFIXED64:
          c = r || T.from(t).isZero(), n = f.Bit64, i = "sfixed64";
          break;
        case p.SINT32:
          i = "sint32";
          break;
        case p.SINT64:
          c = r || T.from(t).isZero(), i = "sint64";
          break;
      }
      return [n, i, r || c];
    }
  }, ho = g(h());
  function Kr(l) {
    let e = l.messagePrototype ? Object.create(l.messagePrototype) : Object.defineProperty({}, Pe, { value: l });
    for (let t of l.fields) {
      let n = t.localName;
      if (!t.opt)
        if (t.oneof) e[t.oneof] = { oneofKind: void 0 };
        else if (t.repeat) e[n] = [];
        else
          switch (t.kind) {
            case "scalar":
              e[n] = he(t.T, t.L);
              break;
            case "enum":
              e[n] = 0;
              break;
            case "map":
              e[n] = {};
              break;
          }
    }
    return e;
  }
  var go = g(h());
  function y(l, e, t) {
    let n, i = t, r;
    for (let c of l.fields) {
      let o = c.localName;
      if (c.oneof) {
        let s = i[c.oneof];
        if (s?.oneofKind == null) continue;
        if (n = s[o], r = e[c.oneof], r.oneofKind = s.oneofKind, n == null) {
          delete r[o];
          continue;
        }
      } else if (n = i[o], r = e, n == null) continue;
      switch (c.repeat && (r[o].length = n.length), c.kind) {
        case "scalar":
        case "enum":
          if (c.repeat) for (let a = 0; a < n.length; a++) r[o][a] = n[a];
          else r[o] = n;
          break;
        case "message":
          let s = c.T();
          if (c.repeat)
            for (let a = 0; a < n.length; a++) r[o][a] = s.create(n[a]);
          else r[o] === void 0 ? r[o] = s.create(n) : s.mergePartial(r[o], n);
          break;
        case "map":
          switch (c.V.kind) {
            case "scalar":
            case "enum":
              Object.assign(r[o], n);
              break;
            case "message":
              let a = c.V.T();
              for (let u of Object.keys(n)) r[o][u] = a.create(n[u]);
              break;
          }
          break;
      }
    }
  }
  var Ro = g(h());
  function Jr(l, e, t) {
    if (e === t) return !0;
    if (!e || !t) return !1;
    for (let n of l.fields) {
      let i = n.localName, r = n.oneof ? e[n.oneof][i] : e[i], c = n.oneof ? t[n.oneof][i] : t[i];
      switch (n.kind) {
        case "enum":
        case "scalar":
          let o = n.kind == "enum" ? p.INT32 : n.T;
          if (!(n.repeat ? Hr(o, r, c) : Xr(o, r, c))) return !1;
          break;
        case "map":
          if (!(n.V.kind == "message" ? _r(n.V.T(), De(r), De(c)) : Hr(n.V.kind == "enum" ? p.INT32 : n.V.T, De(r), De(c))))
            return !1;
          break;
        case "message":
          let s = n.T();
          if (!(n.repeat ? _r(s, r, c) : s.equals(r, c))) return !1;
          break;
      }
    }
    return !0;
  }
  var De = Object.values;
  function Xr(l, e, t) {
    if (e === t) return !0;
    if (l !== p.BYTES) return !1;
    let n = e, i = t;
    if (n.length !== i.length) return !1;
    for (let r = 0; r < n.length; r++) if (n[r] != i[r]) return !1;
    return !0;
  }
  function Hr(l, e, t) {
    if (e.length !== t.length) return !1;
    for (let n = 0; n < e.length; n++) if (!Xr(l, e[n], t[n])) return !1;
    return !0;
  }
  function _r(l, e, t) {
    if (e.length !== t.length) return !1;
    for (let n = 0; n < e.length; n++) if (!l.equals(e[n], t[n])) return !1;
    return !0;
  }
  var Ci = Object.getOwnPropertyDescriptors(Object.getPrototypeOf({})), m = class {
    constructor(e, t, n) {
      this.defaultCheckDepth = 16, this.typeName = e, this.fields = t.map(vr), this.options = n ?? {}, this.messagePrototype = Object.create(
        null,
        Object.assign(Object.assign({}, Ci), { [Pe]: { value: this } })
      ), this.refTypeCheck = new Ue(this), this.refJsonReader = new Ee(this), this.refJsonWriter = new Fe(this), this.refBinReader = new Le(this), this.refBinWriter = new Ae(this);
    }
    create(e) {
      let t = Kr(this);
      return e !== void 0 && y(this, t, e), t;
    }
    clone(e) {
      let t = this.create();
      return y(this, t, e), t;
    }
    equals(e, t) {
      return Jr(this, e, t);
    }
    is(e, t = this.defaultCheckDepth) {
      return this.refTypeCheck.is(e, t, !1);
    }
    isAssignable(e, t = this.defaultCheckDepth) {
      return this.refTypeCheck.is(e, t, !0);
    }
    mergePartial(e, t) {
      y(this, e, t);
    }
    fromBinary(e, t) {
      let n = Lr(t);
      return this.internalBinaryRead(n.readerFactory(e), e.byteLength, n);
    }
    fromJson(e, t) {
      return this.internalJsonRead(e, Vr(t));
    }
    fromJsonString(e, t) {
      let n = JSON.parse(e);
      return this.fromJson(n, t);
    }
    toJson(e, t) {
      return this.internalJsonWrite(e, Mr(t));
    }
    toJsonString(e, t) {
      var n;
      let i = this.toJson(e, t);
      return JSON.stringify(
        i,
        null,
        (n = t?.prettySpaces) !== null && n !== void 0 ? n : 0
      );
    }
    toBinary(e, t) {
      let n = Dr(t);
      return this.internalBinaryWrite(e, n.writerFactory(), n).finish();
    }
    internalJsonRead(e, t, n) {
      if (e !== null && typeof e == "object" && !Array.isArray(e)) {
        let i = n ?? this.create();
        return this.refJsonReader.read(e, i, t), i;
      }
      throw new Error(
        `Unable to parse message ${this.typeName} from JSON ${Be(e)}.`
      );
    }
    internalJsonWrite(e, t) {
      return this.refJsonWriter.write(e, t);
    }
    internalBinaryWrite(e, t, n) {
      return this.refBinWriter.write(e, t, n), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create();
      return this.refBinReader.read(e, r, n, t), r;
    }
  }, us = g(h(), 1), qo = g(h(), 1), Je = class extends m {
    constructor() {
      super("youtube.component.Label", [
        { no: 1, name: "runs", kind: "message", repeat: 1, T: () => q }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.runs = [], e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.runs.push(q.internalBinaryRead(e, e.uint32(), n));
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      for (let r = 0; r < e.runs.length; r++)
        q.internalBinaryWrite(
          e.runs[r],
          t.tag(1, f.LengthDelimited).fork(),
          n
        ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, W = new Je(), Xe = class extends m {
    constructor() {
      super("youtube.component.Run", [
        { no: 1, name: "text", kind: "scalar", T: 9 }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.text = "", e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.text = e.string();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.text !== "" && t.tag(1, f.LengthDelimited).string(e.text);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, q = new Xe(), ts = g(h(), 1), ze = class extends m {
    constructor() {
      super("youtube.component.ResponseContext", [
        {
          no: 6,
          name: "serviceTrackingParams",
          kind: "message",
          repeat: 1,
          T: () => qe
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.serviceTrackingParams = [], e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 6:
            r.serviceTrackingParams.push(
              qe.internalBinaryRead(e, e.uint32(), n)
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      for (let r = 0; r < e.serviceTrackingParams.length; r++)
        qe.internalBinaryWrite(
          e.serviceTrackingParams[r],
          t.tag(6, f.LengthDelimited).fork(),
          n
        ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, $e = new ze(), Ze = class extends m {
    constructor() {
      super("youtube.component.ServiceTrackingParam", [
        { no: 1, name: "service", kind: "scalar", T: 5 },
        { no: 2, name: "params", kind: "message", repeat: 1, T: () => Ye }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.service = 0, t.params = [], e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.service = e.int32();
            break;
          case 2:
            r.params.push(Ye.internalBinaryRead(e, e.uint32(), n));
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.service !== 0 && t.tag(1, f.Varint).int32(e.service);
      for (let r = 0; r < e.params.length; r++)
        Ye.internalBinaryWrite(
          e.params[r],
          t.tag(2, f.LengthDelimited).fork(),
          n
        ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, qe = new Ze(), Qe = class extends m {
    constructor() {
      super("youtube.component.Param", [
        { no: 1, name: "key", kind: "scalar", T: 9 },
        { no: 2, name: "value", kind: "scalar", T: 9 }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.key = "", t.value = "", e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.key = e.string();
            break;
          case 2:
            r.value = e.string();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.key !== "" && t.tag(1, f.LengthDelimited).string(e.key), e.value !== "" && t.tag(2, f.LengthDelimited).string(e.value);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, Ye = new Qe(), mt = class extends m {
    constructor() {
      super("youtube.response.browse.Browse", [
        { no: 1, name: "responseContext", kind: "message", T: () => $e },
        { no: 9, name: "content", kind: "message", T: () => E },
        {
          no: 10,
          name: "onResponseReceivedAction",
          kind: "message",
          T: () => E
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.responseContext = $e.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.responseContext
            );
            break;
          case 9:
            r.content = E.internalBinaryRead(e, e.uint32(), n, r.content);
            break;
          case 10:
            r.onResponseReceivedAction = E.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.onResponseReceivedAction
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.responseContext && $e.internalBinaryWrite(
        e.responseContext,
        t.tag(1, f.LengthDelimited).fork(),
        n
      ).join(), e.content && E.internalBinaryWrite(
        e.content,
        t.tag(9, f.LengthDelimited).fork(),
        n
      ).join(), e.onResponseReceivedAction && E.internalBinaryWrite(
        e.onResponseReceivedAction,
        t.tag(10, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, qr = new mt(), gt = class extends m {
    constructor() {
      super("youtube.response.browse.Content", [
        {
          no: 58173949,
          name: "singleColumnResultsRenderer",
          kind: "message",
          T: () => et
        },
        {
          no: 153515154,
          name: "elementRenderer",
          kind: "message",
          T: () => ne
        },
        {
          no: 49399797,
          name: "sectionListRenderer",
          kind: "message",
          T: () => Y
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 58173949:
            r.singleColumnResultsRenderer = et.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.singleColumnResultsRenderer
            );
            break;
          case 153515154:
            r.elementRenderer = ne.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.elementRenderer
            );
            break;
          case 49399797:
            r.sectionListRenderer = Y.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.sectionListRenderer
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.singleColumnResultsRenderer && et.internalBinaryWrite(
        e.singleColumnResultsRenderer,
        t.tag(58173949, f.LengthDelimited).fork(),
        n
      ).join(), e.elementRenderer && ne.internalBinaryWrite(
        e.elementRenderer,
        t.tag(153515154, f.LengthDelimited).fork(),
        n
      ).join(), e.sectionListRenderer && Y.internalBinaryWrite(
        e.sectionListRenderer,
        t.tag(49399797, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, E = new gt(), bt = class extends m {
    constructor() {
      super("youtube.response.browse.SingleColumnResultsRenderer", [
        { no: 1, name: "tabs", kind: "message", repeat: 1, T: () => tt }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.tabs = [], e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.tabs.push(tt.internalBinaryRead(e, e.uint32(), n));
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      for (let r = 0; r < e.tabs.length; r++)
        tt.internalBinaryWrite(
          e.tabs[r],
          t.tag(1, f.LengthDelimited).fork(),
          n
        ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, et = new bt(), kt = class extends m {
    constructor() {
      super("youtube.response.browse.BrowseTabSupportedRenderer", [
        { no: 58174010, name: "tabRenderer", kind: "message", T: () => nt }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 58174010:
            r.tabRenderer = nt.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.tabRenderer
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.tabRenderer && nt.internalBinaryWrite(
        e.tabRenderer,
        t.tag(58174010, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, tt = new kt(), Rt = class extends m {
    constructor() {
      super("youtube.response.browse.TabRenderer", [
        { no: 4, name: "content", kind: "message", T: () => E }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 4:
            r.content = E.internalBinaryRead(e, e.uint32(), n, r.content);
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.content && E.internalBinaryWrite(
        e.content,
        t.tag(4, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, nt = new Rt(), wt = class extends m {
    constructor() {
      super("youtube.response.browse.SectionListRenderer", [
        {
          no: 1,
          name: "sectionListSupportedRenderers",
          kind: "message",
          repeat: 1,
          T: () => rt
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.sectionListSupportedRenderers = [], e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.sectionListSupportedRenderers.push(
              rt.internalBinaryRead(e, e.uint32(), n)
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      for (let r = 0; r < e.sectionListSupportedRenderers.length; r++)
        rt.internalBinaryWrite(
          e.sectionListSupportedRenderers[r],
          t.tag(1, f.LengthDelimited).fork(),
          n
        ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, Y = new wt(), Bt = class extends m {
    constructor() {
      super("youtube.response.browse.SectionListSupportedRenderer", [
        {
          no: 50195462,
          name: "itemSectionRenderer",
          kind: "message",
          T: () => z
        },
        { no: 51845067, name: "shelfRenderer", kind: "message", T: () => dt },
        {
          no: 221496734,
          name: "musicDescriptionShelfRenderer",
          kind: "message",
          T: () => ht
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 50195462:
            r.itemSectionRenderer = z.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.itemSectionRenderer
            );
            break;
          case 51845067:
            r.shelfRenderer = dt.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.shelfRenderer
            );
            break;
          case 221496734:
            r.musicDescriptionShelfRenderer = ht.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.musicDescriptionShelfRenderer
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.itemSectionRenderer && z.internalBinaryWrite(
        e.itemSectionRenderer,
        t.tag(50195462, f.LengthDelimited).fork(),
        n
      ).join(), e.shelfRenderer && dt.internalBinaryWrite(
        e.shelfRenderer,
        t.tag(51845067, f.LengthDelimited).fork(),
        n
      ).join(), e.musicDescriptionShelfRenderer && ht.internalBinaryWrite(
        e.musicDescriptionShelfRenderer,
        t.tag(221496734, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, rt = new Bt(), It = class extends m {
    constructor() {
      super("youtube.response.browse.ItemSectionRenderer", [
        {
          no: 1,
          name: "richItemContents",
          kind: "message",
          repeat: 1,
          T: () => te
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.richItemContents = [], e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.richItemContents.push(te.internalBinaryRead(e, e.uint32(), n));
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      for (let r = 0; r < e.richItemContents.length; r++)
        te.internalBinaryWrite(
          e.richItemContents[r],
          t.tag(1, f.LengthDelimited).fork(),
          n
        ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, z = new It(), Tt = class extends m {
    constructor() {
      super("youtube.response.browse.RichItemContent", [
        {
          no: 153515154,
          name: "videoWithContextRenderer",
          kind: "message",
          T: () => ne
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 153515154:
            r.videoWithContextRenderer = ne.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.videoWithContextRenderer
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.videoWithContextRenderer && ne.internalBinaryWrite(
        e.videoWithContextRenderer,
        t.tag(153515154, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, te = new Tt(), Ct = class extends m {
    constructor() {
      super("youtube.response.browse.ElementRenderer", [
        {
          no: 172660663,
          name: "videoRendererContent",
          kind: "message",
          T: () => it
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 172660663:
            r.videoRendererContent = it.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.videoRendererContent
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.videoRendererContent && it.internalBinaryWrite(
        e.videoRendererContent,
        t.tag(172660663, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, ne = new Ct(), xt = class extends m {
    constructor() {
      super("youtube.response.browse.VideoRendererContent", [
        { no: 1, name: "videoInfo", kind: "message", T: () => at },
        { no: 2, name: "renderInfo", kind: "message", T: () => ut }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.videoInfo = at.internalBinaryRead(e, e.uint32(), n, r.videoInfo);
            break;
          case 2:
            r.renderInfo = ut.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.renderInfo
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.videoInfo && at.internalBinaryWrite(
        e.videoInfo,
        t.tag(1, f.LengthDelimited).fork(),
        n
      ).join(), e.renderInfo && ut.internalBinaryWrite(
        e.renderInfo,
        t.tag(2, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, it = new xt(), Wt = class extends m {
    constructor() {
      super("youtube.response.browse.VideoInfo", [
        { no: 168777401, name: "videoContext", kind: "message", T: () => ot }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 168777401:
            r.videoContext = ot.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.videoContext
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.videoContext && ot.internalBinaryWrite(
        e.videoContext,
        t.tag(168777401, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, at = new Wt(), Nt = class extends m {
    constructor() {
      super("youtube.response.browse.VideoContext", [
        { no: 5, name: "videoContent", kind: "message", T: () => st }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 5:
            r.videoContent = st.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.videoContent
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.videoContent && st.internalBinaryWrite(
        e.videoContent,
        t.tag(5, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, ot = new Nt(), St = class extends m {
    constructor() {
      super("youtube.response.browse.VideoContent", [
        {
          no: 465160965,
          name: "timedLyricsRender",
          kind: "message",
          T: () => lt
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 465160965:
            r.timedLyricsRender = lt.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.timedLyricsRender
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.timedLyricsRender && lt.internalBinaryWrite(
        e.timedLyricsRender,
        t.tag(465160965, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, st = new St(), Ot = class extends m {
    constructor() {
      super("youtube.response.browse.TimedLyricsRender", [
        { no: 4, name: "timedLyricsContent", kind: "message", T: () => ct }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 4:
            r.timedLyricsContent = ct.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.timedLyricsContent
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.timedLyricsContent && ct.internalBinaryWrite(
        e.timedLyricsContent,
        t.tag(4, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, lt = new Ot(), Pt = class extends m {
    constructor() {
      super("youtube.response.browse.TimedLyricsContent", [
        { no: 1, name: "runs", kind: "message", repeat: 1, T: () => q },
        { no: 2, name: "footerLabel", kind: "scalar", T: 9 }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.runs = [], t.footerLabel = "", e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.runs.push(q.internalBinaryRead(e, e.uint32(), n));
            break;
          case 2:
            r.footerLabel = e.string();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      for (let r = 0; r < e.runs.length; r++)
        q.internalBinaryWrite(
          e.runs[r],
          t.tag(1, f.LengthDelimited).fork(),
          n
        ).join();
      e.footerLabel !== "" && t.tag(2, f.LengthDelimited).string(e.footerLabel);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, ct = new Pt(), Ut = class extends m {
    constructor() {
      super("youtube.response.browse.RenderInfo", [
        { no: 183314536, name: "layoutRender", kind: "message", T: () => ft }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 183314536:
            r.layoutRender = ft.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.layoutRender
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.layoutRender && ft.internalBinaryWrite(
        e.layoutRender,
        t.tag(183314536, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, ut = new Ut(), Et = class extends m {
    constructor() {
      super("youtube.response.browse.LayoutRender", [
        { no: 1, name: "eml", kind: "scalar", T: 9 }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.eml = "", e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.eml = e.string();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.eml !== "" && t.tag(1, f.LengthDelimited).string(e.eml);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, ft = new Et(), Ft = class extends m {
    constructor() {
      super("youtube.response.browse.ShelfRenderer", [
        { no: 5, name: "richSectionContent", kind: "message", T: () => pt }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 5:
            r.richSectionContent = pt.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.richSectionContent
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.richSectionContent && pt.internalBinaryWrite(
        e.richSectionContent,
        t.tag(5, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, dt = new Ft(), Lt = class extends m {
    constructor() {
      super("youtube.response.browse.RichSectionContent", [
        {
          no: 51431404,
          name: "reelShelfRenderer",
          kind: "message",
          T: () => yt
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 51431404:
            r.reelShelfRenderer = yt.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.reelShelfRenderer
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.reelShelfRenderer && yt.internalBinaryWrite(
        e.reelShelfRenderer,
        t.tag(51431404, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, pt = new Lt(), At = class extends m {
    constructor() {
      super("youtube.response.browse.ReelShelfRenderer", [
        {
          no: 1,
          name: "richItemContents",
          kind: "message",
          repeat: 1,
          T: () => te
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.richItemContents = [], e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.richItemContents.push(te.internalBinaryRead(e, e.uint32(), n));
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      for (let r = 0; r < e.richItemContents.length; r++)
        te.internalBinaryWrite(
          e.richItemContents[r],
          t.tag(1, f.LengthDelimited).fork(),
          n
        ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, yt = new At(), Dt = class extends m {
    constructor() {
      super("youtube.response.browse.MusicDescriptionShelfRenderer", [
        { no: 3, name: "description", kind: "message", T: () => W },
        { no: 10, name: "footer", kind: "message", T: () => W }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 3:
            r.description = W.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.description
            );
            break;
          case 10:
            r.footer = W.internalBinaryRead(e, e.uint32(), n, r.footer);
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.description && W.internalBinaryWrite(
        e.description,
        t.tag(3, f.LengthDelimited).fork(),
        n
      ).join(), e.footer && W.internalBinaryWrite(
        e.footer,
        t.tag(10, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, ht = new Dt(), gs = g(h(), 1), Vt = class extends m {
    constructor() {
      super("youtube.response.next.Next", [
        { no: 7, name: "content", kind: "message", T: () => $t },
        {
          no: 8,
          name: "onResponseReceivedAction",
          kind: "message",
          T: () => E
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 7:
            r.content = $t.internalBinaryRead(e, e.uint32(), n, r.content);
            break;
          case 8:
            r.onResponseReceivedAction = E.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.onResponseReceivedAction
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.content && $t.internalBinaryWrite(e.content, t.tag(7, f.LengthDelimited).fork(), n).join(), e.onResponseReceivedAction && E.internalBinaryWrite(
        e.onResponseReceivedAction,
        t.tag(8, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, re = new Vt(), Mt = class extends m {
    constructor() {
      super("youtube.response.next.Content", [
        { no: 51779735, name: "nextResult", kind: "message", T: () => jt }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 51779735:
            r.nextResult = jt.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.nextResult
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.nextResult && jt.internalBinaryWrite(
        e.nextResult,
        t.tag(51779735, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, $t = new Mt(), vt = class extends m {
    constructor() {
      super("youtube.response.next.NextResult", [
        { no: 1, name: "content", kind: "message", T: () => E }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.content = E.internalBinaryRead(e, e.uint32(), n, r.content);
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.content && E.internalBinaryWrite(
        e.content,
        t.tag(1, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, jt = new vt(), xs = g(h(), 1), Kt = class extends m {
    constructor() {
      super("youtube.response.search.Search", [
        { no: 4, name: "content", kind: "message", T: () => E },
        {
          no: 7,
          name: "onResponseReceivedCommand",
          kind: "message",
          T: () => Gt
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 4:
            r.content = E.internalBinaryRead(e, e.uint32(), n, r.content);
            break;
          case 7:
            r.onResponseReceivedCommand = Gt.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.onResponseReceivedCommand
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.content && E.internalBinaryWrite(
        e.content,
        t.tag(4, f.LengthDelimited).fork(),
        n
      ).join(), e.onResponseReceivedCommand && Gt.internalBinaryWrite(
        e.onResponseReceivedCommand,
        t.tag(7, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, Yr = new Kt(), Ht = class extends m {
    constructor() {
      super("youtube.response.search.OnResponseReceivedCommand", [
        {
          no: 50195462,
          name: "itemSectionRenderer",
          kind: "message",
          T: () => z
        },
        {
          no: 49399797,
          name: "appendContinuationItemsAction",
          kind: "message",
          T: () => Y
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 50195462:
            r.itemSectionRenderer = z.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.itemSectionRenderer
            );
            break;
          case 49399797:
            r.appendContinuationItemsAction = Y.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.appendContinuationItemsAction
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.itemSectionRenderer && z.internalBinaryWrite(
        e.itemSectionRenderer,
        t.tag(50195462, f.LengthDelimited).fork(),
        n
      ).join(), e.appendContinuationItemsAction && Y.internalBinaryWrite(
        e.appendContinuationItemsAction,
        t.tag(49399797, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, Gt = new Ht(), Us = g(h(), 1), Zt = class extends m {
    constructor() {
      super("youtube.response.shorts.Shorts", [
        { no: 2, name: "entries", kind: "message", repeat: 2, T: () => _t }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.entries = [], e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 2:
            r.entries.push(_t.internalBinaryRead(e, e.uint32(), n));
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      for (let r = 0; r < e.entries.length; r++)
        _t.internalBinaryWrite(
          e.entries[r],
          t.tag(2, f.LengthDelimited).fork(),
          n
        ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, zr = new Zt(), Qt = class extends m {
    constructor() {
      super("youtube.response.shorts.Entry", [
        { no: 1, name: "command", kind: "message", T: () => Jt }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.command = Jt.internalBinaryRead(e, e.uint32(), n, r.command);
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.command && Jt.internalBinaryWrite(
        e.command,
        t.tag(1, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, _t = new Qt(), en = class extends m {
    constructor() {
      super("youtube.response.shorts.Command", [
        {
          no: 139608561,
          name: "reelWatchEndpoint",
          kind: "message",
          T: () => Xt
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 139608561:
            r.reelWatchEndpoint = Xt.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.reelWatchEndpoint
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.reelWatchEndpoint && Xt.internalBinaryWrite(
        e.reelWatchEndpoint,
        t.tag(139608561, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, Jt = new en(), tn = class extends m {
    constructor() {
      super("youtube.response.shorts.ReelWatchEndpoint", [
        { no: 8, name: "overlay", kind: "message", T: () => Yt },
        { no: 16, name: "adClientParams", kind: "message", T: () => qt }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 8:
            r.overlay = Yt.internalBinaryRead(e, e.uint32(), n, r.overlay);
            break;
          case 16:
            r.adClientParams = qt.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.adClientParams
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.overlay && Yt.internalBinaryWrite(
        e.overlay,
        t.tag(8, f.LengthDelimited).fork(),
        n
      ).join(), e.adClientParams && qt.internalBinaryWrite(
        e.adClientParams,
        t.tag(16, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, Xt = new tn(), nn = class extends m {
    constructor() {
      super("youtube.response.shorts.AdClientParams", [
        { no: 1, name: "isAd", kind: "scalar", T: 8 }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.isAd = !1, e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.isAd = e.bool();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.isAd !== !1 && t.tag(1, f.Varint).bool(e.isAd);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, qt = new nn(), rn = class extends m {
    constructor() {
      super("youtube.response.shorts.Overlay", [
        {
          no: 139970731,
          name: "reelPlayerOverlayRenderer",
          kind: "message",
          T: () => zt
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 139970731:
            r.reelPlayerOverlayRenderer = zt.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.reelPlayerOverlayRenderer
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.reelPlayerOverlayRenderer && zt.internalBinaryWrite(
        e.reelPlayerOverlayRenderer,
        t.tag(139970731, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, Yt = new rn(), an = class extends m {
    constructor() {
      super("youtube.response.shorts.ReelPlayerOverlayRenderer", [
        { no: 12, name: "style", kind: "scalar", T: 5 }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.style = 0, e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 12:
            r.style = e.int32();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.style !== 0 && t.tag(12, f.Varint).int32(e.style);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, zt = new an(), $s = g(h(), 1), ln = class extends m {
    constructor() {
      super("youtube.response.guide.Guide", [
        {
          no: 4,
          name: "labelItems",
          kind: "message",
          repeat: 1,
          T: () => ie
        },
        { no: 6, name: "iconItems", kind: "message", repeat: 1, T: () => ie }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.labelItems = [], t.iconItems = [], e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 4:
            r.labelItems.push(ie.internalBinaryRead(e, e.uint32(), n));
            break;
          case 6:
            r.iconItems.push(ie.internalBinaryRead(e, e.uint32(), n));
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      for (let r = 0; r < e.labelItems.length; r++)
        ie.internalBinaryWrite(
          e.labelItems[r],
          t.tag(4, f.LengthDelimited).fork(),
          n
        ).join();
      for (let r = 0; r < e.iconItems.length; r++)
        ie.internalBinaryWrite(
          e.iconItems[r],
          t.tag(6, f.LengthDelimited).fork(),
          n
        ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, Zr = new ln(), cn = class extends m {
    constructor() {
      super("youtube.response.guide.Item", [
        {
          no: 117866661,
          name: "guideSectionRenderer",
          kind: "message",
          T: () => on
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 117866661:
            r.guideSectionRenderer = on.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.guideSectionRenderer
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.guideSectionRenderer && on.internalBinaryWrite(
        e.guideSectionRenderer,
        t.tag(117866661, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, ie = new cn(), un = class extends m {
    constructor() {
      super("youtube.response.guide.GuideSectionRenderer", [
        {
          no: 1,
          name: "rendererItems",
          kind: "message",
          repeat: 1,
          T: () => sn
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.rendererItems = [], e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.rendererItems.push(sn.internalBinaryRead(e, e.uint32(), n));
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      for (let r = 0; r < e.rendererItems.length; r++)
        sn.internalBinaryWrite(
          e.rendererItems[r],
          t.tag(1, f.LengthDelimited).fork(),
          n
        ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, on = new un(), fn = class extends m {
    constructor() {
      super("youtube.response.guide.RendererItem", [
        { no: 318370163, name: "iconRender", kind: "message", T: () => ae },
        { no: 117501096, name: "labelRender", kind: "message", T: () => ae }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 318370163:
            r.iconRender = ae.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.iconRender
            );
            break;
          case 117501096:
            r.labelRender = ae.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.labelRender
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.iconRender && ae.internalBinaryWrite(
        e.iconRender,
        t.tag(318370163, f.LengthDelimited).fork(),
        n
      ).join(), e.labelRender && ae.internalBinaryWrite(
        e.labelRender,
        t.tag(117501096, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, sn = new fn(), dn = class extends m {
    constructor() {
      super("youtube.response.guide.guideEntryRenderer", [
        { no: 1, name: "browseId", kind: "scalar", T: 9 }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.browseId = "", e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.browseId = e.string();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.browseId !== "" && t.tag(1, f.LengthDelimited).string(e.browseId);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, ae = new dn(), Hs = g(h(), 1), Tn = class extends m {
    constructor() {
      super("youtube.response.player.Player", [
        {
          no: 7,
          name: "adPlacements",
          kind: "message",
          repeat: 1,
          T: () => pn
        },
        { no: 2, name: "playabilityStatus", kind: "message", T: () => hn },
        { no: 9, name: "playbackTracking", kind: "message", T: () => bn },
        { no: 10, name: "captions", kind: "message", T: () => kn },
        { no: 68, name: "adSlots", kind: "message", repeat: 1, T: () => Bn }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.adPlacements = [], t.adSlots = [], e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 7:
            r.adPlacements.push(pn.internalBinaryRead(e, e.uint32(), n));
            break;
          case 2:
            r.playabilityStatus = hn.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.playabilityStatus
            );
            break;
          case 9:
            r.playbackTracking = bn.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.playbackTracking
            );
            break;
          case 10:
            r.captions = kn.internalBinaryRead(e, e.uint32(), n, r.captions);
            break;
          case 68:
            r.adSlots.push(Bn.internalBinaryRead(e, e.uint32(), n));
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      for (let r = 0; r < e.adPlacements.length; r++)
        pn.internalBinaryWrite(
          e.adPlacements[r],
          t.tag(7, f.LengthDelimited).fork(),
          n
        ).join();
      e.playabilityStatus && hn.internalBinaryWrite(
        e.playabilityStatus,
        t.tag(2, f.LengthDelimited).fork(),
        n
      ).join(), e.playbackTracking && bn.internalBinaryWrite(
        e.playbackTracking,
        t.tag(9, f.LengthDelimited).fork(),
        n
      ).join(), e.captions && kn.internalBinaryWrite(
        e.captions,
        t.tag(10, f.LengthDelimited).fork(),
        n
      ).join();
      for (let r = 0; r < e.adSlots.length; r++)
        Bn.internalBinaryWrite(
          e.adSlots[r],
          t.tag(68, f.LengthDelimited).fork(),
          n
        ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, oe = new Tn(), Cn = class extends m {
    constructor() {
      super("youtube.response.player.AdPlacement", [
        {
          no: 84813246,
          name: "adPlacementRenderer",
          kind: "message",
          T: () => yn
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 84813246:
            r.adPlacementRenderer = yn.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.adPlacementRenderer
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.adPlacementRenderer && yn.internalBinaryWrite(
        e.adPlacementRenderer,
        t.tag(84813246, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, pn = new Cn(), xn = class extends m {
    constructor() {
      super("youtube.response.player.AdPlacementRenderer", [
        { no: 4, name: "params", kind: "scalar", T: 9 }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.params = "", e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 4:
            r.params = e.string();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.params !== "" && t.tag(4, f.LengthDelimited).string(e.params);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, yn = new xn(), Wn = class extends m {
    constructor() {
      super("youtube.response.player.PlayabilityStatus", [
        {
          no: 21,
          name: "pictureInPictureRender",
          kind: "message",
          T: () => me
        },
        {
          no: 11,
          name: "backgroundPlayerRender",
          kind: "message",
          T: () => ge
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 21:
            r.pictureInPictureRender = me.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.pictureInPictureRender
            );
            break;
          case 11:
            r.backgroundPlayerRender = ge.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.backgroundPlayerRender
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.pictureInPictureRender && me.internalBinaryWrite(
        e.pictureInPictureRender,
        t.tag(21, f.LengthDelimited).fork(),
        n
      ).join(), e.backgroundPlayerRender && ge.internalBinaryWrite(
        e.backgroundPlayerRender,
        t.tag(11, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, hn = new Wn(), Nn = class extends m {
    constructor() {
      super("youtube.response.player.PictureInPictureSupportedRenderer", [
        {
          no: 151635310,
          name: "pictureInPictureAbility",
          kind: "message",
          T: () => mn
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 151635310:
            r.pictureInPictureAbility = mn.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.pictureInPictureAbility
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.pictureInPictureAbility && mn.internalBinaryWrite(
        e.pictureInPictureAbility,
        t.tag(151635310, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, me = new Nn(), Sn = class extends m {
    constructor() {
      super("youtube.response.player.BackgroundSupportedRenderer", [
        {
          no: 64657230,
          name: "backgroundAbility",
          kind: "message",
          T: () => gn
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 64657230:
            r.backgroundAbility = gn.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.backgroundAbility
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.backgroundAbility && gn.internalBinaryWrite(
        e.backgroundAbility,
        t.tag(64657230, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, ge = new Sn(), On = class extends m {
    constructor() {
      super("youtube.response.player.PictureInPictureAbility", [
        { no: 1, name: "active", kind: "scalar", T: 8 },
        { no: 4, name: "f4", kind: "scalar", T: 5 },
        { no: 6, name: "f6", kind: "scalar", T: 5 },
        { no: 8, name: "f8", kind: "scalar", T: 5 }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.active = !1, t.f4 = 0, t.f6 = 0, t.f8 = 0, e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.active = e.bool();
            break;
          case 4:
            r.f4 = e.int32();
            break;
          case 6:
            r.f6 = e.int32();
            break;
          case 8:
            r.f8 = e.int32();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.active !== !1 && t.tag(1, f.Varint).bool(e.active), e.f4 !== 0 && t.tag(4, f.Varint).int32(e.f4), e.f6 !== 0 && t.tag(6, f.Varint).int32(e.f6), e.f8 !== 0 && t.tag(8, f.Varint).int32(e.f8);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, mn = new On(), Pn = class extends m {
    constructor() {
      super("youtube.response.player.BackgroundAbility", [
        { no: 1, name: "active", kind: "scalar", T: 8 }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.active = !1, e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.active = e.bool();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.active !== !1 && t.tag(1, f.Varint).bool(e.active);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, gn = new Pn(), Un = class extends m {
    constructor() {
      super("youtube.response.player.PlaybackTracking", [
        { no: 1, name: "videostatsPlaybackUrl", kind: "message", T: () => P },
        {
          no: 2,
          name: "videostatsDelayplayUrl",
          kind: "message",
          T: () => P
        },
        {
          no: 3,
          name: "videostatsWatchtimeUrl",
          kind: "message",
          T: () => P
        },
        { no: 4, name: "ptrackingUrl", kind: "message", T: () => P },
        { no: 5, name: "qoeUrl", kind: "message", T: () => P },
        { no: 13, name: "atrUrl", kind: "message", T: () => P },
        { no: 15, name: "videostatsEngageUrl", kind: "message", T: () => P },
        {
          no: 18,
          name: "pageadViewthroughconversion",
          kind: "message",
          T: () => P
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.videostatsPlaybackUrl = P.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.videostatsPlaybackUrl
            );
            break;
          case 2:
            r.videostatsDelayplayUrl = P.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.videostatsDelayplayUrl
            );
            break;
          case 3:
            r.videostatsWatchtimeUrl = P.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.videostatsWatchtimeUrl
            );
            break;
          case 4:
            r.ptrackingUrl = P.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.ptrackingUrl
            );
            break;
          case 5:
            r.qoeUrl = P.internalBinaryRead(e, e.uint32(), n, r.qoeUrl);
            break;
          case 13:
            r.atrUrl = P.internalBinaryRead(e, e.uint32(), n, r.atrUrl);
            break;
          case 15:
            r.videostatsEngageUrl = P.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.videostatsEngageUrl
            );
            break;
          case 18:
            r.pageadViewthroughconversion = P.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.pageadViewthroughconversion
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.videostatsPlaybackUrl && P.internalBinaryWrite(
        e.videostatsPlaybackUrl,
        t.tag(1, f.LengthDelimited).fork(),
        n
      ).join(), e.videostatsDelayplayUrl && P.internalBinaryWrite(
        e.videostatsDelayplayUrl,
        t.tag(2, f.LengthDelimited).fork(),
        n
      ).join(), e.videostatsWatchtimeUrl && P.internalBinaryWrite(
        e.videostatsWatchtimeUrl,
        t.tag(3, f.LengthDelimited).fork(),
        n
      ).join(), e.ptrackingUrl && P.internalBinaryWrite(
        e.ptrackingUrl,
        t.tag(4, f.LengthDelimited).fork(),
        n
      ).join(), e.qoeUrl && P.internalBinaryWrite(
        e.qoeUrl,
        t.tag(5, f.LengthDelimited).fork(),
        n
      ).join(), e.atrUrl && P.internalBinaryWrite(
        e.atrUrl,
        t.tag(13, f.LengthDelimited).fork(),
        n
      ).join(), e.videostatsEngageUrl && P.internalBinaryWrite(
        e.videostatsEngageUrl,
        t.tag(15, f.LengthDelimited).fork(),
        n
      ).join(), e.pageadViewthroughconversion && P.internalBinaryWrite(
        e.pageadViewthroughconversion,
        t.tag(18, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, bn = new Un(), En = class extends m {
    constructor() {
      super("youtube.response.player.Tracking", [
        { no: 1, name: "baseUrl", kind: "scalar", T: 9 }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.baseUrl = "", e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.baseUrl = e.string();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.baseUrl !== "" && t.tag(1, f.LengthDelimited).string(e.baseUrl);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, P = new En(), Fn = class extends m {
    constructor() {
      super("youtube.response.player.Captions", [
        {
          no: 51621377,
          name: "playerCaptionsTrackListRenderer",
          kind: "message",
          jsonName: "playerCaptionsTracklistRenderer",
          T: () => Rn
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 51621377:
            r.playerCaptionsTrackListRenderer = Rn.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.playerCaptionsTrackListRenderer
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.playerCaptionsTrackListRenderer && Rn.internalBinaryWrite(
        e.playerCaptionsTrackListRenderer,
        t.tag(51621377, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, kn = new Fn(), Ln = class extends m {
    constructor() {
      super("youtube.response.player.PlayerCaptionsTrackListRenderer", [
        {
          no: 1,
          name: "captionTracks",
          kind: "message",
          repeat: 1,
          T: () => be
        },
        {
          no: 2,
          name: "audioTracks",
          kind: "message",
          repeat: 1,
          T: () => wn
        },
        {
          no: 3,
          name: "translationLanguages",
          kind: "message",
          repeat: 1,
          T: () => ke
        },
        {
          no: 4,
          name: "defaultAudioTrackIndex",
          kind: "scalar",
          opt: !0,
          T: 5
        },
        {
          no: 6,
          name: "defaultCaptionTrackIndex",
          kind: "scalar",
          opt: !0,
          T: 5
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.captionTracks = [], t.audioTracks = [], t.translationLanguages = [], e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.captionTracks.push(be.internalBinaryRead(e, e.uint32(), n));
            break;
          case 2:
            r.audioTracks.push(wn.internalBinaryRead(e, e.uint32(), n));
            break;
          case 3:
            r.translationLanguages.push(
              ke.internalBinaryRead(e, e.uint32(), n)
            );
            break;
          case 4:
            r.defaultAudioTrackIndex = e.int32();
            break;
          case 6:
            r.defaultCaptionTrackIndex = e.int32();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      for (let r = 0; r < e.captionTracks.length; r++)
        be.internalBinaryWrite(
          e.captionTracks[r],
          t.tag(1, f.LengthDelimited).fork(),
          n
        ).join();
      for (let r = 0; r < e.audioTracks.length; r++)
        wn.internalBinaryWrite(
          e.audioTracks[r],
          t.tag(2, f.LengthDelimited).fork(),
          n
        ).join();
      for (let r = 0; r < e.translationLanguages.length; r++)
        ke.internalBinaryWrite(
          e.translationLanguages[r],
          t.tag(3, f.LengthDelimited).fork(),
          n
        ).join();
      e.defaultAudioTrackIndex !== void 0 && t.tag(4, f.Varint).int32(e.defaultAudioTrackIndex), e.defaultCaptionTrackIndex !== void 0 && t.tag(6, f.Varint).int32(e.defaultCaptionTrackIndex);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, Rn = new Ln(), An = class extends m {
    constructor() {
      super("youtube.response.player.CaptionTrack", [
        { no: 1, name: "baseUrl", kind: "scalar", T: 9 },
        { no: 2, name: "name", kind: "message", T: () => W },
        { no: 3, name: "vssId", kind: "scalar", T: 9 },
        { no: 4, name: "languageCode", kind: "scalar", T: 9 },
        { no: 5, name: "kind", kind: "scalar", opt: !0, T: 9 },
        { no: 6, name: "rtl", kind: "scalar", opt: !0, T: 8 },
        { no: 7, name: "isTranslatable", kind: "scalar", T: 8 }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.baseUrl = "", t.vssId = "", t.languageCode = "", t.isTranslatable = !1, e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.baseUrl = e.string();
            break;
          case 2:
            r.name = W.internalBinaryRead(e, e.uint32(), n, r.name);
            break;
          case 3:
            r.vssId = e.string();
            break;
          case 4:
            r.languageCode = e.string();
            break;
          case 5:
            r.kind = e.string();
            break;
          case 6:
            r.rtl = e.bool();
            break;
          case 7:
            r.isTranslatable = e.bool();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.baseUrl !== "" && t.tag(1, f.LengthDelimited).string(e.baseUrl), e.name && W.internalBinaryWrite(
        e.name,
        t.tag(2, f.LengthDelimited).fork(),
        n
      ).join(), e.vssId !== "" && t.tag(3, f.LengthDelimited).string(e.vssId), e.languageCode !== "" && t.tag(4, f.LengthDelimited).string(e.languageCode), e.kind !== void 0 && t.tag(5, f.LengthDelimited).string(e.kind), e.rtl !== void 0 && t.tag(6, f.Varint).bool(e.rtl), e.isTranslatable !== !1 && t.tag(7, f.Varint).bool(e.isTranslatable);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, be = new An(), Dn = class extends m {
    constructor() {
      super("youtube.response.player.AudioTrack", [
        {
          no: 2,
          name: "captionTrackIndices",
          kind: "scalar",
          repeat: 2,
          T: 5
        },
        {
          no: 3,
          name: "defaultCaptionTrackIndex",
          kind: "scalar",
          opt: !0,
          T: 5
        },
        {
          no: 4,
          name: "forcedCaptionTrackIndex",
          kind: "scalar",
          opt: !0,
          T: 5
        },
        { no: 5, name: "visibility", kind: "scalar", opt: !0, T: 5 },
        { no: 6, name: "hasDefaultTrack", kind: "scalar", opt: !0, T: 8 },
        { no: 7, name: "hasForcedTrack", kind: "scalar", opt: !0, T: 8 },
        { no: 8, name: "audioTrackId", kind: "scalar", opt: !0, T: 9 },
        {
          no: 11,
          name: "captionsInitialState",
          kind: "scalar",
          opt: !0,
          T: 5
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.captionTrackIndices = [], e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 2:
            if (s === f.LengthDelimited)
              for (let B = e.int32() + e.pos; e.pos < B; )
                r.captionTrackIndices.push(e.int32());
            else r.captionTrackIndices.push(e.int32());
            break;
          case 3:
            r.defaultCaptionTrackIndex = e.int32();
            break;
          case 4:
            r.forcedCaptionTrackIndex = e.int32();
            break;
          case 5:
            r.visibility = e.int32();
            break;
          case 6:
            r.hasDefaultTrack = e.bool();
            break;
          case 7:
            r.hasForcedTrack = e.bool();
            break;
          case 8:
            r.audioTrackId = e.string();
            break;
          case 11:
            r.captionsInitialState = e.int32();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      for (let r = 0; r < e.captionTrackIndices.length; r++)
        t.tag(2, f.Varint).int32(e.captionTrackIndices[r]);
      e.defaultCaptionTrackIndex !== void 0 && t.tag(3, f.Varint).int32(e.defaultCaptionTrackIndex), e.forcedCaptionTrackIndex !== void 0 && t.tag(4, f.Varint).int32(e.forcedCaptionTrackIndex), e.visibility !== void 0 && t.tag(5, f.Varint).int32(e.visibility), e.hasDefaultTrack !== void 0 && t.tag(6, f.Varint).bool(e.hasDefaultTrack), e.hasForcedTrack !== void 0 && t.tag(7, f.Varint).bool(e.hasForcedTrack), e.audioTrackId !== void 0 && t.tag(8, f.LengthDelimited).string(e.audioTrackId), e.captionsInitialState !== void 0 && t.tag(11, f.Varint).int32(e.captionsInitialState);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, wn = new Dn(), $n = class extends m {
    constructor() {
      super("youtube.response.player.TranslationLanguage", [
        { no: 1, name: "languageCode", kind: "scalar", T: 9 },
        { no: 2, name: "languageName", kind: "message", T: () => W }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.languageCode = "", e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.languageCode = e.string();
            break;
          case 2:
            r.languageName = W.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.languageName
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.languageCode !== "" && t.tag(1, f.LengthDelimited).string(e.languageCode), e.languageName && W.internalBinaryWrite(
        e.languageName,
        t.tag(2, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, ke = new $n(), jn = class extends m {
    constructor() {
      super("youtube.response.player.AdSlot", [
        { no: 424701016, name: "render", kind: "message", T: () => In }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 424701016:
            r.render = In.internalBinaryRead(e, e.uint32(), n, r.render);
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.render && In.internalBinaryWrite(
        e.render,
        t.tag(424701016, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, Bn = new jn(), Vn = class extends m {
    constructor() {
      super("youtube.response.player.AdSlot.Render", []);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      return i ?? this.create();
    }
    internalBinaryWrite(e, t, n) {
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, In = new Vn(), Zs = g(h(), 1), Jn = class extends m {
    constructor() {
      super("youtube.response.setting.Setting", [
        {
          no: 6,
          name: "settingItems",
          kind: "message",
          repeat: 1,
          T: () => _
        },
        {
          no: 7,
          name: "CollectionItems",
          kind: "message",
          jsonName: "CollectionItems",
          repeat: 1,
          T: () => _
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.settingItems = [], t.collectionItems = [], e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 6:
            r.settingItems.push(_.internalBinaryRead(e, e.uint32(), n));
            break;
          case 7:
            r.collectionItems.push(_.internalBinaryRead(e, e.uint32(), n));
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      for (let r = 0; r < e.settingItems.length; r++)
        _.internalBinaryWrite(
          e.settingItems[r],
          t.tag(6, f.LengthDelimited).fork(),
          n
        ).join();
      for (let r = 0; r < e.collectionItems.length; r++)
        _.internalBinaryWrite(
          e.collectionItems[r],
          t.tag(7, f.LengthDelimited).fork(),
          n
        ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, Qr = new Jn(), Xn = class extends m {
    constructor() {
      super("youtube.response.setting.SettingItem", [
        {
          no: 88478200,
          name: "backgroundPlayBackSettingRenderer",
          kind: "message",
          T: () => Mn
        },
        {
          no: 66930374,
          name: "settingCategoryCollectionRenderer",
          kind: "message",
          T: () => vn
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 88478200:
            r.backgroundPlayBackSettingRenderer = Mn.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.backgroundPlayBackSettingRenderer
            );
            break;
          case 66930374:
            r.settingCategoryCollectionRenderer = vn.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.settingCategoryCollectionRenderer
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.backgroundPlayBackSettingRenderer && Mn.internalBinaryWrite(
        e.backgroundPlayBackSettingRenderer,
        t.tag(88478200, f.LengthDelimited).fork(),
        n
      ).join(), e.settingCategoryCollectionRenderer && vn.internalBinaryWrite(
        e.settingCategoryCollectionRenderer,
        t.tag(66930374, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, _ = new Xn(), qn = class extends m {
    constructor() {
      super("youtube.response.setting.BackgroundPlayBackSettingRenderer", [
        { no: 1, name: "name", kind: "message", T: () => W },
        { no: 2, name: "backgroundPlayback", kind: "scalar", T: 8 },
        { no: 3, name: "download", kind: "scalar", T: 8 },
        { no: 5, name: "trackingParams", kind: "scalar", T: 12 },
        { no: 9, name: "downloadQualitySelection", kind: "scalar", T: 8 },
        { no: 10, name: "smartDownload", kind: "scalar", T: 8 },
        { no: 14, name: "icon", kind: "message", T: () => le }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.backgroundPlayback = !1, t.download = !1, t.trackingParams = new Uint8Array(0), t.downloadQualitySelection = !1, t.smartDownload = !1, e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.name = W.internalBinaryRead(e, e.uint32(), n, r.name);
            break;
          case 2:
            r.backgroundPlayback = e.bool();
            break;
          case 3:
            r.download = e.bool();
            break;
          case 5:
            r.trackingParams = e.bytes();
            break;
          case 9:
            r.downloadQualitySelection = e.bool();
            break;
          case 10:
            r.smartDownload = e.bool();
            break;
          case 14:
            r.icon = le.internalBinaryRead(e, e.uint32(), n, r.icon);
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.name && W.internalBinaryWrite(
        e.name,
        t.tag(1, f.LengthDelimited).fork(),
        n
      ).join(), e.backgroundPlayback !== !1 && t.tag(2, f.Varint).bool(e.backgroundPlayback), e.download !== !1 && t.tag(3, f.Varint).bool(e.download), e.trackingParams.length && t.tag(5, f.LengthDelimited).bytes(e.trackingParams), e.downloadQualitySelection !== !1 && t.tag(9, f.Varint).bool(e.downloadQualitySelection), e.smartDownload !== !1 && t.tag(10, f.Varint).bool(e.smartDownload), e.icon && le.internalBinaryWrite(e.icon, t.tag(14, f.LengthDelimited).fork(), n).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, Mn = new qn(), Yn = class extends m {
    constructor() {
      super("youtube.response.setting.SettingCategoryCollectionRenderer", [
        { no: 2, name: "name", kind: "message", T: () => W },
        {
          no: 3,
          name: "subSettings",
          kind: "message",
          repeat: 1,
          T: () => Re
        },
        { no: 4, name: "categoryId", kind: "scalar", T: 5 },
        { no: 5, name: "icon", kind: "message", T: () => le }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.subSettings = [], t.categoryId = 0, e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 2:
            r.name = W.internalBinaryRead(e, e.uint32(), n, r.name);
            break;
          case 3:
            r.subSettings.push(Re.internalBinaryRead(e, e.uint32(), n));
            break;
          case 4:
            r.categoryId = e.int32();
            break;
          case 5:
            r.icon = le.internalBinaryRead(e, e.uint32(), n, r.icon);
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.name && W.internalBinaryWrite(
        e.name,
        t.tag(2, f.LengthDelimited).fork(),
        n
      ).join();
      for (let r = 0; r < e.subSettings.length; r++)
        Re.internalBinaryWrite(
          e.subSettings[r],
          t.tag(3, f.LengthDelimited).fork(),
          n
        ).join();
      e.categoryId !== 0 && t.tag(4, f.Varint).int32(e.categoryId), e.icon && le.internalBinaryWrite(e.icon, t.tag(5, f.LengthDelimited).fork(), n).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, vn = new Yn(), zn = class extends m {
    constructor() {
      super("youtube.response.setting.Icon", [
        { no: 1, name: "iconType", kind: "scalar", T: 5 }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.iconType = 0, e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.iconType = e.int32();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.iconType !== 0 && t.tag(1, f.Varint).int32(e.iconType);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, le = new zn(), Zn = class extends m {
    constructor() {
      super("youtube.response.setting.SubSetting", [
        {
          no: 61331416,
          name: "settingBooleanRenderer",
          kind: "message",
          T: () => Gn
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 61331416:
            r.settingBooleanRenderer = Gn.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.settingBooleanRenderer
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.settingBooleanRenderer && Gn.internalBinaryWrite(
        e.settingBooleanRenderer,
        t.tag(61331416, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, Re = new Zn(), Qn = class extends m {
    constructor() {
      super("youtube.response.setting.SettingBooleanRenderer", [
        { no: 2, name: "title", kind: "message", T: () => W },
        { no: 3, name: "description", kind: "message", T: () => W },
        {
          no: 5,
          name: "enableServiceEndpoint",
          kind: "message",
          T: () => se
        },
        {
          no: 6,
          name: "disableServiceEndpoint",
          kind: "message",
          T: () => se
        },
        { no: 15, name: "itemId", kind: "scalar", T: 5 }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.itemId = 0, e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 2:
            r.title = W.internalBinaryRead(e, e.uint32(), n, r.title);
            break;
          case 3:
            r.description = W.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.description
            );
            break;
          case 5:
            r.enableServiceEndpoint = se.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.enableServiceEndpoint
            );
            break;
          case 6:
            r.disableServiceEndpoint = se.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.disableServiceEndpoint
            );
            break;
          case 15:
            r.itemId = e.int32();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.title && W.internalBinaryWrite(
        e.title,
        t.tag(2, f.LengthDelimited).fork(),
        n
      ).join(), e.description && W.internalBinaryWrite(
        e.description,
        t.tag(3, f.LengthDelimited).fork(),
        n
      ).join(), e.enableServiceEndpoint && se.internalBinaryWrite(
        e.enableServiceEndpoint,
        t.tag(5, f.LengthDelimited).fork(),
        n
      ).join(), e.disableServiceEndpoint && se.internalBinaryWrite(
        e.disableServiceEndpoint,
        t.tag(6, f.LengthDelimited).fork(),
        n
      ).join(), e.itemId !== 0 && t.tag(15, f.Varint).int32(e.itemId);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, Gn = new Qn(), er = class extends m {
    constructor() {
      super("youtube.response.setting.ServiceEndpoint", [
        {
          no: 81212182,
          name: "setClientSettingEndpoint",
          kind: "message",
          T: () => Kn
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 81212182:
            r.setClientSettingEndpoint = Kn.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.setClientSettingEndpoint
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.setClientSettingEndpoint && Kn.internalBinaryWrite(
        e.setClientSettingEndpoint,
        t.tag(81212182, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, se = new er(), tr = class extends m {
    constructor() {
      super("youtube.response.setting.SetClientSettingEndpoint", [
        { no: 1, name: "settingData", kind: "message", T: () => Hn }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.settingData = Hn.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.settingData
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.settingData && Hn.internalBinaryWrite(
        e.settingData,
        t.tag(1, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, Kn = new tr(), nr = class extends m {
    constructor() {
      super("youtube.response.setting.SettingData", [
        { no: 1, name: "clientSettingEnum", kind: "message", T: () => _n },
        { no: 3, name: "boolValue", kind: "scalar", T: 8 }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.boolValue = !1, e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.clientSettingEnum = _n.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.clientSettingEnum
            );
            break;
          case 3:
            r.boolValue = e.bool();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.clientSettingEnum && _n.internalBinaryWrite(
        e.clientSettingEnum,
        t.tag(1, f.LengthDelimited).fork(),
        n
      ).join(), e.boolValue !== !1 && t.tag(3, f.Varint).bool(e.boolValue);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, Hn = new nr(), rr = class extends m {
    constructor() {
      super("youtube.response.setting.ClientSettingEnum", [
        { no: 1, name: "item", kind: "scalar", T: 5 }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.item = 0, e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.item = e.int32();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.item !== 0 && t.tag(1, f.Varint).int32(e.item);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, _n = new rr(), ol = g(h(), 1), ir = class extends m {
    constructor() {
      super("youtube.response.watch.Watch", [
        { no: 1, name: "contents", kind: "message", repeat: 1, T: () => Z }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.contents = [], e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.contents.push(Z.internalBinaryRead(e, e.uint32(), n));
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      for (let r = 0; r < e.contents.length; r++)
        Z.internalBinaryWrite(
          e.contents[r],
          t.tag(1, f.LengthDelimited).fork(),
          n
        ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, ei = new ir(), ar = class extends m {
    constructor() {
      super("youtube.response.watch.Content", [
        { no: 2, name: "player", kind: "message", T: () => oe },
        { no: 3, name: "next", kind: "message", T: () => re }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 2:
            r.player = oe.internalBinaryRead(e, e.uint32(), n, r.player);
            break;
          case 3:
            r.next = re.internalBinaryRead(e, e.uint32(), n, r.next);
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.player && oe.internalBinaryWrite(e.player, t.tag(2, f.LengthDelimited).fork(), n).join(), e.next && re.internalBinaryWrite(e.next, t.tag(3, f.LengthDelimited).fork(), n).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, Z = new ar(), dl = g(h(), 1), dr = class extends m {
    constructor() {
      super("youtube.response.config.Config", [
        { no: 1, name: "response_context", kind: "message", T: () => or }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.responseContext = or.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.responseContext
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.responseContext && or.internalBinaryWrite(
        e.responseContext,
        t.tag(1, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, kr = new dr(), pr = class extends m {
    constructor() {
      super("youtube.response.config.ResponseContext", [
        { no: 16, name: "globalConfigGroup", kind: "message", T: () => sr }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 16:
            r.globalConfigGroup = sr.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.globalConfigGroup
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.globalConfigGroup && sr.internalBinaryWrite(
        e.globalConfigGroup,
        t.tag(16, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, or = new pr(), yr = class extends m {
    constructor() {
      super("youtube.response.config.GlobalConfigGroup", [
        { no: 6, name: "coldConfigGroup", kind: "message", T: () => lr },
        { no: 7, name: "hotConfigGroup", kind: "message", T: () => cr },
        { no: 4, name: "hot_hash_data", kind: "scalar", opt: !0, T: 9 },
        { no: 5, name: "cold_hash_data", kind: "scalar", opt: !0, T: 9 }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 6:
            r.coldConfigGroup = lr.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.coldConfigGroup
            );
            break;
          case 7:
            r.hotConfigGroup = cr.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.hotConfigGroup
            );
            break;
          case 4:
            r.hotHashData = e.string();
            break;
          case 5:
            r.coldHashData = e.string();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.coldConfigGroup && lr.internalBinaryWrite(
        e.coldConfigGroup,
        t.tag(6, f.LengthDelimited).fork(),
        n
      ).join(), e.hotConfigGroup && cr.internalBinaryWrite(
        e.hotConfigGroup,
        t.tag(7, f.LengthDelimited).fork(),
        n
      ).join(), e.hotHashData !== void 0 && t.tag(4, f.LengthDelimited).string(e.hotHashData), e.coldHashData !== void 0 && t.tag(5, f.LengthDelimited).string(e.coldHashData);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, sr = new yr(), hr = class extends m {
    constructor() {
      super("youtube.response.config.ColdConfigGroup", []);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      return i ?? this.create();
    }
    internalBinaryWrite(e, t, n) {
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, lr = new hr(), mr = class extends m {
    constructor() {
      super("youtube.response.config.HotConfigGroup", [
        {
          no: 138536474,
          name: "mediaHotConfig",
          kind: "message",
          T: () => ur
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 138536474:
            r.mediaHotConfig = ur.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.mediaHotConfig
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.mediaHotConfig && ur.internalBinaryWrite(
        e.mediaHotConfig,
        t.tag(138536474, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, cr = new mr(), gr = class extends m {
    constructor() {
      super("youtube.response.config.MediaHotConfig", [
        {
          no: 146311580,
          name: "onesieHotConfig",
          kind: "message",
          T: () => fr
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 146311580:
            r.onesieHotConfig = fr.internalBinaryRead(
              e,
              e.uint32(),
              n,
              r.onesieHotConfig
            );
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.onesieHotConfig && fr.internalBinaryWrite(
        e.onesieHotConfig,
        t.tag(146311580, f.LengthDelimited).fork(),
        n
      ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, ur = new gr(), br = class extends m {
    constructor() {
      super("youtube.response.config.OnesieHotConfig", [
        { no: 1, name: "clientKey", kind: "scalar", T: 12 },
        { no: 2, name: "encryptKey", kind: "scalar", T: 12 },
        { no: 3, name: "keyExpiresInSeconds", kind: "scalar", T: 3 },
        {
          no: 30,
          name: "useHotConfigToCreateOnesieRequest",
          kind: "scalar",
          T: 8
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.clientKey = new Uint8Array(0), t.encryptKey = new Uint8Array(0), t.keyExpiresInSeconds = "0", t.useHotConfigToCreateOnesieRequest = !1, e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.clientKey = e.bytes();
            break;
          case 2:
            r.encryptKey = e.bytes();
            break;
          case 3:
            r.keyExpiresInSeconds = e.int64().toString();
            break;
          case 30:
            r.useHotConfigToCreateOnesieRequest = e.bool();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.clientKey.length && t.tag(1, f.LengthDelimited).bytes(e.clientKey), e.encryptKey.length && t.tag(2, f.LengthDelimited).bytes(e.encryptKey), e.keyExpiresInSeconds !== "0" && t.tag(3, f.Varint).int64(e.keyExpiresInSeconds), e.useHotConfigToCreateOnesieRequest !== !1 && t.tag(30, f.Varint).bool(e.useHotConfigToCreateOnesieRequest);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, fr = new br(), Ml = g(h(), 1), yl = g(h(), 1), ml = g(h(), 1), Bl = g(h(), 1), ti = ((n) => (n[n.NONE = 0] = "NONE", n[n.GZIP = 1] = "GZIP", n[n.BROTLI = 2] = "BROTLI", n))(ti || {}), Rr = class extends m {
    constructor() {
      super("youtube.ump.encrypted.EncryptedInnertubeResponsePart", [
        { no: 1, name: "encryptedContent", kind: "scalar", T: 12 },
        { no: 2, name: "hmac", kind: "scalar", T: 12 },
        { no: 3, name: "iv", kind: "scalar", T: 12 },
        {
          no: 4,
          name: "compressionAlgorithm",
          kind: "enum",
          T: () => ["youtube.ump.encrypted.CompressionAlgorithm", ti]
        }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.encryptedContent = new Uint8Array(0), t.hmac = new Uint8Array(0), t.iv = new Uint8Array(0), t.compressionAlgorithm = 0, e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 1:
            r.encryptedContent = e.bytes();
            break;
          case 2:
            r.hmac = e.bytes();
            break;
          case 3:
            r.iv = e.bytes();
            break;
          case 4:
            r.compressionAlgorithm = e.int32();
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      e.encryptedContent.length && t.tag(1, f.LengthDelimited).bytes(e.encryptedContent), e.hmac.length && t.tag(2, f.LengthDelimited).bytes(e.hmac), e.iv.length && t.tag(3, f.LengthDelimited).bytes(e.iv), e.compressionAlgorithm !== 0 && t.tag(4, f.Varint).int32(e.compressionAlgorithm);
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, xi = new Rr(), Sl = g(h(), 1), wr = class extends m {
    constructor() {
      super("youtube.ump.encrypted.OnesieInnertubeResponse", [
        { no: 4, name: "contents", kind: "message", repeat: 1, T: () => Z }
      ]);
    }
    create(e) {
      let t = globalThis.Object.create(this.messagePrototype);
      return t.contents = [], e !== void 0 && y(this, t, e), t;
    }
    internalBinaryRead(e, t, n, i) {
      let r = i ?? this.create(), c = e.pos + t;
      for (; e.pos < c; ) {
        let [o, s] = e.tag();
        switch (o) {
          case 4:
            r.contents.push(Z.internalBinaryRead(e, e.uint32(), n));
            break;
          default:
            let a = n.readUnknownField;
            if (a === "throw")
              throw new globalThis.Error(
                `Unknown field ${o} (wire type ${s}) for ${this.typeName}`
              );
            let u = e.skip(s);
            a !== !1 && (a === !0 ? d.onRead : a)(this.typeName, r, o, s, u);
        }
      }
      return r;
    }
    internalBinaryWrite(e, t, n) {
      for (let r = 0; r < e.contents.length; r++)
        Z.internalBinaryWrite(
          e.contents[r],
          t.tag(4, f.LengthDelimited).fork(),
          n
        ).join();
      let i = n.writeUnknownFields;
      return i !== !1 && (i == !0 ? d.onWrite : i)(this.typeName, e, t), t;
    }
  }, Wi = new wr();

  // Surge environment
  var SurgeEnvironment = class {
    constructor() {
      this.request = adaptTransaction($request), this.response = typeof $response > "u" ? void 0 : adaptTransaction($response);
    }
    parameters(defaults) {
      return typeof $argument != "string" || $argument.includes("{{{") ? defaults : Object.assign(defaults, JSON.parse($argument));
    }
    getJSON(key, fallback = {}) {
      let value = $persistentStore.read(key);
      return value ? JSON.parse(value) : fallback;
    }
    setJSON(value, key) {
      $persistentStore.write(JSON.stringify(value), key);
    }
    notify(title, subtitle, body) {
      $notification.post(title, subtitle, body);
    }
    done(result = {}) {
      result.bodyBytes && (result.body = result.bodyBytes, delete result.bodyBytes), $done(result);
    }
    exit() {
      $done({});
    }
  };
  function adaptTransaction(transaction) {
    return new Proxy(transaction, {
      get(target, property) {
        return target[property === "bodyBytes" ? "body" : property];
      }
    });
  }
  function platformKey(request) {
    return (request.headers["user-agent"] ?? request.headers["User-Agent"]).includes("music") ? "youtubeMusic" : "youtube";
  }

  // Persistent state
  var CONFIG_KEY = "YouTubeConfig", AD_CACHE_KEY = "YouTubeAdvertiseInfo";
  var DEFAULT_AD_LAYOUTS = [
    "inline_injection_entrypoint_layout.eml",
    "video_display_button_group_layout.eml-fe",
    "full_width_portrait_image_layout.eml-fe",
    "full_width_square_image_layout.eml-fe",
    "video_display_full_buttoned_layout.eml-fe"
  ];
  function loadAdCache(environment2) {
    let stored = environment2.getJSON(AD_CACHE_KEY);
    return stored?.version !== "2.0" ? {
      blackEml: [...DEFAULT_AD_LAYOUTS],
      dirty: !1
    } : {
      blackEml: [
        .../* @__PURE__ */ new Set([...DEFAULT_AD_LAYOUTS, ...stored.blackEml ?? []])
      ],
      dirty: !1
    };
  }
  function saveAdCache(environment2, cache) {
    cache.dirty && environment2.setJSON(
      { version: "2.0", blackEml: cache.blackEml },
      AD_CACHE_KEY
    );
  }
  function loadConfig(environment2) {
    return environment2.getJSON(CONFIG_KEY) ?? {};
  }
  function saveConfig(environment2, config) {
    environment2.setJSON(config, CONFIG_KEY);
  }
  function currentKeys(environment2, key) {
    return loadConfig(environment2)?.[key] ?? {};
  }
  function clearCurrentKeys(environment2, key) {
    let config = loadConfig(environment2);
    config?.[key] && (delete config[key], saveConfig(environment2, config));
  }

  // Response policy
  var PAGE_AD = [112, 97, 103, 101, 97, 100], PAGE_AD_SHIFTS = new Int32Array(256).fill(PAGE_AD.length + 1);
  for (let index = 0; index < PAGE_AD.length; index++)
    PAGE_AD_SHIFTS[PAGE_AD[index]] = PAGE_AD.length - index;
  function visitObjects(root, target, callback) {
    let stack = root != null && typeof root == "object" ? [root] : [];
    for (; stack.length; ) {
      let object = stack.pop();
      for (let key of Object.keys(object)) {
        if (key === target && callback(object)) return;
        object[key] != null && typeof object[key] == "object" && stack.push(object[key]);
      }
    }
  }
  function enhancePlayer(player) {
    player.adPlacements?.length && (player.adPlacements.length = 0), player.adSlots?.length && (player.adSlots.length = 0), delete player?.playbackTracking?.pageadViewthroughconversion;
    let status = player.playabilityStatus;
    status.pictureInPictureRender = me.create({
      pictureInPictureAbility: { active: !0, f4: 0, f6: 0, f8: 1 }
    }), status.backgroundPlayerRender = ge.create({
      backgroundAbility: { active: !0 }
    });
  }
  function containsPageAd(data) {
    if (data.length < 1e3) return !1;
    for (let offset = 0; offset <= data.length - PAGE_AD.length; ) {
      if (PAGE_AD.every((byte, index) => data[offset + index] === byte))
        return !0;
      offset += PAGE_AD_SHIFTS[data[offset + PAGE_AD.length]] || PAGE_AD.length + 1;
    }
    return !1;
  }
  function isAdvertisement(item, cache) {
    let layouts = [];
    if (visitObjects(item, "renderInfo", (object) => {
      let eml = object.renderInfo?.layoutRender?.eml?.split("|")?.[0] ?? "";
      return eml && layouts.push(eml), !1;
    }), layouts.some(
      (eml) => cache.blackEml.includes(eml) || /shorts(?!_pivot_item)/.test(eml)
    ))
      return !0;
    let ad = !1, stack = [item];
    for (; stack.length && !ad; ) {
      let object = stack.pop();
      if (!(!object || typeof object != "object") && (ad = d.list(object).some(
        (field) => containsPageAd(field.data)
      ), !ad))
        for (let value of Object.values(object))
          value && typeof value == "object" && stack.push(value);
    }
    if (ad)
      for (let eml of layouts)
        cache.blackEml.includes(eml) || (cache.blackEml.push(eml), cache.dirty = !0);
    return ad;
  }
  function removeOpaqueSectionAds(message) {
    let changed = !1;
    return visitObjects(message, "sectionListRenderer", (object) => {
      let fields = d.list(object.sectionListRenderer);
      for (let index = fields.length - 1; index >= 0; index--)
        containsPageAd(fields[index].data) && (fields.splice(index, 1), changed = !0);
      return !1;
    }), changed;
  }
  function removeFeedAds(message, cache) {
    let changed = removeOpaqueSectionAds(message);
    return visitObjects(message, "richItemContents", (object) => {
      let items = object.richItemContents;
      if (!Array.isArray(items)) return !1;
      for (let index = items.length - 1; index >= 0; index--)
        isAdvertisement(items[index], cache) && (items.splice(index, 1), changed = !0);
    }), changed;
  }
  function removeShortsAds(message) {
    let changed = !1;
    for (let index = (message.entries?.length ?? 0) - 1; index >= 0; index--)
      message.entries[index].command?.reelWatchEndpoint?.adClientParams?.isAd && (message.entries.splice(index, 1), changed = !0);
    return changed;
  }
  function filterGuide(message, parameters2) {
    let blocked = ["SPunlimited"];
    parameters2.blockUpload && blocked.push("FEuploads"), parameters2.blockShorts && blocked.push("FEshorts");
    let changed = !1;
    return visitObjects(message, "rendererItems", (object) => {
      for (let index = object.rendererItems.length - 1; index >= 0; index--) {
        let id = object.rendererItems[index]?.iconRender?.browseId ?? object.rendererItems[index]?.labelRender?.browseId;
        id && blocked.includes(id) && (object.rendererItems.splice(index, 1), changed = !0);
      }
    }), changed;
  }
  function addPremiumSettings(message) {
    visitObjects(message.settingItems, "categoryId", (category) => {
      category.categoryId === 10135 && category.subSettings.push(
        Re.create({
          settingBooleanRenderer: {
            itemId: 0,
            enableServiceEndpoint: {
              setClientSettingEndpoint: {
                settingData: {
                  clientSettingEnum: { item: 151 },
                  boolValue: !0
                }
              }
            },
            disableServiceEndpoint: {
              setClientSettingEndpoint: {
                settingData: {
                  clientSettingEnum: { item: 151 },
                  boolValue: !1
                }
              }
            }
          }
        })
      );
    }), message.settingItems.push(
      _.create({
        backgroundPlayBackSettingRenderer: {
          backgroundPlayback: !0,
          download: !0,
          downloadQualitySelection: !0,
          smartDownload: !0,
          icon: { iconType: 1093 }
        }
      })
    );
  }

  // YouTube API response handler
  var environment, parameters;
  function enhanceFeed(message, state) {
    return removeFeedAds(message, state.adCache);
  }
  var routes = [
    {
      path: "browse",
      type: qr,
      handle: enhanceFeed
    },
    {
      path: "next",
      type: re,
      handle: enhanceFeed
    },
    {
      path: "player",
      type: oe,
      handle: (message) => (enhancePlayer(message), !0)
    },
    {
      path: "search",
      type: Yr,
      handle: enhanceFeed
    },
    { path: "reel_watch_sequence", type: zr, handle: removeShortsAds },
    {
      path: "guide",
      type: Zr,
      handle: (message) => filterGuide(message, parameters)
    },
    {
      path: "get_setting",
      type: Qr,
      handle: (message) => (addPremiumSettings(message), !0)
    },
    {
      path: "get_watch",
      type: ei,
      handle(message, state) {
        for (let content of message.contents)
          content.player && enhancePlayer(content.player), content.next && enhanceFeed(content.next, state);
        return message.contents.length > 0;
      }
    },
    { path: "config", type: kr, handle: captureKeys },
    { path: "log_event", type: kr, handle: captureKeys }
  ];
  function captureKeys(message, state) {
    let keys = message.responseContext?.globalConfigGroup?.hotConfigGroup?.mediaHotConfig?.onesieHotConfig;
    if (!keys) return !1;
    if (!keys.clientKey?.length || !keys.encryptKey?.length)
      return console.log("\u5F02\u5E38\uFF1AhotConfig \u672A\u5305\u542B\u5B8C\u6574\u7684 onesie key"), !1;
    let key = platformKey(environment.request), clientKey = Q(keys.clientKey), encryptKey = Q(keys.encryptKey), current = state.config[key];
    return current?.clientKey === clientKey && current?.encryptKey === encryptKey || (state.config[key] = { clientKey, encryptKey }, state.configChanged = !0), !1;
  }
  function handleApiResponse() {
    environment = new SurgeEnvironment(), parameters = environment.parameters({
      blockUpload: !0,
      blockShorts: !1
    });
    try {
      let route = routes.find(
        ({ path }) => environment.request.url.includes(path)
      );
      if (!route)
        environment.notify(
          "YouTube Enhance",
          "\u811A\u672C\u9700\u8981\u66F4\u65B0",
          "\u5916\u90E8\u8D44\u6E90 -> \u5168\u90E8\u66F4\u65B0"
        ), environment.exit();
      else if (!environment.response?.bodyBytes)
        environment.exit();
      else {
        let state = {
          adCache: loadAdCache(environment),
          config: loadConfig(environment),
          configChanged: !1
        }, message = route.type.fromBinary(environment.response.bodyBytes), changed = route.handle(message, state);
        saveAdCache(environment, state.adCache), state.configChanged && saveConfig(environment, state.config), changed ? environment.done({ bodyBytes: route.type.toBinary(message) }) : environment.exit();
      }
    } catch (error) {
      console.log(String(error)), environment.exit();
    }
  }

  // Gzip
  var u8 = Uint8Array, u16 = Uint16Array, i32 = Int32Array, fleb = new u8([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    0,
    /* unused */
    0,
    0,
    /* impossible */
    0
  ]), fdeb = new u8([
    0,
    0,
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    5,
    5,
    6,
    6,
    7,
    7,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13,
    /* unused */
    0,
    0
  ]), clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), freb = function(eb, start) {
    for (var b = new u16(31), i = 0; i < 31; ++i)
      b[i] = start += 1 << eb[i - 1];
    for (var r = new i32(b[30]), i = 1; i < 30; ++i)
      for (var j = b[i]; j < b[i + 1]; ++j)
        r[j] = j - b[i] << 5 | i;
    return { b, r };
  }, _a = freb(fleb, 2), fl = _a.b, revfl = _a.r;
  fl[28] = 258, revfl[258] = 28;
  var _b = freb(fdeb, 0), fd = _b.b, revfd = _b.r, rev = new u16(32768);
  for (i = 0; i < 32768; ++i)
    x2 = (i & 43690) >> 1 | (i & 21845) << 1, x2 = (x2 & 52428) >> 2 | (x2 & 13107) << 2, x2 = (x2 & 61680) >> 4 | (x2 & 3855) << 4, rev[i] = ((x2 & 65280) >> 8 | (x2 & 255) << 8) >> 1;
  var x2, i, hMap = (function(cd, mb, r) {
    for (var s = cd.length, i = 0, l = new u16(mb); i < s; ++i)
      cd[i] && ++l[cd[i] - 1];
    var le2 = new u16(mb);
    for (i = 1; i < mb; ++i)
      le2[i] = le2[i - 1] + l[i - 1] << 1;
    var co;
    if (r) {
      co = new u16(1 << mb);
      var rvb = 15 - mb;
      for (i = 0; i < s; ++i)
        if (cd[i])
          for (var sv = i << 4 | cd[i], r_1 = mb - cd[i], v2 = le2[cd[i] - 1]++ << r_1, m2 = v2 | (1 << r_1) - 1; v2 <= m2; ++v2)
            co[rev[v2] >> rvb] = sv;
    } else
      for (co = new u16(s), i = 0; i < s; ++i)
        cd[i] && (co[i] = rev[le2[cd[i] - 1]++] >> 15 - cd[i]);
    return co;
  }), flt = new u8(288);
  for (i = 0; i < 144; ++i)
    flt[i] = 8;
  var i;
  for (i = 144; i < 256; ++i)
    flt[i] = 9;
  var i;
  for (i = 256; i < 280; ++i)
    flt[i] = 7;
  var i;
  for (i = 280; i < 288; ++i)
    flt[i] = 8;
  var i, fdt = new u8(32);
  for (i = 0; i < 32; ++i)
    fdt[i] = 5;
  var i, flm = /* @__PURE__ */ hMap(flt, 9, 0), flrm = /* @__PURE__ */ hMap(flt, 9, 1), fdm = /* @__PURE__ */ hMap(fdt, 5, 0), fdrm = /* @__PURE__ */ hMap(fdt, 5, 1), max = function(a) {
    for (var m2 = a[0], i = 1; i < a.length; ++i)
      a[i] > m2 && (m2 = a[i]);
    return m2;
  }, bits = function(d2, p2, m2) {
    var o = p2 / 8 | 0;
    return (d2[o] | d2[o + 1] << 8) >> (p2 & 7) & m2;
  }, bits16 = function(d2, p2) {
    var o = p2 / 8 | 0;
    return (d2[o] | d2[o + 1] << 8 | d2[o + 2] << 16) >> (p2 & 7);
  }, shft = function(p2) {
    return (p2 + 7) / 8 | 0;
  }, slc = function(v2, s, e) {
    return (s == null || s < 0) && (s = 0), (e == null || e > v2.length) && (e = v2.length), new u8(v2.subarray(s, e));
  };
  var ec = [
    "unexpected EOF",
    "invalid block type",
    "invalid length/literal",
    "invalid distance",
    "stream finished",
    "no stream handler",
    ,
    "no callback",
    "invalid UTF-8 data",
    "extra field too long",
    "date not in range 1980-2099",
    "filename too long",
    "stream finishing",
    "invalid zip data"
    // determined by unknown compression method
  ], err = function(ind, msg, nt2) {
    var e = new Error(msg || ec[ind]);
    if (e.code = ind, Error.captureStackTrace && Error.captureStackTrace(e, err), !nt2)
      throw e;
    return e;
  }, inflt = function(dat, st2, buf, dict) {
    var sl = dat.length, dl2 = dict ? dict.length : 0;
    if (!sl || st2.f && !st2.l)
      return buf || new u8(0);
    var noBuf = !buf, resize = noBuf || st2.i != 2, noSt = st2.i;
    noBuf && (buf = new u8(sl * 3));
    var cbuf = function(l2) {
      var bl = buf.length;
      if (l2 > bl) {
        var nbuf = new u8(Math.max(bl * 2, l2));
        nbuf.set(buf), buf = nbuf;
      }
    }, final = st2.f || 0, pos = st2.p || 0, bt2 = st2.b || 0, lm = st2.l, dm = st2.d, lbt = st2.m, dbt = st2.n, tbts = sl * 8;
    do {
      if (!lm) {
        final = bits(dat, pos, 1);
        var type = bits(dat, pos + 1, 3);
        if (pos += 3, type)
          if (type == 1)
            lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
          else if (type == 2) {
            var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4, tl = hLit + bits(dat, pos + 5, 31) + 1;
            pos += 14;
            for (var ldt = new u8(tl), clt = new u8(19), i = 0; i < hcLen; ++i)
              clt[clim[i]] = bits(dat, pos + i * 3, 7);
            pos += hcLen * 3;
            for (var clb = max(clt), clbmsk = (1 << clb) - 1, clm = hMap(clt, clb, 1), i = 0; i < tl; ) {
              var r = clm[bits(dat, pos, clbmsk)];
              pos += r & 15;
              var s = r >> 4;
              if (s < 16)
                ldt[i++] = s;
              else {
                var c = 0, n = 0;
                for (s == 16 ? (n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1]) : s == 17 ? (n = 3 + bits(dat, pos, 7), pos += 3) : s == 18 && (n = 11 + bits(dat, pos, 127), pos += 7); n--; )
                  ldt[i++] = c;
              }
            }
            var lt2 = ldt.subarray(0, hLit), dt2 = ldt.subarray(hLit);
            lbt = max(lt2), dbt = max(dt2), lm = hMap(lt2, lbt, 1), dm = hMap(dt2, dbt, 1);
          } else
            err(1);
        else {
          var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
          if (t > sl) {
            noSt && err(0);
            break;
          }
          resize && cbuf(bt2 + l), buf.set(dat.subarray(s, t), bt2), st2.b = bt2 += l, st2.p = pos = t * 8, st2.f = final;
          continue;
        }
        if (pos > tbts) {
          noSt && err(0);
          break;
        }
      }
      resize && cbuf(bt2 + 131072);
      for (var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1, lpos = pos; ; lpos = pos) {
        var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
        if (pos += c & 15, pos > tbts) {
          noSt && err(0);
          break;
        }
        if (c || err(2), sym < 256)
          buf[bt2++] = sym;
        else if (sym == 256) {
          lpos = pos, lm = null;
          break;
        } else {
          var add = sym - 254;
          if (sym > 264) {
            var i = sym - 257, b = fleb[i];
            add = bits(dat, pos, (1 << b) - 1) + fl[i], pos += b;
          }
          var d2 = dm[bits16(dat, pos) & dms], dsym = d2 >> 4;
          d2 || err(3), pos += d2 & 15;
          var dt2 = fd[dsym];
          if (dsym > 3) {
            var b = fdeb[dsym];
            dt2 += bits16(dat, pos) & (1 << b) - 1, pos += b;
          }
          if (pos > tbts) {
            noSt && err(0);
            break;
          }
          resize && cbuf(bt2 + 131072);
          var end = bt2 + add;
          if (bt2 < dt2) {
            var shift = dl2 - dt2, dend = Math.min(dt2, end);
            for (shift + bt2 < 0 && err(3); bt2 < dend; ++bt2)
              buf[bt2] = dict[shift + bt2];
          }
          for (; bt2 < end; ++bt2)
            buf[bt2] = buf[bt2 - dt2];
        }
      }
      st2.l = lm, st2.p = lpos, st2.b = bt2, st2.f = final, lm && (final = 1, st2.m = lbt, st2.d = dm, st2.n = dbt);
    } while (!final);
    return bt2 != buf.length && noBuf ? slc(buf, 0, bt2) : buf.subarray(0, bt2);
  }, wbits = function(d2, p2, v2) {
    v2 <<= p2 & 7;
    var o = p2 / 8 | 0;
    d2[o] |= v2, d2[o + 1] |= v2 >> 8;
  }, wbits16 = function(d2, p2, v2) {
    v2 <<= p2 & 7;
    var o = p2 / 8 | 0;
    d2[o] |= v2, d2[o + 1] |= v2 >> 8, d2[o + 2] |= v2 >> 16;
  }, hTree = function(d2, mb) {
    for (var t = [], i = 0; i < d2.length; ++i)
      d2[i] && t.push({ s: i, f: d2[i] });
    var s = t.length, t2 = t.slice();
    if (!s)
      return { t: et2, l: 0 };
    if (s == 1) {
      var v2 = new u8(t[0].s + 1);
      return v2[t[0].s] = 1, { t: v2, l: 1 };
    }
    t.sort(function(a, b) {
      return a.f - b.f;
    }), t.push({ s: -1, f: 25001 });
    var l = t[0], r = t[1], i0 = 0, i1 = 1, i2 = 2;
    for (t[0] = { s: -1, f: l.f + r.f, l, r }; i1 != s - 1; )
      l = t[t[i0].f < t[i2].f ? i0++ : i2++], r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++], t[i1++] = { s: -1, f: l.f + r.f, l, r };
    for (var maxSym = t2[0].s, i = 1; i < s; ++i)
      t2[i].s > maxSym && (maxSym = t2[i].s);
    var tr2 = new u16(maxSym + 1), mbt = ln2(t[i1 - 1], tr2, 0);
    if (mbt > mb) {
      var i = 0, dt2 = 0, lft = mbt - mb, cst = 1 << lft;
      for (t2.sort(function(a, b) {
        return tr2[b.s] - tr2[a.s] || a.f - b.f;
      }); i < s; ++i) {
        var i2_1 = t2[i].s;
        if (tr2[i2_1] > mb)
          dt2 += cst - (1 << mbt - tr2[i2_1]), tr2[i2_1] = mb;
        else
          break;
      }
      for (dt2 >>= lft; dt2 > 0; ) {
        var i2_2 = t2[i].s;
        tr2[i2_2] < mb ? dt2 -= 1 << mb - tr2[i2_2]++ - 1 : ++i;
      }
      for (; i >= 0 && dt2; --i) {
        var i2_3 = t2[i].s;
        tr2[i2_3] == mb && (--tr2[i2_3], ++dt2);
      }
      mbt = mb;
    }
    return { t: new u8(tr2), l: mbt };
  }, ln2 = function(n, l, d2) {
    return n.s == -1 ? Math.max(ln2(n.l, l, d2 + 1), ln2(n.r, l, d2 + 1)) : l[n.s] = d2;
  }, lc = function(c) {
    for (var s = c.length; s && !c[--s]; )
      ;
    for (var cl = new u16(++s), cli = 0, cln = c[0], cls = 1, w = function(v2) {
      cl[cli++] = v2;
    }, i = 1; i <= s; ++i)
      if (c[i] == cln && i != s)
        ++cls;
      else {
        if (!cln && cls > 2) {
          for (; cls > 138; cls -= 138)
            w(32754);
          cls > 2 && (w(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305), cls = 0);
        } else if (cls > 3) {
          for (w(cln), --cls; cls > 6; cls -= 6)
            w(8304);
          cls > 2 && (w(cls - 3 << 5 | 8208), cls = 0);
        }
        for (; cls--; )
          w(cln);
        cls = 1, cln = c[i];
      }
    return { c: cl.subarray(0, cli), n: s };
  }, clen = function(cf, cl) {
    for (var l = 0, i = 0; i < cl.length; ++i)
      l += cf[i] * cl[i];
    return l;
  }, wfblk = function(out, pos, dat) {
    var s = dat.length, o = shft(pos + 2);
    out[o] = s & 255, out[o + 1] = s >> 8, out[o + 2] = out[o] ^ 255, out[o + 3] = out[o + 1] ^ 255;
    for (var i = 0; i < s; ++i)
      out[o + i + 4] = dat[i];
    return (o + 4 + s) * 8;
  }, wblk = function(dat, out, final, syms, lf, df, eb, li, bs, bl, p2) {
    wbits(out, p2++, final), ++lf[256];
    for (var _a2 = hTree(lf, 15), dlt = _a2.t, mlb = _a2.l, _b2 = hTree(df, 15), ddt = _b2.t, mdb = _b2.l, _c = lc(dlt), lclt = _c.c, nlc = _c.n, _d = lc(ddt), lcdt = _d.c, ndc = _d.n, lcfreq = new u16(19), i = 0; i < lclt.length; ++i)
      ++lcfreq[lclt[i] & 31];
    for (var i = 0; i < lcdt.length; ++i)
      ++lcfreq[lcdt[i] & 31];
    for (var _e2 = hTree(lcfreq, 7), lct = _e2.t, mlcb = _e2.l, nlcc = 19; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
      ;
    var flen = bl + 5 << 3, ftlen = clen(lf, flt) + clen(df, fdt) + eb, dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
    if (bs >= 0 && flen <= ftlen && flen <= dtlen)
      return wfblk(out, p2, dat.subarray(bs, bs + bl));
    var lm, ll, dm, dl2;
    if (wbits(out, p2, 1 + (dtlen < ftlen)), p2 += 2, dtlen < ftlen) {
      lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl2 = ddt;
      var llm = hMap(lct, mlcb, 0);
      wbits(out, p2, nlc - 257), wbits(out, p2 + 5, ndc - 1), wbits(out, p2 + 10, nlcc - 4), p2 += 14;
      for (var i = 0; i < nlcc; ++i)
        wbits(out, p2 + 3 * i, lct[clim[i]]);
      p2 += 3 * nlcc;
      for (var lcts = [lclt, lcdt], it2 = 0; it2 < 2; ++it2)
        for (var clct = lcts[it2], i = 0; i < clct.length; ++i) {
          var len = clct[i] & 31;
          wbits(out, p2, llm[len]), p2 += lct[len], len > 15 && (wbits(out, p2, clct[i] >> 5 & 127), p2 += clct[i] >> 12);
        }
    } else
      lm = flm, ll = flt, dm = fdm, dl2 = fdt;
    for (var i = 0; i < li; ++i) {
      var sym = syms[i];
      if (sym > 255) {
        var len = sym >> 18 & 31;
        wbits16(out, p2, lm[len + 257]), p2 += ll[len + 257], len > 7 && (wbits(out, p2, sym >> 23 & 31), p2 += fleb[len]);
        var dst = sym & 31;
        wbits16(out, p2, dm[dst]), p2 += dl2[dst], dst > 3 && (wbits16(out, p2, sym >> 5 & 8191), p2 += fdeb[dst]);
      } else
        wbits16(out, p2, lm[sym]), p2 += ll[sym];
    }
    return wbits16(out, p2, lm[256]), p2 + ll[256];
  }, deo = /* @__PURE__ */ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), et2 = /* @__PURE__ */ new u8(0), dflt = function(dat, lvl, plvl, pre, post, st2) {
    var s = st2.z || dat.length, o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7e3)) + post), w = o.subarray(pre, o.length - post), lst = st2.l, pos = (st2.r || 0) & 7;
    if (lvl) {
      pos && (w[0] = st2.r >> 3);
      for (var opt = deo[lvl - 1], n = opt >> 13, c = opt & 8191, msk_1 = (1 << plvl) - 1, prev = st2.p || new u16(32768), head = st2.h || new u16(msk_1 + 1), bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1, hsh = function(i2) {
        return (dat[i2] ^ dat[i2 + 1] << bs1_1 ^ dat[i2 + 2] << bs2_1) & msk_1;
      }, syms = new i32(25e3), lf = new u16(288), df = new u16(32), lc_1 = 0, eb = 0, i = st2.i || 0, li = 0, wi2 = st2.w || 0, bs = 0; i + 2 < s; ++i) {
        var hv = hsh(i), imod = i & 32767, pimod = head[hv];
        if (prev[imod] = pimod, head[hv] = imod, wi2 <= i) {
          var rem = s - i;
          if ((lc_1 > 7e3 || li > 24576) && (rem > 423 || !lst)) {
            pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos), li = lc_1 = eb = 0, bs = i;
            for (var j = 0; j < 286; ++j)
              lf[j] = 0;
            for (var j = 0; j < 30; ++j)
              df[j] = 0;
          }
          var l = 2, d2 = 0, ch_1 = c, dif = imod - pimod & 32767;
          if (rem > 2 && hv == hsh(i - dif))
            for (var maxn = Math.min(n, rem) - 1, maxd = Math.min(32767, i), ml2 = Math.min(258, rem); dif <= maxd && --ch_1 && imod != pimod; ) {
              if (dat[i + l] == dat[i + l - dif]) {
                for (var nl = 0; nl < ml2 && dat[i + nl] == dat[i + nl - dif]; ++nl)
                  ;
                if (nl > l) {
                  if (l = nl, d2 = dif, nl > maxn)
                    break;
                  for (var mmd = Math.min(dif, nl - 2), md = 0, j = 0; j < mmd; ++j) {
                    var ti2 = i - dif + j & 32767, pti = prev[ti2], cd = ti2 - pti & 32767;
                    cd > md && (md = cd, pimod = ti2);
                  }
                }
              }
              imod = pimod, pimod = prev[imod], dif += imod - pimod & 32767;
            }
          if (d2) {
            syms[li++] = 268435456 | revfl[l] << 18 | revfd[d2];
            var lin = revfl[l] & 31, din = revfd[d2] & 31;
            eb += fleb[lin] + fdeb[din], ++lf[257 + lin], ++df[din], wi2 = i + l, ++lc_1;
          } else
            syms[li++] = dat[i], ++lf[dat[i]];
        }
      }
      for (i = Math.max(i, wi2); i < s; ++i)
        syms[li++] = dat[i], ++lf[dat[i]];
      pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos), lst || (st2.r = pos & 7 | w[pos / 8 | 0] << 3, pos -= 7, st2.h = head, st2.p = prev, st2.i = i, st2.w = wi2);
    } else {
      for (var i = st2.w || 0; i < s + lst; i += 65535) {
        var e = i + 65535;
        e >= s && (w[pos / 8 | 0] = lst, e = s), pos = wfblk(w, pos + 1, dat.subarray(i, e));
      }
      st2.i = s;
    }
    return slc(o, 0, pre + shft(pos) + post);
  }, crct = /* @__PURE__ */ (function() {
    for (var t = new Int32Array(256), i = 0; i < 256; ++i) {
      for (var c = i, k = 9; --k; )
        c = (c & 1 && -306674912) ^ c >>> 1;
      t[i] = c;
    }
    return t;
  })(), crc = function() {
    var c = -1;
    return {
      p: function(d2) {
        for (var cr2 = c, i = 0; i < d2.length; ++i)
          cr2 = crct[cr2 & 255 ^ d2[i]] ^ cr2 >>> 8;
        c = cr2;
      },
      d: function() {
        return ~c;
      }
    };
  };
  var dopt = function(dat, opt, pre, post, st2) {
    if (!st2 && (st2 = { l: 1 }, opt.dictionary)) {
      var dict = opt.dictionary.subarray(-32768), newDat = new u8(dict.length + dat.length);
      newDat.set(dict), newDat.set(dat, dict.length), dat = newDat, st2.w = dict.length;
    }
    return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? st2.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20 : 12 + opt.mem, pre, post, st2);
  };
  var wbytes = function(d2, b, v2) {
    for (; v2; ++b)
      d2[b] = v2, v2 >>>= 8;
  }, gzh = function(c, o) {
    var fn2 = o.filename;
    if (c[0] = 31, c[1] = 139, c[2] = 8, c[8] = o.level < 2 ? 4 : o.level == 9 ? 2 : 0, c[9] = 3, o.mtime != 0 && wbytes(c, 4, Math.floor(new Date(o.mtime || Date.now()) / 1e3)), fn2) {
      c[3] = 8;
      for (var i = 0; i <= fn2.length; ++i)
        c[i + 10] = fn2.charCodeAt(i);
    }
  }, gzs = function(d2) {
    (d2[0] != 31 || d2[1] != 139 || d2[2] != 8) && err(6, "invalid gzip data");
    var flg = d2[3], st2 = 10;
    flg & 4 && (st2 += (d2[10] | d2[11] << 8) + 2);
    for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d2[st2++])
      ;
    return st2 + (flg & 2);
  }, gzl = function(d2) {
    var l = d2.length;
    return (d2[l - 4] | d2[l - 3] << 8 | d2[l - 2] << 16 | d2[l - 1] << 24) >>> 0;
  }, gzhl = function(o) {
    return 10 + (o.filename ? o.filename.length + 1 : 0);
  };
  function gzipSync(data, opts) {
    opts || (opts = {});
    var c = crc(), l = data.length;
    c.p(data);
    var d2 = dopt(data, opts, gzhl(opts), 8), s = d2.length;
    return gzh(d2, opts), wbytes(d2, s - 8, c.d()), wbytes(d2, s - 4, l), d2;
  }
  function gunzipSync(data, opts) {
    var st2 = gzs(data);
    return st2 + 8 > data.length && err(6, "invalid gzip data"), inflt(data.subarray(st2, -8), { i: 2 }, opts && opts.out || new u8(gzl(data)), opts && opts.dictionary);
  }
  var td = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), tds = 0;
  try {
    td.decode(et2, { stream: !0 }), tds = 1;
  } catch {
  }

  // Protobuf helpers
  function readVarint(bytes, cursor) {
    let value = 0, shift = 0;
    for (; shift < 35; ) {
      let byte = bytes[cursor.offset++];
      if (value |= (byte & 127) << shift, !(byte & 128)) return value >>> 0;
      shift += 7;
    }
    throw new Error("invalid varint");
  }
  function decodeBase64(value) {
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", output = [], buffer = 0, bits2 = 0;
    for (let character of value.replace(
      /[-_]/g,
      (item) => item === "-" ? "+" : "/"
    )) {
      if (/\s|=/.test(character)) continue;
      let index = alphabet.indexOf(character);
      if (index < 0) throw new Error("invalid base64 string");
      buffer = buffer << 6 | index, bits2 += 6, bits2 >= 8 && (bits2 -= 8, output.push(buffer >>> bits2 & 255));
    }
    return new Uint8Array(output);
  }

  // UMP container
  var UmpReader = class {
    constructor(buffer) {
      this.buffer = buffer, this.offset = 0;
    }
    readByte() {
      return this.buffer[this.offset++];
    }
    readVarint() {
      let first = this.readByte(), size = 0;
      for (let candidate = 1; candidate <= 5; candidate++)
        if (!(first & 128 >> candidate - 1)) {
          size = candidate;
          break;
        }
      if (!size) throw new Error("Invalid size");
      let bits2 = 0, value = size === 5 ? 0 : first & (1 << 8 - size) - 1;
      for (let index = 1; index < size; index++)
        value |= this.readByte() << bits2, bits2 += 8;
      return value;
    }
    readPart() {
      let type = this.readVarint(), length = this.readVarint(), data = this.buffer.subarray(this.offset, this.offset + length);
      return this.offset += length, { type, data };
    }
    get hasNext() {
      return this.offset < this.buffer.length;
    }
  }, UmpWriter = class {
    constructor(capacity = 1024) {
      this.buffer = new Uint8Array(capacity), this.length = 0;
    }
    ensureCapacity(additionalLength) {
      if (this.length + additionalLength <= this.buffer.length) return;
      let expanded = new Uint8Array(
        Math.max(this.buffer.length * 2, this.length + additionalLength)
      );
      expanded.set(this.buffer), this.buffer = expanded;
    }
    writeByte(value) {
      this.ensureCapacity(1), this.buffer[this.length++] = value & 255;
    }
    writeVarint(value) {
      let size = 1;
      for (; value >= 1 << 7 * size; ) size++;
      size === 1 ? this.writeByte(value) : size === 2 ? (this.writeByte(value & 63 | 128), this.writeByte(value >> 6)) : size === 3 ? (this.writeByte(value & 31 | 192), this.writeByte(value >> 5 & 255), this.writeByte(value >> 13)) : size === 4 ? (this.writeByte(value & 15 | 224), this.writeByte(value >> 4 & 255), this.writeByte(value >> 12 & 255), this.writeByte(value >> 20)) : (this.writeByte(240), this.writeByte(value), this.writeByte(value >> 8), this.writeByte(value >> 16), this.writeByte(value >> 24));
    }
    writePart(part) {
      this.writeVarint(part.type), this.writeVarint(part.data.length), this.ensureCapacity(part.data.length), this.buffer.set(part.data, this.length), this.length += part.data.length;
    }
    finish() {
      return this.buffer.subarray(0, this.length);
    }
  };

  // Cipher helpers
  /*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) */
  function isBytes(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  function abytes(b, ...lengths) {
    if (!isBytes(b))
      throw new Error("Uint8Array expected");
    if (lengths.length > 0 && !lengths.includes(b.length))
      throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
  }
  function u82(arr) {
    return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
  }
  function u32(arr) {
    return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
  }
  function clean(...arrays) {
    for (let i = 0; i < arrays.length; i++)
      arrays[i].fill(0);
  }
  var isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function overlapBytes(a, b) {
    return a.buffer === b.buffer && // best we can do, may fail with an obscure Proxy
    a.byteOffset < b.byteOffset + b.byteLength && // a starts before b end
    b.byteOffset < a.byteOffset + a.byteLength;
  }
  function complexOverlapBytes(input, output) {
    if (overlapBytes(input, output) && input.byteOffset < output.byteOffset)
      throw new Error("complex overlap of input and output is not supported");
  }
  var wrapCipher = /* @__NO_SIDE_EFFECTS__ */ (params, constructor) => {
    function wrappedCipher(key, ...args) {
      if (abytes(key), !isLE)
        throw new Error("Non little-endian hardware is not yet supported");
      if (params.nonceLength !== void 0) {
        let nonce = args[0];
        if (!nonce)
          throw new Error("nonce / iv required");
        params.varSizeNonce ? abytes(nonce) : abytes(nonce, params.nonceLength);
      }
      let tagl = params.tagLength;
      tagl && args[1] !== void 0 && abytes(args[1]);
      let cipher = constructor(key, ...args), checkOutput = (fnLength, output) => {
        if (output !== void 0) {
          if (fnLength !== 2)
            throw new Error("cipher output not supported");
          abytes(output);
        }
      }, called = !1;
      return {
        encrypt(data, output) {
          if (called)
            throw new Error("cannot encrypt() twice with same key + nonce");
          return called = !0, abytes(data), checkOutput(cipher.encrypt.length, output), cipher.encrypt(data, output);
        },
        decrypt(data, output) {
          if (abytes(data), tagl && data.length < tagl)
            throw new Error("invalid ciphertext length: smaller than tagLength=" + tagl);
          return checkOutput(cipher.decrypt.length, output), cipher.decrypt(data, output);
        }
      };
    }
    return Object.assign(wrappedCipher, params), wrappedCipher;
  };
  function getOutput(expectedLength, out, onlyAligned = !0) {
    if (out === void 0)
      return new Uint8Array(expectedLength);
    if (out.length !== expectedLength)
      throw new Error("invalid output length, expected " + expectedLength + ", got: " + out.length);
    if (onlyAligned && !isAligned32(out))
      throw new Error("invalid output, must be aligned");
    return out;
  }
  function isAligned32(bytes) {
    return bytes.byteOffset % 4 === 0;
  }
  function copyBytes(bytes) {
    return Uint8Array.from(bytes);
  }

  // AES-CTR
  var BLOCK_SIZE = 16, BLOCK_SIZE32 = 4;
  var POLY = 283;
  function mul2(n) {
    return n << 1 ^ POLY & -(n >> 7);
  }
  function mul(a, b) {
    let res = 0;
    for (; b > 0; b >>= 1)
      res ^= a & -(b & 1), a = mul2(a);
    return res;
  }
  var sbox = /* @__PURE__ */ (() => {
    let t = new Uint8Array(256);
    for (let i = 0, x2 = 1; i < 256; i++, x2 ^= mul2(x2))
      t[i] = x2;
    let box = new Uint8Array(256);
    box[0] = 99;
    for (let i = 0; i < 255; i++) {
      let x2 = t[255 - i];
      x2 |= x2 << 8, box[t[i]] = (x2 ^ x2 >> 4 ^ x2 >> 5 ^ x2 >> 6 ^ x2 >> 7 ^ 99) & 255;
    }
    return clean(t), box;
  })();
  var rotr32_8 = (n) => n << 24 | n >>> 8, rotl32_8 = (n) => n << 8 | n >>> 24;
  function genTtable(sbox2, fn2) {
    if (sbox2.length !== 256)
      throw new Error("Wrong sbox length");
    let T0 = new Uint32Array(256).map((_2, j) => fn2(sbox2[j])), T1 = T0.map(rotl32_8), T2 = T1.map(rotl32_8), T3 = T2.map(rotl32_8), T01 = new Uint32Array(256 * 256), T23 = new Uint32Array(256 * 256), sbox22 = new Uint16Array(256 * 256);
    for (let i = 0; i < 256; i++)
      for (let j = 0; j < 256; j++) {
        let idx = i * 256 + j;
        T01[idx] = T0[i] ^ T1[j], T23[idx] = T2[i] ^ T3[j], sbox22[idx] = sbox2[i] << 8 | sbox2[j];
      }
    return { sbox: sbox2, sbox2: sbox22, T0, T1, T2, T3, T01, T23 };
  }
  var tableEncoding = /* @__PURE__ */ genTtable(sbox, (s) => mul(s, 3) << 24 | s << 16 | s << 8 | mul(s, 2));
  var xPowers = /* @__PURE__ */ (() => {
    let p2 = new Uint8Array(16);
    for (let i = 0, x2 = 1; i < 16; i++, x2 = mul2(x2))
      p2[i] = x2;
    return p2;
  })();
  function expandKeyLE(key) {
    abytes(key);
    let len = key.length;
    if (![16, 24, 32].includes(len))
      throw new Error("aes: invalid key size, should be 16, 24 or 32, got " + len);
    let { sbox2 } = tableEncoding, toClean = [];
    isAligned32(key) || toClean.push(key = copyBytes(key));
    let k32 = u32(key), Nk = k32.length, subByte = (n) => applySbox(sbox2, n, n, n, n), xk = new Uint32Array(len + 28);
    xk.set(k32);
    for (let i = Nk; i < xk.length; i++) {
      let t = xk[i - 1];
      i % Nk === 0 ? t = subByte(rotr32_8(t)) ^ xPowers[i / Nk - 1] : Nk > 6 && i % Nk === 4 && (t = subByte(t)), xk[i] = xk[i - Nk] ^ t;
    }
    return clean(...toClean), xk;
  }
  function apply0123(T01, T23, s0, s1, s2, s3) {
    return T01[s0 << 8 & 65280 | s1 >>> 8 & 255] ^ T23[s2 >>> 8 & 65280 | s3 >>> 24 & 255];
  }
  function applySbox(sbox2, s0, s1, s2, s3) {
    return sbox2[s0 & 255 | s1 & 65280] | sbox2[s2 >>> 16 & 255 | s3 >>> 16 & 65280] << 16;
  }
  function encrypt(xk, s0, s1, s2, s3) {
    let { sbox2, T01, T23 } = tableEncoding, k = 0;
    s0 ^= xk[k++], s1 ^= xk[k++], s2 ^= xk[k++], s3 ^= xk[k++];
    let rounds = xk.length / 4 - 2;
    for (let i = 0; i < rounds; i++) {
      let t02 = xk[k++] ^ apply0123(T01, T23, s0, s1, s2, s3), t12 = xk[k++] ^ apply0123(T01, T23, s1, s2, s3, s0), t22 = xk[k++] ^ apply0123(T01, T23, s2, s3, s0, s1), t32 = xk[k++] ^ apply0123(T01, T23, s3, s0, s1, s2);
      s0 = t02, s1 = t12, s2 = t22, s3 = t32;
    }
    let t0 = xk[k++] ^ applySbox(sbox2, s0, s1, s2, s3), t1 = xk[k++] ^ applySbox(sbox2, s1, s2, s3, s0), t2 = xk[k++] ^ applySbox(sbox2, s2, s3, s0, s1), t3 = xk[k++] ^ applySbox(sbox2, s3, s0, s1, s2);
    return { s0: t0, s1: t1, s2: t2, s3: t3 };
  }
  function ctrCounter(xk, nonce, src, dst) {
    abytes(nonce, BLOCK_SIZE), abytes(src);
    let srcLen = src.length;
    dst = getOutput(srcLen, dst), complexOverlapBytes(src, dst);
    let ctr2 = nonce, c32 = u32(ctr2), { s0, s1, s2, s3 } = encrypt(xk, c32[0], c32[1], c32[2], c32[3]), src32 = u32(src), dst32 = u32(dst);
    for (let i = 0; i + 4 <= src32.length; i += 4) {
      dst32[i + 0] = src32[i + 0] ^ s0, dst32[i + 1] = src32[i + 1] ^ s1, dst32[i + 2] = src32[i + 2] ^ s2, dst32[i + 3] = src32[i + 3] ^ s3;
      let carry = 1;
      for (let i2 = ctr2.length - 1; i2 >= 0; i2--)
        carry = carry + (ctr2[i2] & 255) | 0, ctr2[i2] = carry & 255, carry >>>= 8;
      ({ s0, s1, s2, s3 } = encrypt(xk, c32[0], c32[1], c32[2], c32[3]));
    }
    let start = BLOCK_SIZE * Math.floor(src32.length / BLOCK_SIZE32);
    if (start < srcLen) {
      let b32 = new Uint32Array([s0, s1, s2, s3]), buf = u82(b32);
      for (let i = start, pos = 0; i < srcLen; i++, pos++)
        dst[i] = src[i] ^ buf[pos];
      clean(b32);
    }
    return dst;
  }
  var ctr = /* @__PURE__ */ wrapCipher({ blockSize: 16, nonceLength: 16 }, function(key, nonce) {
    function processCtr(buf, dst) {
      if (abytes(buf), dst !== void 0 && (abytes(dst), !isAligned32(dst)))
        throw new Error("unaligned destination");
      let xk = expandKeyLE(key), n = copyBytes(nonce), toClean = [xk, n];
      isAligned32(buf) || toClean.push(buf = copyBytes(buf));
      let out = ctrCounter(xk, n, buf, dst);
      return clean(...toClean), out;
    }
    return {
      encrypt: (plaintext, dst) => processCtr(plaintext, dst),
      decrypt: (ciphertext, dst) => processCtr(ciphertext, dst)
    };
  });

  // Hash helpers
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  function isBytes2(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  function anumber(n) {
    if (!Number.isSafeInteger(n) || n < 0)
      throw new Error("positive integer expected, got " + n);
  }
  function abytes2(b, ...lengths) {
    if (!isBytes2(b))
      throw new Error("Uint8Array expected");
    if (lengths.length > 0 && !lengths.includes(b.length))
      throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
  }
  function ahash(h2) {
    if (typeof h2 != "function" || typeof h2.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    anumber(h2.outputLen), anumber(h2.blockLen);
  }
  function aexists(instance, checkFinished = !0) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function aoutput(out, instance) {
    abytes2(out);
    let min = instance.outputLen;
    if (out.length < min)
      throw new Error("digestInto() expects output buffer of length at least " + min);
  }
  function clean2(...arrays) {
    for (let i = 0; i < arrays.length; i++)
      arrays[i].fill(0);
  }
  function createView2(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  }
  function rotr(word, shift) {
    return word << 32 - shift | word >>> shift;
  }
  function utf8ToBytes(str) {
    if (typeof str != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(str));
  }
  function toBytes(data) {
    return typeof data == "string" && (data = utf8ToBytes(data)), abytes2(data), data;
  }
  function concatBytes2(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
      let a = arrays[i];
      abytes2(a), sum += a.length;
    }
    let res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
      let a = arrays[i];
      res.set(a, pad), pad += a.length;
    }
    return res;
  }
  var Hash = class {
  };
  function createHasher(hashCons) {
    let hashC = (msg) => hashCons().update(toBytes(msg)).digest(), tmp = hashCons();
    return hashC.outputLen = tmp.outputLen, hashC.blockLen = tmp.blockLen, hashC.create = () => hashCons(), hashC;
  }

  // HMAC
  var HMAC = class extends Hash {
    constructor(hash, _key) {
      super(), this.finished = !1, this.destroyed = !1, ahash(hash);
      let key = toBytes(_key);
      if (this.iHash = hash.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      let blockLen = this.blockLen, pad = new Uint8Array(blockLen);
      pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
      for (let i = 0; i < pad.length; i++)
        pad[i] ^= 54;
      this.iHash.update(pad), this.oHash = hash.create();
      for (let i = 0; i < pad.length; i++)
        pad[i] ^= 106;
      this.oHash.update(pad), clean2(pad);
    }
    update(buf) {
      return aexists(this), this.iHash.update(buf), this;
    }
    digestInto(out) {
      aexists(this), abytes2(out, this.outputLen), this.finished = !0, this.iHash.digestInto(out), this.oHash.update(out), this.oHash.digestInto(out), this.destroy();
    }
    digest() {
      let out = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(out), out;
    }
    _cloneInto(to) {
      to || (to = Object.create(Object.getPrototypeOf(this), {}));
      let { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
      return to = to, to.finished = finished, to.destroyed = destroyed, to.blockLen = blockLen, to.outputLen = outputLen, to.oHash = oHash._cloneInto(to.oHash), to.iHash = iHash._cloneInto(to.iHash), to;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }, hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
  hmac.create = (hash, key) => new HMAC(hash, key);

  // SHA-2 base
  function setBigUint642(view, byteOffset, value, isLE2) {
    if (typeof view.setBigUint64 == "function")
      return view.setBigUint64(byteOffset, value, isLE2);
    let _32n = BigInt(32), _u32_max = BigInt(4294967295), wh = Number(value >> _32n & _u32_max), wl = Number(value & _u32_max), h2 = isLE2 ? 4 : 0, l = isLE2 ? 0 : 4;
    view.setUint32(byteOffset + h2, wh, isLE2), view.setUint32(byteOffset + l, wl, isLE2);
  }
  function Chi(a, b, c) {
    return a & b ^ ~a & c;
  }
  function Maj(a, b, c) {
    return a & b ^ a & c ^ b & c;
  }
  var HashMD = class extends Hash {
    constructor(blockLen, outputLen, padOffset, isLE2) {
      super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = blockLen, this.outputLen = outputLen, this.padOffset = padOffset, this.isLE = isLE2, this.buffer = new Uint8Array(blockLen), this.view = createView2(this.buffer);
    }
    update(data) {
      aexists(this), data = toBytes(data), abytes2(data);
      let { view, buffer, blockLen } = this, len = data.length;
      for (let pos = 0; pos < len; ) {
        let take = Math.min(blockLen - this.pos, len - pos);
        if (take === blockLen) {
          let dataView = createView2(data);
          for (; blockLen <= len - pos; pos += blockLen)
            this.process(dataView, pos);
          continue;
        }
        buffer.set(data.subarray(pos, pos + take), this.pos), this.pos += take, pos += take, this.pos === blockLen && (this.process(view, 0), this.pos = 0);
      }
      return this.length += data.length, this.roundClean(), this;
    }
    digestInto(out) {
      aexists(this), aoutput(out, this), this.finished = !0;
      let { buffer, view, blockLen, isLE: isLE2 } = this, { pos } = this;
      buffer[pos++] = 128, clean2(this.buffer.subarray(pos)), this.padOffset > blockLen - pos && (this.process(view, 0), pos = 0);
      for (let i = pos; i < blockLen; i++)
        buffer[i] = 0;
      setBigUint642(view, blockLen - 8, BigInt(this.length * 8), isLE2), this.process(view, 0);
      let oview = createView2(out), len = this.outputLen;
      if (len % 4)
        throw new Error("_sha2: outputLen should be aligned to 32bit");
      let outLen = len / 4, state = this.get();
      if (outLen > state.length)
        throw new Error("_sha2: outputLen bigger than state");
      for (let i = 0; i < outLen; i++)
        oview.setUint32(4 * i, state[i], isLE2);
    }
    digest() {
      let { buffer, outputLen } = this;
      this.digestInto(buffer);
      let res = buffer.slice(0, outputLen);
      return this.destroy(), res;
    }
    _cloneInto(to) {
      to || (to = new this.constructor()), to.set(...this.get());
      let { blockLen, buffer, length, finished, destroyed, pos } = this;
      return to.destroyed = destroyed, to.finished = finished, to.length = length, to.pos = pos, length % blockLen && to.buffer.set(buffer), to;
    }
    clone() {
      return this._cloneInto();
    }
  }, SHA256_IV = /* @__PURE__ */ Uint32Array.from([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);

  // SHA-2
  var SHA256_K = /* @__PURE__ */ Uint32Array.from([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]), SHA256_W = /* @__PURE__ */ new Uint32Array(64), SHA256 = class extends HashMD {
    constructor(outputLen = 32) {
      super(64, outputLen, 8, !1), this.A = SHA256_IV[0] | 0, this.B = SHA256_IV[1] | 0, this.C = SHA256_IV[2] | 0, this.D = SHA256_IV[3] | 0, this.E = SHA256_IV[4] | 0, this.F = SHA256_IV[5] | 0, this.G = SHA256_IV[6] | 0, this.H = SHA256_IV[7] | 0;
    }
    get() {
      let { A, B, C, D: D2, E: E2, F, G, H: H2 } = this;
      return [A, B, C, D2, E2, F, G, H2];
    }
    // prettier-ignore
    set(A, B, C, D2, E2, F, G, H2) {
      this.A = A | 0, this.B = B | 0, this.C = C | 0, this.D = D2 | 0, this.E = E2 | 0, this.F = F | 0, this.G = G | 0, this.H = H2 | 0;
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        SHA256_W[i] = view.getUint32(offset, !1);
      for (let i = 16; i < 64; i++) {
        let W15 = SHA256_W[i - 15], W2 = SHA256_W[i - 2], s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3, s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
        SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
      }
      let { A, B, C, D: D2, E: E2, F, G, H: H2 } = this;
      for (let i = 0; i < 64; i++) {
        let sigma1 = rotr(E2, 6) ^ rotr(E2, 11) ^ rotr(E2, 25), T1 = H2 + sigma1 + Chi(E2, F, G) + SHA256_K[i] + SHA256_W[i] | 0, T2 = (rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22)) + Maj(A, B, C) | 0;
        H2 = G, G = F, F = E2, E2 = D2 + T1 | 0, D2 = C, C = B, B = A, A = T1 + T2 | 0;
      }
      A = A + this.A | 0, B = B + this.B | 0, C = C + this.C | 0, D2 = D2 + this.D | 0, E2 = E2 + this.E | 0, F = F + this.F | 0, G = G + this.G | 0, H2 = H2 + this.H | 0, this.set(A, B, C, D2, E2, F, G, H2);
    }
    roundClean() {
      clean2(SHA256_W);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0), clean2(this.buffer);
    }
  };
  var sha256 = /* @__PURE__ */ createHasher(() => new SHA256());

  // SHA-256
  var sha2562 = sha256;

  // UMP crypto
  var CryptoContext = class {
    constructor(key) {
      this.aesKey = key.slice(0, 16), this.hmacKey = key.slice(16);
    }
    signature(content) {
      return hmac(sha2562, this.hmacKey, concatBytes2(content, this.iv));
    }
    decrypt(part) {
      this.iv = part.iv;
      let signature = this.signature(part.encryptedContent);
      if (!equalBytes2(signature, part.hmac))
        throw new Error("HMAC verification failed");
      return ctr(this.aesKey, this.iv).decrypt(part.encryptedContent);
    }
    encrypt(content) {
      let encryptedContent = ctr(this.aesKey, this.iv).encrypt(content);
      return { encryptedContent, hmac: this.signature(encryptedContent) };
    }
  };
  function equalBytes2(left, right) {
    if (left.length !== right.length) return !1;
    let difference = 0;
    for (let index = 0; index < left.length; index++)
      difference |= left[index] ^ right[index];
    return difference === 0;
  }

  // UMP response handler
  var ONESIE_HEADER_PART = 10, ENCRYPTED_RESPONSE_PART = 11, ONESIE_INNERTUBE_RESPONSE = 25;
  function headerType(bytes) {
    let cursor = { offset: 0 };
    for (; cursor.offset < bytes.length; ) {
      let tag = readVarint(bytes, cursor);
      if (tag >>> 3 === 1 && (tag & 7) === 0)
        return readVarint(bytes, cursor) | 0;
      if ((tag & 7) === 0) readVarint(bytes, cursor);
      else if ((tag & 7) === 2) cursor.offset += readVarint(bytes, cursor);
      else throw new Error("unsupported Onesie header");
    }
    return 0;
  }
  function rewriteEncryptedPart(bytes, crypto, cache) {
    let part = xi.fromBinary(bytes), plaintext = gunzipSync(crypto.decrypt(part)), response = Wi.fromBinary(plaintext);
    for (let content of response.contents)
      content.player && enhancePlayer(content.player), content.next && removeFeedAds(content.next, cache);
    let compressed = gzipSync(Wi.toBinary(response), {
      level: 0
    }), encrypted = crypto.encrypt(compressed);
    return part.hmac = encrypted.hmac, part.encryptedContent = encrypted.encryptedContent, xi.toBinary(part);
  }
  function handleUmpResponse() {
    let environment2 = new SurgeEnvironment(), key = platformKey(environment2.request);
    try {
      let { clientKey } = currentKeys(environment2, key);
      if (!clientKey) throw new Error("YouTubeConfig requires stored clientKey");
      if (!environment2.response?.bodyBytes)
        throw new Error("YouTubeConfig requires body");
      let cache = loadAdCache(environment2), crypto = new CryptoContext(decodeBase64(clientKey)), reader = new UmpReader(environment2.response.bodyBytes), writer = new UmpWriter(environment2.response.bodyBytes.length), rewriteNextPart = !1;
      for (; reader.hasNext; ) {
        let part = reader.readPart();
        part.type === ONESIE_HEADER_PART ? rewriteNextPart = headerType(part.data) === ONESIE_INNERTUBE_RESPONSE : part.type === ENCRYPTED_RESPONSE_PART && rewriteNextPart && (part.data = rewriteEncryptedPart(part.data, crypto, cache), rewriteNextPart = !1), writer.writePart(part);
      }
      saveAdCache(environment2, cache), environment2.done({ bodyBytes: writer.finish() });
    } catch (error) {
      console.log(String(error)), clearCurrentKeys(environment2, key), environment2.done({
        status: 200,
        headers: { "Content-Type": "text/plain" },
        bodyBytes: new Uint8Array()
      });
    }
  }

  // Response dispatch
  $request.url.includes("/initplayback") ? handleUmpResponse() : handleApiResponse();
})();
