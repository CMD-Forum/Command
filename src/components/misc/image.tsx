import { assets_paths } from "@/lib/asset-paths";
import NextImage, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

interface ExtendedImageProps extends ImageProps {
    fallback?: string;
    width: number | `${number}`;
    height: number | `${number}`;
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
        return <NextImage onError={() => setImageFailedLoad(true)} src={fallback || assets_paths.images.posts.ImageFailed} alt="This image failed to load." {...restProps} />
    }

    return (
        <NextImage onError={() => setImageFailedLoad(true)} {...props} />
    );
}