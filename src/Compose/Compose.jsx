import {
  useUser,
  useAuth,
  useFirestore,
  useFirestoreCollectionData,
} from "reactfire";
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
  let [selectedRole, setSelectedRole] = useState(null);

  let auth = useAuth();

  const firestore = useFirestore();

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
    setSelectedRole(window.roles[0]);
  }, [championName]);

  useEffect(() => {
    if (!champion) return;
    firestore
      .collection("Campioni")
      .doc(champion.name)
      .set({ roles: window.roles }, { merge: true });
  }, [champion]);

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

      <h1>
        Madonna stronza ricordati di premere invia in tutti sennò succede un
        casino
      </h1>

      {champion && (
        <div>
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
          <Spells champion={champion} role={selectedRole} />
          <Items champion={champion} role={selectedRole} />
          <Combos champion={champion} role={selectedRole} />
          <Runes champion={champion} role={selectedRole} />
        </div>
      )}

      <div style={{ height: "200px" }}></div>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default Compose;
