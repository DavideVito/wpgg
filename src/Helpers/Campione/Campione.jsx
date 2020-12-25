import React from "react";
import { useParams } from "react-router-dom";

import Runes from "./Runes";
import Abilities from "./Abilities";
import Items from "./Items";
import Combos from "./Combos";

const Campione = () => {
  let { id } = useParams();

  let [campione, setCampione] = React.useState(undefined);
  let [counter, setCounter] = React.useState(0);

  const loadJson = async () => {
    let userLang = navigator.language || navigator.userLanguage;
    userLang = userLang.replace("-", "_");

    let ris = await fetch(
      `http://ddragon.leagueoflegends.com/cdn/10.25.1/data/${userLang}/champion/${id}.json`
    );

    let data = await ris.json();

    data = data.data[id];

    let spellObject = {};

    data.spells.forEach((spell) => {
      spellObject[spell.id] = spell;
    });

    data.spells = spellObject;

    let skinObject = {};

    data.skins.forEach((skin) => {
      skinObject[skin.name] = skin;
    });

    data.skinsObject = skinObject;

    setCampione(data);
  };

  React.useEffect(() => {
    loadJson();
  }, []);

  if (!campione) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>{id} </div>
      <div>{campione.lore}</div>
      <img
        src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${id}_${campione.skins[counter].num}.jpg`}
        alt={campione.skins[counter].name}
      />
      <button
        onClick={() => {
          let next = (counter + 1) % campione.skins.length;

          setCounter(next);
        }}
      >
        Next Skin
      </button>
      <div>
        <div>
          <h1>Abilities</h1>
        </div>
        <Abilities name={id} spells={campione.spells} />
      </div>

      <div>
        <div>
          <h1>Combos</h1>
        </div>
        <Combos name={id} />
      </div>

      <div>
        <div>
          <h1>Runes</h1>
        </div>
        <Runes name={id} />
      </div>

      <div>
        <div>
          <h1>Items</h1>
          <Items name={id} />
        </div>
      </div>
    </div>
  );
};

export default Campione;
