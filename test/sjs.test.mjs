import { expect } from 'chai';
import { sjs, escape, attr } from '../src/sjs.mjs';

describe('Slow-json-stringify tests', () => {
  it('Should throw if unknown type is provided when defining a schema', () => {
    const schemaDefinition = () => sjs({
      a: attr('sting'), // Typo
    });
    const schemaDefinition1 = () => sjs({
      a: attr('arry'), // Typo
    });

    expect(schemaDefinition).to.throw();
    expect(schemaDefinition1).to.throw();
  });

  it('Should not throw if known type is provided when defining a schema', () => {
    const schemaDefinition = () => sjs({
      a: attr('string'),
      b: attr('number'),
      c: attr('boolean'),
    });
    const schemaDefinition1 = () => sjs({
      a: attr('array'),
      b: attr('array', sjs({
        a: attr('string'),
      })),
    });

    expect(schemaDefinition).to.not.throw();
    expect(schemaDefinition1).to.not.throw();
  });

  it('Should stringify a simple object equivalently to native JSON.stringify', () => {
    const stringify = sjs({
      hello: attr('string'),
    });

    const test = { hello: 'world' };
    const native = JSON.stringify(test);
    const slow = stringify(test);

    expect(slow).to.be.a('string').equal(native);
  });

  it('Should stringify an object with nested props equivalently to native JSON.stringify', () => {
    const stringify = sjs({
      hello: attr('string'),
      a: attr('number'),
      b: attr('boolean'),
      c: {
        d: {
          e: attr('string'),
        },
      },
    });

    const test = {
      hello: 'world',
      a: 123,
      b: false,
      c: {
        d: {
          e: 'pernacchia',
        },
      },
    };
    const native = JSON.stringify(test);
    const slow = stringify(test);

    expect(slow).to.be.a('string').equal(native);
  });

  it('Should stringify an object with simple arrais equivalently to native JSON.stringify', () => {
    const stringify = sjs({
      hello: attr('string'),
      a: attr('array'),
    });

    const test = {
      hello: 'world',
      a: [1, 2, 'test'],
    };
    const native = JSON.stringify(test);
    const slow = stringify(test);

    expect(slow).to.be.a('string').equal(native);
  });

  it('Should stringify an object with complex arrais equivalently to native JSON.stringify', () => {
    const stringify = sjs({
      hello: attr('string'),
      a: attr('array', sjs({
        b: attr('string'),
        c: {
          d: attr('number'),
        },
      })),
    });

    const test = {
      hello: 'world',
      a: [{
        b: 'test',
        c: {
          d: 189,
        },
      }, {
        b: 'test1',
        c: {
          d: 1892312,
        },
      }, {
        b: 'test2',
        c: {
          d: 9,
        },
      }, {
        b: 'test3',
        c: {
          d: 9.89,
        },
      }, {
        b: 'test4',
        c: {
          d: 1.323289,
        },
      }],
    };

    const native = JSON.stringify(test);
    const slow = stringify(test);

    expect(slow).to.be.a('string').equal(native);
  });

  it('Should stringify correct json syntax given a simple object', () => {
    const stringify = sjs({
      hello: attr('string'),
    });

    const test = { hello: 'world' };
    const slow = stringify(test);
    const t = () => JSON.parse(slow);

    expect(t).to.not.throw();
  });

  it('Should stringify correct json syntax given a complex object', () => {
    const stringify = sjs({
      hello: attr('string'),
      a: attr('number'),
      b: attr('boolean'),
      c: {
        d: {
          e: attr('string'),
        },
      },
    });

    const test = {
      hello: 'world',
      a: 123,
      b: false,
      c: {
        d: {
          e: 'pernacchia',
        },
      },
    };

    const slow = stringify(test);
    const t = () => JSON.parse(slow);

    expect(t).to.not.throw();
  });

  it('Should stringify correct json syntax given an object with dynamic arrais', () => {
    const stringify = sjs({
      hello: attr('string'),
      a: attr('array', sjs({
        b: attr('string'),
        c: {
          d: attr('number'),
        },
      })),
    });

    const test = {
      hello: 'world',
      a: [{
        b: 'test',
        c: {
          d: 189,
        },
      }, {
        b: 'test1',
        c: {
          d: 1892312,
        },
      }, {
        b: 'test2',
        c: {
          d: 9,
        },
      }, {
        b: 'test3',
        c: {
          d: 9.89,
        },
      }, {
        b: 'test4',
        c: {
          d: 1.323289,
        },
      }],
    };

    const slow = stringify(test);
    const t = () => JSON.parse(slow);

    expect(t).to.not.throw();
  });

  it('Should escape strings and parse correctly', () => {
    const stringify = sjs({
      hello: attr('string'),
    });

    const unescapedString = '"Hello World"';
    const escapedString = escape()(unescapedString);

    const test = {
      hello: escapedString,
    };

    const slow = stringify(test);
    const t = () => JSON.parse(slow);

    expect(t).to.not.throw();
  });

  it('Should escape strings when providing custom regex', () => {
    const stringify = sjs({
      hello: attr('string'),
    });

    const unescapedString = '"Hello World"';
    const escapedString = escape(/\"/gm)(unescapedString);

    const test = {
      hello: escapedString,
    };

    const slow = stringify(test);
    const t = () => JSON.parse(slow);

    expect(t).to.not.throw();
  });

  it('Should stringify undefined', () => {
    const stringify = sjs({
      hello: attr('string'),
      hello1: attr('number'),
      hello2: attr('boolean'),
    });

    const test = {
      hello: undefined,
      hello1: undefined,
      hello2: undefined,
    };

    const slow = stringify(test);
    const t = () => JSON.parse(slow);
    expect(t).to.not.throw();
  });

  it('Should stringify null', () => {
    const stringify = sjs({
      hello: attr('null'),
      hello1: attr('number'),
      hello2: attr('null'),
    });

    const test = {
      hello: null,
      hello1: undefined,
      hello2: null,
    };

    const slow = stringify(test);
    const native = JSON.stringify(test);

    const t = () => JSON.parse(slow);

    expect(t).to.not.throw();
    expect(slow).to.equal(native);
  });

  it('Should stringify Dates', () => {
    const stringify = sjs({
      hello: attr('string'),
      hello1: attr('string'),
    });

    const test = {
      hello: new Date(),
      hello1: Date.now(),
    };

    const slow = stringify(test);
    const t = () => JSON.parse(slow);
    expect(t).to.not.throw();
  });

  it('Should stringify correctly given same property names', () => {
    const stringify = sjs({
      a: attr('string'),
      b: {
        a: attr('string'),
      },
    });

    const test = {
      a: 'a',
      b: {
        a: 'a1',
      },
    };
    const slow = stringify(test);
    const t = JSON.parse(slow);

    expect(t.a).to.be.equal('a');
    expect(t.b.a).to.be.equal('a1');
  });

  it('Should stringify nullArray correctly', () => {
    const stringify = sjs({
      a: attr('nullArray', sjs({
        b: attr('string'),
      })),
    });

    const test = {
      a: null,
    };
    const test2 = {
      a: [],
    };
    const test3 = {
      a: [{
        b: 'c',
      }],
    };
    const slow = stringify(test);
    const slow2 = stringify(test2);
    const slow3 = stringify(test3);
    const t = JSON.parse(slow);
    const t2 = JSON.parse(slow2);
    const t3 = JSON.parse(slow3);

    expect(t.a).to.be.equal(null);
    expect(t2.a).to.be.equal(undefined);
    expect(t3.a[0].b).to.be.equal('c');
  });
});
