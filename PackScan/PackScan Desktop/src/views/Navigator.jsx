import MenuItem from "../components/MenuItem";

function Navigator() {
  return (
    <>
      <div className="h-[60vh] flex justify-center w-[80vw]">
        <div className="flex place-items-center">
          <div>
            <MenuItem url="monitor" item="Invoice Manager"/>
            <MenuItem url="storage" item="Packaging Manager"/>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navigator;
