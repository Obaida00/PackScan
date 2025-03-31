import * as React from "react";
import MenuItem from "../../shared/components/MenuItem.jsx";
import BackButton from "../../shared/components/BackButton.jsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function StorageSelector() {
  const {t} = useTranslation();
  const [storageList, setStorageList] = useState([]);

React.useEffect(() => {
  const fetchStorages = async () => {
    try {
      const storages = await ipcRenderer.invoke("fetch-storages");
      setStorageList(storages.data || []);
    } catch (error) {
      console.error("Error fetching storages:", error);
    }
  };

  fetchStorages();
}, []);

  return (
    <div className="h-[60vh] flex justify-center w-[80vw]">
      <div className="flex place-items-center">
        <div>
          <BackButton />
          {storageList.map((storage) => (
            <MenuItem
              key={storage.id}
              url={storage.id}
              item={t("storage."+storage.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default StorageSelector;
