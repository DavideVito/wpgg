import { useFirestoreCollectionData, useFirestore } from "reactfire";

import { useEffect, useState } from "react";

const Runes = ({ name }) => {
  let [runes, setRunes] = useState(undefined);

  const loadJson = async () => {
    let userLang = navigator.language || navigator.userLanguage;
    userLang = userLang.replace("-", "_");

    let ris = await fetch(
      `http://ddragon.leagueoflegends.com/cdn/10.16.1/data/${userLang}/runesReforged.json`
    );

    let data = await ris.json();

    let ogg = {};

    data.forEach((runeGrandi) => {
      let r = runeGrandi;

      let rune = {};

      r.slots.forEach((runacce) => {
        runacce.runes.forEach((nonloso) => {
          rune[nonloso.key] = nonloso;
        });
      });

      ogg[runeGrandi.key] = runeGrandi;
      ogg[runeGrandi.key].rune = rune;
    });

    setRunes(ogg);
  };

  useEffect(() => {
    loadJson();
  }, []);

  const firestore = useFirestore();

  const runesRef = firestore
    .collection("Campioni")
    .doc(name)
    .collection("Runes");

  const champRunes = useFirestoreCollectionData(runesRef);

  if (typeof runes === "undefined" || champRunes.status === "loading") {
    return <div>Loading runes....</div>;
  }

  if (champRunes.data.length === 0) {
    return <div></div>;
  }

  return (
    <div>
      <div>
        <div>{runes[champRunes.data[0].principale.nome].name}</div>
        <div>
          {champRunes.data[0].principale.Rune.map((runaDb) => {
            return (
              <div key={runaDb.NO_ID_FIELD}>
                {runes[champRunes.data[0].principale.nome].rune[runaDb].name}
                <img
                  src={`https://opgg-static.akamaized.net/images/lol/perk/${
                    runes[champRunes.data[0].principale.nome].rune[runaDb].id
                  }.png`}
                  alt=""
                />
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div>{runes[champRunes.data[0].secondaria.nome].name}</div>
        <div>
          {champRunes.data[0].secondaria.Rune.map((runaDb) => {
            return (
              <div key={runaDb.NO_ID_FIELD}>
                {runes[champRunes.data[0].secondaria.nome].rune[runaDb].name}
                <img
                  src={`https://opgg-static.akamaized.net/images/lol/perk/${
                    runes[champRunes.data[0].secondaria.nome].rune[runaDb].id
                  }.png`}
                  alt=""
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Runes;
