import { useState, useEffect } from "react";
import { useFirestore } from "reactfire";
const Runes = ({ champion }) => {
  let [runes, setRunes] = useState(undefined);

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
    console.log(data);
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

    let princ = { Rune: principale, nome: runes[firstSelectedGroup].name };
    let second = { Rune: secondario, nome: runes[secondSelectedGroup].name };

    if (!champion || !champion.id) {
      alert("No champion");
      return;
    }

    firestore
      .collection("Campioni")
      .doc(champion.id)
      .collection("Runes")
      .add({ principale: princ, secondaria: second });
  };

  useEffect(() => {
    loadJson();
  }, []);

  if (!runes || firstSelectedGroup === -1 || secondSelectedGroup === -1) {
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
        {runes.map((runa) => {
          return <option value={runa.key}>{runa.name}</option>;
        })}
      </select>

      <div>
        {runes[secondSelectedGroup].slots.map((slot) => {
          return (
            <div>
              <select className="secondGroup">
                {slot.runes.map((r) => {
                  return <option value={r.key}>{r.name}</option>;
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
