import { useState, useEffect } from "react";
import { useFirestore } from "reactfire";
import DebounceInput from "react-debounce-input";

const Items = ({ champion }) => {
  const firestore = useFirestore();

  let [items, setItems] = useState([]);
  let [searchedItems, setSearchedItems] = useState([]);
  let [selectedItems, setSelectedItems] = useState([]);

  const loadItemsJson = async () => {
    let ris = await fetch(
      `http://ddragon.leagueoflegends.com/cdn/10.25.1/data/en_GB/item.json`
    );

    let data = await ris.json();

    data = data.data;

    setItems(data);
  };
  useEffect(() => {
    loadItemsJson();
  }, []);

  const addItem = (item) => {
    let a = [...selectedItems, item];

    setSelectedItems(a);
  };

  const cercaItem = (nomeItem) => {
    if (nomeItem === "") {
      setSearchedItems([]);
    }

    let it = Object.keys(items).map(function (key) {
      let i = items[key];

      let esito = i.name.toLowerCase().startsWith(nomeItem.toLowerCase());

      return esito ? i : undefined;
    });

    it = it.filter((i) => {
      return typeof i !== "undefined";
    });

    setSearchedItems(it);
  };

  const pushItemsToDatabase = () => {
    if (!champion || !champion.id) {
      alert("No champion");
      return;
    }
    selectedItems.forEach((item) => {
      let id = item.image.full.split(".")[0];

      firestore
        .collection("Campioni")
        .doc(champion.id)
        .collection("Items")
        .add({ id: id });
    });
  };

  return (
    <>
      <h1>Cerca item</h1>
      <div>
        <DebounceInput
          minLength={2}
          debounceTimeout={300}
          onChange={(event) => cercaItem(event.target.value)}
        />

        {searchedItems.map((item) => {
          return (
            <div>
              <div>
                <div>{item.name}</div>
                <img
                  style={{ cursor: "pointer" }}
                  src={`http://ddragon.leagueoflegends.com/cdn/10.25.1/img/item/${item.image.full}`}
                  alt={item.name}
                  onClick={() => {
                    addItem(item);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <h1>Added items, clicca per rimuovere </h1>
        <div>Item selected: {selectedItems.length}</div>
        {selectedItems.map((item, index) => {
          console.log(item);
          return (
            <div>
              <img
                style={{ cursor: "pointer" }}
                src={`http://ddragon.leagueoflegends.com/cdn/10.25.1/img/item/${item.image.full}`}
                alt={item.name}
                onClick={() => {
                  selectedItems.splice(index, 1);
                  let a = [...selectedItems];

                  setSelectedItems(a);
                }}
              />
            </div>
          );
        })}

        <button onClick={pushItemsToDatabase}>Push to DB</button>
      </div>
    </>
  );
};

export default Items;
