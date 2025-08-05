import Typography from "./typography";

export default function Divider({ text }: { text?: string }) {
    return (
            <div className="flex items-center mt-7 mb-7">
                <hr className="grow" />
                { text && 
                    <>
                        <Typography variant="p" secondary centered className="mx-4">{text}</Typography>
                        <hr className="grow" />                    
                    </>
                }
            </div>
    );
}