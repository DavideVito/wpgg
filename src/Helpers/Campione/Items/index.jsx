import { useFirestoreCollectionData, useFirestore } from "reactfire";

import { useEffect, useState } from "react";

const Items = ({ name }) => {
  let [items, setItems] = useState([]);

  const loadJson = async () => {
    let userLang = navigator.language || navigator.userLanguage;
    userLang = userLang.replace("-", "_");
    console.log(userLang);

    let ris = await fetch(
      `http://ddragon.leagueoflegends.com/cdn/10.25.1/data/${userLang}/item.json`
    );

    let data = await ris.json();

    data = data.data;

    setItems(data);
  };

  useEffect(() => {
    loadJson();
  }, []);

  const firestore = useFirestore();

  const itemsRef = firestore
    .collection("Campioni")
    .doc(name)
    .collection("Items");

  const champItems = useFirestoreCollectionData(itemsRef);

  if (items.length === 0 || champItems.status === "loading") {
    return <div>Loading items....</div>;
  }

  return (
    <div>
      {champItems.data.map((item) => {
        return (
          <div key={item.id}>
            <div>Name: {items[item.id].name}</div>
            <img
              src={`http://ddragon.leagueoflegends.com/cdn/10.25.1/img/item/${item.id}.png`}
              alt={items[item.id].name}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Items;
