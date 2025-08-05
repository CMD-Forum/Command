export type ToastPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center"

export default function Toaster({ position = "top-right" }: { position?: ToastPosition }) {
    const BASE_CSS = "fixed z-[999999999] flex flex-col justify-center items-center ml-5 gap-2 max-h-screen overflow-y-scroll overflow-x-hidden disable-scrollbars";
    const POSITION_CSS = {
        "top-left": "top-5 left-5",
        "top-right": "top-5 right-5",
        "bottom-left": "bottom-5 left-5",
        "bottom-right": "bottom-5 right-5",
        "top-center": "top-5 left-1/2 transform -translate-x-1/2",
        "bottom-center": "bottom-5 left-1/2 transform -translate-x-1/2"
    }[position];

    return (
        <div id="Toaster" className={`${BASE_CSS} ${POSITION_CSS}`} />
    );
}