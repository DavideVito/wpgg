import { useUser, useAuth } from "reactfire";
import { useState, useEffect } from "react";
import firebase from "firebase";
import DebounceInput from "react-debounce-input";

import { useFirestore } from "reactfire";

const Compose = () => {
  let [championName, setChampionName] = useState("");
  let [spells, setSpells] = useState([]);
  let [currentLevel, setCurrentLevel] = useState(1);
  let [abilitaLivelli, setAbilitaLivelli] = useState([]);
  let [combos, setCombos] = useState([]);
  let [comboText, setComboText] = useState("");
  let [comboVideo, setComboVideo] = useState("");
  let [items, setItems] = useState([]);
  let [searchedItems, setSearchedItems] = useState([]);
  let [selectedItems, setSelectedItems] = useState([]);

  const firestore = useFirestore();

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

    setSpells(data.spells);
  };

  const loadItemsJson = async () => {
    let ris = await fetch(
      `http://ddragon.leagueoflegends.com/cdn/10.25.1/data/en_GB/item.json`
    );

    let data = await ris.json();

    data = data.data;

    setItems(data);
  };

  const pushItemsToDatabase = () => {
    if (!champion || !champion.id) {
      alert("No champion");
      return;
    }
    selectedItems.forEach((item) => {
      let id = item.image.full.split(".")[0];

      firestore
        .collection("Campioni")
        .doc(champion.id)
        .collection("Items")
        .add({ id: id });
    });
  };

  const addItem = (item) => {
    let a = [...selectedItems, item];

    setSelectedItems(a);
  };

  const cercaItem = (nomeItem) => {
    if (nomeItem === "") {
      setSearchedItems([]);
    }

    let it = Object.keys(items).map(function (key) {
      let i = items[key];

      let esito = i.name.toLowerCase().startsWith(nomeItem.toLowerCase());

      return esito ? i : undefined;
    });

    it = it.filter((i) => {
      return typeof i !== "undefined";
    });

    setSearchedItems(it);
  };

  let [champion, setChampion] = useState(undefined);

  useEffect(() => {
    loadItemsJson();
  }, []);

  useEffect(() => {
    loadChampJson();
  }, [championName]);

  if (!user) {
    return <button onClick={signIn}>Accedi </button>;
  }

  const conferma = () => {
    firestore
      .collection("Campioni")
      .doc(champion.id)
      .set({ nome: champion.id });

    if (abilitaLivelli.length === 0) {
      alert("No");
      return;
    }

    if (abilitaLivelli.length !== 18) {
      window.alert(
        "Non gli hai messi tutti non ci riprovare va a finire male te lo dico non scherzare ok?"
      );
      return;
    }

    abilitaLivelli.forEach((abilita) => {
      firestore
        .collection("Campioni")
        .doc(champion.id)
        .collection("Abilities")
        .add({ level: abilita.livello, name: abilita.spell });
    });
  };

  const aggiungiCombo = () => {
    let ogg = { name: comboText, video: comboVideo };

    combos.push(ogg);
    setCombos(combos);
  };

  const aggiungiAbilita = (spellId) => {
    if (currentLevel > 18) {
      alert("no negro ");
      return;
    }

    let ogg = { livello: currentLevel, spell: spellId };

    abilitaLivelli.push(ogg);
    setAbilitaLivelli(abilitaLivelli);

    setCurrentLevel(currentLevel + 1);
  };

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
      <div>
        {spells.map((spell) => {
          return (
            <div
              key={spell.id}
              onClick={() => {
                aggiungiAbilita(spell.id);
              }}
            >
              {spell.name}
            </div>
          );
        })}
      </div>

      <div>
        <h1>Abilita per ogni livello madonna troia</h1>
        {abilitaLivelli.map((ab) => {
          return (
            <div key={ab.livello}>
              {ab.livello} {ab.spell}
            </div>
          );
        })}

        <button onClick={conferma}> Conferma</button>
      </div>

      <h1>Aggiungi Combo</h1>

      <div>
        <DebounceInput
          minLength={2}
          debounceTimeout={300}
          onChange={(event) => setComboText(event.target.value)}
        />
        <DebounceInput
          minLength={2}
          debounceTimeout={300}
          onChange={(event) => setComboVideo(event.target.value)}
        />

        <button onClick={aggiungiCombo}>Aggiungi</button>
      </div>

      <div>
        <h1>Combos</h1>
        {combos.map((com) => {
          return (
            <div>
              {com.name} {com.video}
            </div>
          );
        })}

        <button onClick={conferma}> Conferma Combos</button>
      </div>

      <h1>Cerca item</h1>
      <div>
        <DebounceInput
          minLength={2}
          debounceTimeout={300}
          onChange={(event) => cercaItem(event.target.value)}
        />

        {searchedItems.map((item) => {
          return (
            <div>
              <div>{item.name}</div>
              <button
                onClick={() => {
                  addItem(item);
                }}
              >
                Aggiungi
              </button>
            </div>
          );
        })}
      </div>

      <div>
        <h1>Added items</h1>
        <div>Item selected: {selectedItems.length}</div>
        {selectedItems.map((item, index) => {
          return (
            <div>
              {item.name}{" "}
              <button
                onClick={() => {
                  selectedItems.splice(index, 1);
                  let a = [...selectedItems];

                  setSelectedItems(a);
                }}
              >
                Rimuovi
              </button>
            </div>
          );
        })}

        <button onClick={pushItemsToDatabase}>Push to DB</button>
      </div>

      <div style={{ height: "200px" }}></div>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default Compose;
