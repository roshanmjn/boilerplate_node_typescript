export const guid = () => {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    return s4() + s4() + "-" + s4() + s4() + "-" + s4() + s4();
};
export const custom_string_uid = (string: string) => {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    const newString = string.replace(/[^a-zA-Z0-9\s]/g, "").toLocaleLowerCase();
    return newString.replace(/[,\s!@#+.]/g, "-") + "-" + s4() + s4();
};
