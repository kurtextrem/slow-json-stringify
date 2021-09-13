import { sjs, attr, escape } from "../src/sjs.mjs";

const stringify = sjs({
  a: attr("string", (value) => `${value} lol`),
  b: attr("null"),
  // c: {
  //   a: attr('array', sjs({
  //     l: 'string',
  //   })),
  // }
  c: attr("array"),
});

console.log(
  stringify({
    a: "hello",
    b: null,
    c: {
      a: [
        {
          l: "lol",
        },
        {
          l: "lolllp",
        },
      ],
    },
  })
);
