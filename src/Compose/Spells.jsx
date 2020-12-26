import { useState, useEffect } from "react";
import { useFirestore } from "reactfire";

const Spells = ({ champion }) => {
  let [spells, setSpells] = useState(undefined);
  let [currentLevel, setCurrentLevel] = useState(1);
  let [abilitaLivelli, setAbilitaLivelli] = useState([]);
  const firestore = useFirestore();

  useEffect(() => {
    setSpells(champion.spellsObject);
  }, []);

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

  if (!spells) {
    return <div>Loading spells..</div>;
  }

  return (
    <>
      <div>
        {champion.spells.map((spell) => {
          return (
            <div>
              <img
                onClick={() => {
                  aggiungiAbilita(spell.id);
                }}
                style={{ cursor: "pointer" }}
                key={spell.id}
                src={`http://ddragon.leagueoflegends.com/cdn/10.25.1/img/spell/${spell.image.full}`}
                alt=""
              />
              <div key={spell.id}>{spell.name}</div>
            </div>
          );
        })}
      </div>

      <div>
        <h1>
          Abilita per ogni livello, clicca su uno per cavarlo e buttarlo via nel
          cestino senza pieta, lasciandolo sofferente nell'oblio come la
          signorina <a href="https://lvtl.tk/050ef636">Giulia Scarano </a>
        </h1>
        {abilitaLivelli.map((ab, index) => {
          return (
            <div key={ab.livello}>
              <div>
                <img
                  onClick={() => {
                    abilitaLivelli.splice(index, 1);
                    let a = [...abilitaLivelli];

                    setCurrentLevel(currentLevel - 1);
                    setAbilitaLivelli(a);
                  }}
                  style={{ cursor: "pointer" }}
                  key={`${spells[ab.spell].id}${Math.random()}`}
                  src={`http://ddragon.leagueoflegends.com/cdn/10.25.1/img/spell/${
                    spells[ab.spell].image.full
                  }`}
                  alt=""
                />
              </div>
            </div>
          );
        })}

        <button onClick={confermaAbilita}> Conferma</button>
      </div>
    </>
  );
};

export default Spells;
