import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useFirestore } from "reactfire";
import Runes from "./Runes";
import Abilities from "./Abilities";
import Items from "./Items";
import Combos from "./Combos";

const Campione = () => {
  let { id } = useParams();

  let [campione, setCampione] = React.useState(undefined);
  let [dbData, setDbData] = React.useState(undefined);
  let [counter, setCounter] = React.useState(0);
  let [selectedRole, setSelectedRole] = useState(undefined);

  const firestore = useFirestore();

  useEffect(() => {
    if (!selectedRole) return;

    firestore
      .collection("Campioni")
      .doc(id)
      .collection("Roles")
      .doc(selectedRole)
      .get()
      .then((snapshot) => {
        setDbData(snapshot.data());
      });
  }, [selectedRole]);

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
    setSelectedRole(window.roles[0]);
  }, []);

  if (!campione) {
    return <div>Loading...</div>;
  }

  if (!dbData) {
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
      <select
        onChange={(e) => {
          let a = e.target.options[e.target.selectedIndex].value;
          setSelectedRole(a);
        }}
      >
        {window.roles.map((role) => {
          return (
            <option value={role} key={role}>
              {window.capitalizeFirstLetter(role)}
            </option>
          );
        })}
      </select>
      <div>
        <div>
          <h1>Abilities</h1>
        </div>
        <Abilities
          name={id}
          spells={campione.spells}
          role={selectedRole}
          abilities={dbData.abilities}
        />
      </div>

      <div>
        <div>
          <h1>Combos</h1>
        </div>
        <Combos name={id} role={selectedRole} combos={dbData.combos} />
      </div>

      <div>
        <div>
          <h1>Runes</h1>
        </div>

        <Runes name={id} role={selectedRole} runes={dbData.runes} />
      </div>

      <div>
        <div>
          <h1>Items</h1>
          <Items name={id} role={selectedRole} items={dbData.items} />
        </div>
      </div>
    </div>
  );
};

export default Campione;
