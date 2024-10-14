import { useEffect, useState } from "react";

function ProgressBar({ currentCount, totalCount, color }) {
    const [barSytle, setBarStyle] = useState({});
    useEffect(() => {
        var percentage = (100 * currentCount) / totalCount;

        //update progress width and color
        setBarStyle((prevState) => {
            var newState = { ...prevState };
            newState["background-color"] = color;
            newState.width = percentage
                ? `${Math.min(percentage, 100)}%`
                : "0%";
            return newState;
        });
    }, [, currentCount]);

    return (
        <div className="flex place-items-center justify-between gap-8 px-4">
            <div class="w-full bg-white opacity-80 rounded-full h-full">
                <div class="h-2.5 rounded-full" style={barSytle}></div>
            </div>
            <span class="text-sm font-medium text-slate-200">{`${currentCount} / ${totalCount}`}</span>
        </div>
    );
}

export default ProgressBar;
