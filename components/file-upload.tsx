"use client" 
import toast from "react-hot-toast";

import { UploadDropzone } from "@/lib/uploadthing" 
import { ourFileRouter } from "@/app/api/uploadthing/core" 

interface FileUploadProps {
    onChange: (url?: string, filename?:string) => void;
    endpoint: keyof typeof ourFileRouter;
}; 

export const FileUpload = ({
    onChange, 
    endpoint
}: FileUploadProps) => {
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {            
                onChange(res?.[0].url, res?.[0].fileName); 
            }}
            onUploadError={(error: Error) => {
                toast.error(`${error?.message}`); 
            }}
        /> 
    )
}