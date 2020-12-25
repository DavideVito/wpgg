import { useFirestoreCollectionData, useFirestore } from "reactfire";
const Combos = ({ name }) => {
  const firestore = useFirestore();

  const combosRef = firestore
    .collection("Campioni")
    .doc(name)
    .collection("Combo");

  const combos = useFirestoreCollectionData(combosRef);

  if (combos.status === "loading") {
    return <div>Loading {name} abilities...</div>;
  }

  return (
    <div>
      {combos.data.map((combo) => {
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
