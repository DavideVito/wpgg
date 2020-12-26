import React from "react";

import "firebase/firestore";
import {
  useFirestore,
  useFirestoreCollectionData,
  useAnalytics,
} from "reactfire";

import { Link } from "react-router-dom";

const ListaCampioni = () => {
  let firestore = useFirestore();

  useAnalytics();

  let ref = firestore.collection("Campioni");

  let campioni = useFirestoreCollectionData(ref);

  if (campioni.status === "loading") {
    return <div>Loading</div>;
  }
  console.log(campioni);

  return (
    <div>
      {campioni.data.map((campione) => {
        return (
          <div key={campione.nome}>
            <Link to={campione.nome}>{campione.nome}</Link>
          </div>
        );
      })}
    </div>
  );
};

export default ListaCampioni;
