import { useState, useEffect } from "react";

const Runes = () => {
  let [runes, setRunes] = useState(undefined);

  let [selectedGroup, setSelectedGroup] = useState(-1);

  const loadJson = async () => {
    let ris = await fetch(
      `http://ddragon.leagueoflegends.com/cdn/10.16.1/data/en_GB/runesReforged.json`
    );

    let data = await ris.json();

    setRunes(data);
    setSelectedGroup(0);
    console.log(data);
  };

  useEffect(() => {
    loadJson();
  }, []);

  if (!runes || selectedGroup === -1) {
    return <div>Loading runes...</div>;
  }

  return (
    <div>
      <h1>Runes</h1>
      <h3>{runes.length}</h3>
      <select
        onChange={(e) => {
          setSelectedGroup(e.target.selectedIndex);
        }}
      >
        {runes.map((runa) => {
          return <option value={runa.key}>{runa.name}</option>;
        })}
      </select>

      <div>
        {runes[selectedGroup].slots.map((slot) => {
          return (
            <div>
              <select>
                {slot.runes.map((r) => {
                  return <option value={r.key}>{r.name}</option>;
                })}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Runes;
