import NextImage, { ImageProps } from "next/image";
import { useEffect, useState } from "react";
import TextPostIconFailed from "../../../public/TextPostFallback.svg";

interface ExtendedImageProps extends ImageProps {
    fallback?: string;
    width: number | `${number}` | undefined;
    height: number | `${number}` | undefined;
}

export default function Image(props: ExtendedImageProps) {

    const [imageFailedLoad, setImageFailedLoad] = useState(false);

    useEffect(() => {
        fetch(props.src as string).then((res) => { 
            if (!res.ok) setImageFailedLoad(true) 
        });    
    }, [props.src])

    if (imageFailedLoad) {
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const { fallback, src, alt, ...restProps } = props;
        return <NextImage onError={() => setImageFailedLoad(true)} src={fallback || TextPostIconFailed} alt="This image failed to load." {...restProps} />
    }

    return (
        <NextImage onError={() => setImageFailedLoad(true)} {...props} />
    );
}