function Decrement({ data, action }) {
    return (
        <div className="w-full flex">
            <button
                className="w-full rounded-full bg-red-500 hover:bg-red-700 opacity-40 hover:opacity-100 font-serif font-black transition-all duration-100"
                onClick={() => action(data.barcode)}
            >
                -
            </button>
        </div>
    );
}

export default Decrement;
