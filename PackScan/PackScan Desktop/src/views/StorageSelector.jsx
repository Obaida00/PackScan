import MenuItem from "../components/MenuItem";

function StorageSelector(){
    return(
        <div className="h-[60vh] flex justify-center w-[80vw]">
        <div className="flex place-items-center">
          <div>
            <MenuItem url="storage/almousoaa" item="Almousoaa"/>
            <MenuItem url="storage/advanced" item="Almousoaa Advanced"/>
            <MenuItem url="/" item="Back"/>
          </div>
        </div>
      </div>
    )
}

export default StorageSelector;