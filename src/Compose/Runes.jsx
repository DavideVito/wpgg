import { useState, useEffect } from "react";
import { useFirestore } from "reactfire";
const Runes = ({ champion, role }) => {
  let [runes, setRunes] = useState(undefined);
  let [secondary, setSecondary] = useState(undefined);

  let [firstSelectedGroup, setFirstSelectedGroup] = useState(-1);
  let [secondSelectedGroup, setSecondSelectedGroup] = useState(-1);

  const firestore = useFirestore();

  const loadJson = async () => {
    let ris = await fetch(
      `http://ddragon.leagueoflegends.com/cdn/10.16.1/data/en_GB/runesReforged.json`
    );

    let data = await ris.json();

    setRunes(data);
    setFirstSelectedGroup(0);
    setSecondSelectedGroup(0);

    let d = data.map((runa) => {
      let slots = [
        ...runa.slots[1].runes,
        ...runa.slots[2].runes,
        ...runa.slots[3].runes,
      ];

      let ogg = { ...runa, slots };

      return ogg;
    });

    setSecondary(d);

    console.log({ data, d });
  };

  const addToDatabase = () => {
    let firstGroup = document.getElementsByClassName("firstGroup");
    let secondGroup = document.getElementsByClassName("secondGroup");

    let principale = [...firstGroup].map((html) => {
      let a = html.options[html.selectedIndex].value;
      return a;
    });

    let secondario = [...secondGroup].map((html) => {
      let a = html.options[html.selectedIndex].value;
      return a;
    });

    let princ = { Rune: principale, nome: runes[firstSelectedGroup].key };
    let second = { Rune: secondario, nome: runes[secondSelectedGroup].key };

    if (!champion || !champion.id) {
      alert("No champion");
      return;
    }

    let o = { principale: princ, secondaria: second };

    firestore
      .collection("Campioni")
      .doc(champion.id)
      .collection("Roles")
      .doc(role)
      .set({ runes: o }, { merge: true });
  };

  useEffect(() => {
    loadJson();
  }, []);

  if (
    !runes ||
    firstSelectedGroup === -1 ||
    secondSelectedGroup === -1 ||
    !secondary
  ) {
    return <div>Loading runes...</div>;
  }

  return (
    <div>
      <h1>Runes</h1>

      <select
        onChange={(e) => {
          setFirstSelectedGroup(e.target.selectedIndex);
        }}
      >
        {runes.map((runa) => {
          return <option value={runa.key}>{runa.name}</option>;
        })}
      </select>

      <div>
        {runes[firstSelectedGroup].slots.map((slot) => {
          return (
            <div>
              <select className="firstGroup">
                {slot.runes.map((r) => {
                  return <option value={r.key}>{r.name}</option>;
                })}
              </select>
            </div>
          );
        })}
      </div>
      <div style={{ height: "20px" }}></div>

      <select
        onChange={(e) => {
          setSecondSelectedGroup(e.target.selectedIndex);
        }}
      >
        {secondary.map((runa) => {
          if (runes[firstSelectedGroup].key === runa.key) {
            return <></>;
          }
          return <option value={runa.key}>{runa.name}</option>;
        })}
      </select>

      <div>
        {[1, 2].map((_) => {
          return (
            <div>
              <select className={`secondGroup`}>
                {secondary[secondSelectedGroup].slots.map((slot) => {
                  return <option value={slot.key}>{slot.name}</option>;
                })}
              </select>
            </div>
          );
        })}
      </div>
      <button onClick={addToDatabase}>Add to database</button>
    </div>
  );
};

export default Runes;
