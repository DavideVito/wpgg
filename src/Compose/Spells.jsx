import { useState, useEffect } from "react";
import { useFirestore } from "reactfire";

const Spells = ({ champion }) => {
  console.log(champion);

  let [spells, setSpells] = useState([]);
  let [currentLevel, setCurrentLevel] = useState(1);
  let [abilitaLivelli, setAbilitaLivelli] = useState([]);
  const firestore = useFirestore();

  const confermaAbilita = () => {
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
    <>
      <div>
        {champion.spells.map((spell) => {
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

        <button onClick={confermaAbilita}> Conferma</button>
      </div>
    </>
  );
};

export default Spells;
