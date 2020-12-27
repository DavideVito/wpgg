import { useFirestoreCollectionData, useFirestore } from "reactfire";

import { useEffect, useState } from "react";

const Items = ({ name, items: champItems, role }) => {
  let [items, setItems] = useState([]);

  const loadJson = async () => {
    let userLang = navigator.language || navigator.userLanguage;
    userLang = userLang.replace("-", "_");

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

  if (items.length === 0) {
    return <div>Loading items....</div>;
  }

  if (!champItems) {
    return (
      <div>
        No items for {name} as {role}
      </div>
    );
  }

  return (
    <div>
      {champItems.map((item) => {
        return (
          <div key={`${item}${Math.random()}`}>
            <div>Name: {items[item].name}</div>
            <img
              src={`http://ddragon.leagueoflegends.com/cdn/10.25.1/img/item/${item}.png`}
              alt={items[item].name}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Items;
