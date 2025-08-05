/**
 * ## FakeLoading
 * ---
 * Utility to show a loading screen for the specified amount of time. Use **only** to debug the loading screen or other things related to loading.
 * @param time *Defaults to 1000ms*. Amount of time in miliseconds the loading lasts.
 * @example
 * <FakeLoading time={5000} />
 */

export default async function FakeLoading({ time = 1000 }: { time?: number }) {
    await new Promise((resolve) => setTimeout(resolve, time));
    return (
        <></>
    );
}