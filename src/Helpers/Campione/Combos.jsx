import { useFirestoreCollectionData, useFirestore } from "reactfire";
const Combos = ({ name, combos }) => {
  if (!combos) {
    return <div>No combos for {name}</div>;
  }

  return (
    <div>
      {combos.map((combo) => {
        return (
          <div key={combo.NO_ID_FIELD}>
            <div>{combo.name}</div>
            <div>{combo.video && <video src={combo.video}></video>}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Combos;
