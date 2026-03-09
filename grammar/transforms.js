// this is where the two grammars are pieced together and connected

function pick(arr) {
  if (!arr || arr.length === 0) return "";
  return arr[Math.floor(Math.random() * arr.length)];
}

function expandTemplate(template, slots) {
  return template.replace(/{(.*?)}/g, (match, key) => {
    const options = slots[key];
    if (!options) return match;
    return pick(options);
  });
}

/*
function generateLine(grammar) {

  if (MODE === "machine") {
    const traits = Object.keys(grammar);
    const trait = pick(traits);

    localStorage.setItem("sharedTrait", trait);

    return resolveTrait(grammar[trait]); //return pick(grammar[trait]);
  }

  if (MODE === "embodied") {
    const trait = localStorage.getItem("sharedTrait");

    if (!trait || !grammar[trait]) {
      return pick(grammar.fallback);
    }

    return resolveTrait(grammar[trait]); //return pick(grammar[trait]);

  }
}
  */

function generateLine(grammar) {

  const traits = Object.keys(grammar).filter(t => t !== "fallback");

  const trait = pick(traits);

  return resolveTrait(grammar[trait]);
}

// temp helper function for the array vs rita
function resolveTrait(traitData) {

  // Old array format
  if (Array.isArray(traitData)) {
    return pick(traitData);
  }

  // Multiple template support
  if (traitData.template1 || traitData.template2) {
    const templates = [];

    if (traitData.template1) templates.push(traitData.template1);
    if (traitData.template2) templates.push(traitData.template2);

    const chosenTemplate = pick(templates);
    return expandTemplate(chosenTemplate, traitData.slots || {});
  }

  // Single template support
  if (traitData.template) {
    return expandTemplate(traitData.template, traitData.slots || {});
  }

  return "";
}