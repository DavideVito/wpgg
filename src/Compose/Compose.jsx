import { useUser, useAuth } from "reactfire";
import { useState, useEffect } from "react";
import firebase from "firebase";
import DebounceInput from "react-debounce-input";

import Runes from "./Runes";

import Items from "./Item";
import Spells from "./Spells";
import Combos from "./Combos";

const Compose = () => {
  let [championName, setChampionName] = useState("");
  let [champion, setChampion] = useState(undefined);

  let auth = useAuth();

  const { data: user } = useUser();

  const signIn = () => {
    var provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider);
  };

  const signOut = () => {
    auth.signOut();
  };

  const loadChampJson = async () => {
    let ris = await fetch(
      `http://ddragon.leagueoflegends.com/cdn/10.25.1/data/en_GB/champion/${championName}.json`
    );

    let data = await ris.json();

    data = data.data[championName];

    let spellObject = {};

    data.spells.forEach((spell) => {
      spellObject[spell.id] = spell;
    });

    data.spellsObject = spellObject;

    let skinObject = {};

    data.skins.forEach((skin) => {
      skinObject[skin.name] = skin;
    });

    data.skinsObject = skinObject;

    setChampion(data);
  };

  useEffect(() => {
    loadChampJson();
  }, [championName]);

  if (!user) {
    return <button onClick={signIn}>Accedi </button>;
  }

  return (
    <div>
      <div>
        <DebounceInput
          minLength={2}
          debounceTimeout={300}
          onChange={(event) => setChampionName(event.target.value)}
        />
      </div>
      <div>{championName}</div>

      {champion && (
        <div>
          <Spells champion={champion} />
          <Items champion={champion} />
          <Combos champion={champion} />
          <Runes champion={champion} />
        </div>
      )}

      <div style={{ height: "200px" }}></div>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default Compose;
