// this is where the two grammars are pieced together and connected

function pick(arr) {
  if (!arr || arr.length === 0) return "";
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateLine(grammar) {

  if (MODE === "machine") {
    const traits = Object.keys(grammar);
    const trait = pick(traits);

    localStorage.setItem("sharedTrait", trait);

    return pick(grammar[trait]);
  }

  if (MODE === "embodied") {
    const trait = localStorage.getItem("sharedTrait");

    if (!trait || !grammar[trait]) {
      return pick(grammar.fallback);
    }

    return pick(grammar[trait]);

  }
}