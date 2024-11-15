import Popup from "reactjs-popup";
import "/src/assets/css/modal.css";

function PackingInvoiceModal({ invoice }) {
  //TODO open file when clicked
  return (
    <Popup
      trigger={
        <svg
          xmlns="http://wwz.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="gray"
          className="inline-flex justify-end cursor-pointer me-10"
        >
          <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
        </svg>
      }
      modal
    >
      {(close) => (
        <div className="flex items-center justify-center">
          <div className="modal bg-slate-50 rounded-3xl overflow-hidden">
            <div className="flex items-center justify-between p-4 md:p-5 border-b bg-slate-100">
              <h3 className="text-3xl font-mono font-semibold text-gray-900 pl-5">
                {invoice.id}
              </h3>
              <button
                onClick={close}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition-colors duration-300"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>
            <div className="item"> {invoice.manager} </div>
            <div className="item"> {invoice.pharmacist} </div>
            <div className="item bg-slate-300 font-bold tracking-wider">
              {" "}
              {invoice.status}{" "}
            </div>
          </div>
        </div>
      )}
    </Popup>
  );
}

export default PackingInvoiceModal;
