import { useFirestoreCollectionData, useFirestore } from "reactfire";

import { useEffect, useState } from "react";

const Runes = ({ name, runes: champRunes, role }) => {
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

  if (typeof runes === "undefined") {
    return <div>Loading runes....</div>;
  }

  if (!champRunes) {
    return (
      <div>
        No runes for {name} as {role}
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>{runes[champRunes.principale.nome].name}</div>
        <div>
          {champRunes.principale.Rune.map((runaDb) => {
            return (
              <div key={runaDb.NO_ID_FIELD}>
                {runes[champRunes.principale.nome].rune[runaDb].name}
                <img
                  src={`https://opgg-static.akamaized.net/images/lol/perk/${
                    runes[champRunes.principale.nome].rune[runaDb].id
                  }.png`}
                  alt=""
                />
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div>{runes[champRunes.secondaria.nome].name}</div>
        <div>
          {champRunes.secondaria.Rune.map((runaDb) => {
            return (
              <div key={runaDb.NO_ID_FIELD}>
                {runes[champRunes.secondaria.nome].rune[runaDb].name}
                <img
                  src={`https://opgg-static.akamaized.net/images/lol/perk/${
                    runes[champRunes.secondaria.nome].rune[runaDb].id
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
