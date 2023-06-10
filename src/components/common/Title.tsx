import React from "react";

const Title = ({ title }: { title: string }) => (
    <h1 className="h-10 bg-red-500 italic font-bold px-4 text-white text-lg flex items-center">
        {title}
    </h1>
);

export default Title;
