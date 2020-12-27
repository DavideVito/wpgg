import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocDataOnce,
} from "reactfire";

import ReactTooltip from "react-tooltip";

const Abilities = ({ name, spells, abilities }) => {
  console.log(abilities);

  return (
    <div>
      <div>
        {Object.keys(spells).map(function (key) {
          return (
            <img
              key={spells[key].id}
              src={`http://ddragon.leagueoflegends.com/cdn/10.25.1/img/spell/${spells[key].image.full}`}
              alt=""
            />
          );
        })}
      </div>

      {abilities.map((abilita) => {
        return (
          <div key={abilita.NO_ID_FIELD}>
            <div></div>
            <div data-tip={spells[abilita.name].description}>
              <div>Name: {spells[abilita.name].name}</div>
            </div>
            <div>Level: {abilita.level}</div>
            <div>Key: {abilita.key}</div>
          </div>
        );
      })}
      <ReactTooltip />
    </div>
  );
};
export default Abilities;
