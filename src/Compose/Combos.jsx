import { useState } from "react";
import DebounceInput from "react-debounce-input";

import { useFirestore } from "reactfire";

const Combos = ({ champion }) => {
  const firestore = useFirestore();

  let [combos, setCombos] = useState([]);
  let [comboText, setComboText] = useState("");
  let [comboVideo, setComboVideo] = useState("");

  const aggiungiCombo = () => {
    let ogg = { name: comboText, video: comboVideo };

    let a = [...combos, ogg];

    setCombos(a);
  };

  const pushToDatabase = () => {
    if (!champion || !champion.id) {
      alert("No champion");
      return;
    }
    combos.forEach((combo) => {
      firestore
        .collection("Campioni")
        .doc(champion.id)
        .collection("Combo")
        .add({ name: combo.name, video: combo.video });
    });
  };

  return (
    <>
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
        {combos.map((com) => {
          return (
            <div>
              {com.name} {com.video}
            </div>
          );
        })}

        <div>
          {combos.length > 0 ? (
            <div>
              <button onClick={pushToDatabase}>
                Push {combos.length} to database
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </>
  );
};

export default Combos;
